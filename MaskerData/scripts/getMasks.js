import {runQuery } from './helpers/runQuery.js';

function getQuery(){
    const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-39/sparql";
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    
    
    SELECT  ?typeLabel ?cho ?title ?lat ?long  (COUNT(?cho) AS ?choCount) WHERE {
      <https://hdl.handle.net/20.500.11840/termmaster13440> skos:narrower ?type .
      ?type skos:prefLabel ?typeLabel .
      ?cho dc:title ?title.
      
      ?cho edm:object ?type .
      
      ?place skos:exactMatch/wgs84:lat ?lat .
      ?place skos:exactMatch/wgs84:long ?long .     
    
    }
    
    ORDER BY DESC(?typeLabel)
    
    `;

    runQuery(url, query).then(json => {
        const result = json.results.bindings;
        console.log(result);
    });
}

getQuery();