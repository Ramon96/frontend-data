import { getQuery } from './scripts/getData';
import { 
  select, 
  scaleLinear, 
  max, 
  scaleBand, 
  axisLeft, 
  axisBottom, 
  json,
  tsv,
  geoPath,
  geoNaturalEarth1,
  zoom,
  event
} from 'd3';

import * as d3 from 'd3';

import d3Tip from 'd3-tip';
d3.tip = d3Tip;

import { feature } from 'topojson';




const endpoint = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-39/sparql";

const countQuery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
SELECT ?title ?typeLabel ?long ?lat ?plaats (SAMPLE(?cho) as ?filtered)  (COUNT(?cho) AS ?choCount) WHERE {
  <https://hdl.handle.net/20.500.11840/termmaster13440> skos:narrower ?type .
  ?type skos:prefLabel ?typeLabel .
  # geef objecten van een soort wapen
  ?cho dc:title ?title.
  ?cho edm:object ?type .
  
  ?plaats skos:exactMatch/wgs84:lat ?lat . 
  ?plaats skos:exactMatch/wgs84:long ?long .
}
`;



getQuery(endpoint, countQuery).then(data =>{


  init(data)
})



function init(data){
  const maskData = d3.nest()
  .key(function(d) { return d.typeLabel; })
  .entries(data);

// console.log(data[0].typeLabel)

// map
  const svgMap = select('.map');
  const projection = geoNaturalEarth1();
  const pathGenerator = geoPath().projection(projection);
  const gMap = svgMap.append('g');

  // barChart 
    const barTooltip = d3.tip().attr('class', 'd3-tip').html(function (d) {
      const returnValue = d.typeLabel + ": " + d.count;
      return returnValue ;
    });
  const svgBar = select('.barChart')
  .call(barTooltip);
  const width = +svgBar.attr("width");
  const height = +svgBar.attr("height");

  // console.log(d)
  const xValue = d => +d.count;
  const yValue = d=> d.typeLabel;


  const margin = {top: 20, right : 100, left: 180, bottom: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = scaleLinear()
  	.domain([0, max(data, xValue)])
  	.range([0, innerWidth])
  
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0, innerHeight])
  	.padding(0.1)
  
  const items = data.map(index => index.typeLabel);
  const colorscale = d3.scaleOrdinal()
  .domain(items)
  .range(d3.schemeCategory10);
  
  const g = svgBar.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  g.append('g').call(axisLeft(yScale));
  g.append('g').call(axisBottom(xScale))
  .attr('transform', `translate(0, ${innerHeight})`)

  	
	g.selectAll('rect')
  	.data(data)
  	.enter()
  	.append('rect')
  	.attr('y', d => yScale(yValue(d)))
  	.attr('width', d => xScale(xValue(d)))
    .attr('height', yScale.bandwidth())
    .style('fill', function(d){
      return colorscale(d.typeLabel)
    })
    .on('mouseenter', barTooltip.show)
    .on('mouseleave', barTooltip.hide)
  	.append('title')
      .text(d => xValue(d))

    
  g.append('text')
    .text('Hoeveelheid maskers per functie')
    
//map code
svgMap.call(zoom().on('zoom', () => {
  gMap.attr('transform', event.transform);
}));

const legend = svgMap.selectAll(".legend")
.data(colorscale.domain())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })


legend.append("rect")
.attr("x", 190 - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", colorscale);

legend.append("text")
.attr("x", 185 - 24)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) { return d; })

  gMap.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}))

  Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
  ]).then(([tsvData, topoJSONdata]) => {
        const countryName = tsvData.reduce((accumulator, row) => {
          accumulator[row.iso_n3] = row.name;
            return accumulator;
        }, {});
    
        const country = feature(topoJSONdata, topoJSONdata.objects.countries);
          gMap.selectAll('path')
            .data(country.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', d => pathGenerator(d))
          .append('title')
            .text(d => countryName[d.id]);
    
      gMap.selectAll('circle')
        .data(maskData[0].values)
                .enter().append("circle")
                .attr("transform", function(d) {
                 //console.log(d.values.map(item => item.long))
                  return "translate(" + projection([d.long, d.lat]) + ")";
                })
                .style('fill', function(d){
                  return colorscale(d.typeLabel)
                })
                .transition()
                    .delay(1000)
                    .duration(700)
                    .ease(d3.easeBounce)
                .attr("r", 1)
  });

}




