import {runQuery } from './runQuery.js';

async function getQuery(url, query){
    const data = await runQuery(url, query);
  
  	return data;
}

export { getQuery };