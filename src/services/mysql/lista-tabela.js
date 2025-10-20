import { database } from "../../database/index.js";

export async function listFromTable(table){

    // const query = await database(table).select();
    const query = await database.raw('SELECT * FROM marcas;'); 
    return query[0];
}