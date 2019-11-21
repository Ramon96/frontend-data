import {data} from '../input/input.js';

console.log(fixCoordinates(stringToArray(data)));

function stringToArray(string){
    return  string.split('\n');
}

//deze functie zorgt voor het opschonen van de vuile data
function fixCoordinates(geo){
  const newData = geo.map(item => {
    if(!isNumber(item)){
        return removeBrackets(item);
      }
      if(item.includes("°")){
        // Als je in deze if statement komt dan is het item in DMS formaat genoteerd
        return convertDMS(item)
      }
      if(isNumber(item) && !item.includes("°")){
        // als het niet in dms formaat is en als het een getal is dan is hij gewoon goed.
        return item;
      }
  }).filter(item => {return item != null})

  return newData;
}

function removeBrackets(item){
  if(item.startsWith("(")){
    return item.replace(/[()]/g, "");
  }
}

function convertDMS(item){
      let dms = item.split(/[^\d\w\.]+/);
      let lat = calculateDMS(dms[0], dms[1], dms[2], dms[3]);
      let long = calculateDMS(dms[4], dms[5], dms[6], dms[7]);
      const latlong = lat + "," +  long;
      return latlong;
}

//Deze functie rekend het dms formaat om naar een decimal formaat
function calculateDMS(degree, minute, second, direction){
  //deze functie heb ik helaas niet zelf bedacht en heb ik af moeten kijken op stack overflow
// https://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values
  let decimal =  Number(degree) + Number(minute)/60 + Number(second)/(60*60);
  if(direction == "S"  || direction == "W" ){
    decimal = decimal * -1;
  }

  return decimal;
}

//deze functie kijkt of de waarde een getal is.
function isNumber(value){
  return Number.isInteger(parseInt(value));
}