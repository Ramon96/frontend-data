// This function retrieves the data from the end point
export async function runQuery(url, query){
    let request =  fetch(url+"?query="+ encodeURIComponent(query) +"&format=json");

    let respons = await request;
    let handleRespons = await respons.json();
    
    return handleRespons;
}