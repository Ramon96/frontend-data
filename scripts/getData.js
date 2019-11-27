import {runQuery } from './runQuery.js';

async function getQuery(url, query){
    const data = await runQuery(url, query);
    const cleanData = cleanUp(data.results.bindings);
  	return cleanData;
}

function cleanUp(dataObject){
 return dataObject.map(d => {
    return {
      title: d.title.value,
      typeLabel: d.typeLabel.value,
      long: d.long.value,
      lat: d.lat.value,
      count: d.choCount.value,
    }
  })
}

export { getQuery };