// I build this with the use of curran kelleher tutorials
// https://www.youtube.com/watch?v=Qw6uAg3EO64&t=1s
// I used laurens example to make the legend
// https://vizhub.com/Razpudding/921ee6d44b634067a2649f738b6a3a6e

import { select, json, tsv, geoPath, geoNaturalEarth1, zoom, event } from "d3";
import { feature } from 'topojson';
import { getQuery } from './getData.js';

const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-39/sparql";
const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    
    
SELECT  ?typeLabel (SAMPLE(?cho) AS ?filtercho) ?title ?lat ?long  (COUNT(?cho) AS ?choCount) WHERE {
      <https://hdl.handle.net/20.500.11840/termmaster13440> skos:narrower ?type .
      ?type skos:prefLabel ?typeLabel .
      ?cho dc:title ?title.
      
      ?cho edm:object ?type .
      
      ?place skos:exactMatch/wgs84:lat ?lat .
      ?place skos:exactMatch/wgs84:long ?long .     
    
    }`;

getQuery(url, query).then(data => {
	init(data.results.bindings)
})

function init(places){
const svg = select('svg');
const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);
const g = svg.append('g');
  
const category = places[0].typeLabel.value
  
  const cats = places.map(entry => entry.typeLabel.value);
  
  const colorscale = d3.scaleOrdinal()
  	.domain(cats)
    .range(d3.schemeCategory10);
  

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}))

	
svg.call(zoom().on('zoom', () => {
		g.attr('transform', event.transform);
}));
  
    const legend = svg.selectAll(".legend")
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


Promise.all([
  tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
  json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {
  		const countryName = tsvData.reduce((accumulator, row) => {
  			accumulator[row.iso_n3] = row.name;
      		return accumulator;
      }, {});
  
			const country = feature(topoJSONdata, topoJSONdata.objects.countries);
        g.selectAll('path')
          .data(country.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('d', d => pathGenerator(d))
        .append('title')
        	.text(d => countryName[d.id]);
  
  	g.selectAll('circle')
  		.data(places)
						  .enter().append("circle")
						  .attr("transform", function(d) {
								return "translate(" + projection([d.long.value, d.lat.value]) + ")";
						  })
							.style('fill', function(d){
                return colorscale(d.typeLabel.value)
              })
              .transition()
                  .delay(1000)
                  .duration(700)
                  .ease(d3.easeBounce)
						  .attr("r", 1)
});
}
