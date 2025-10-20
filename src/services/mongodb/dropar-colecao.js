import mongoose from "mongoose"
import { retorno } from "../retorno.js"

// o parâmetro da função {colecoes} é um array contendo
// nomes das coleções a serem dropadas
// *** se for passado um array vazio , dropar todas as coleções
export const droparColecao = async (colecoes) => {
    try {
        const { db } = mongoose.connection;
        const todasAsColecoes = await db.listCollections().toArray()
        const arrayColecoesExistentes = todasAsColecoes.map(colecao => colecao.name) 

        if(!colecoes || colecoes.length === 0){
            arrayColecoesExistentes.map(async (colecao) => {
                return await db.dropCollection(colecao)
            })
            return retorno('Todas as coleções foram dropadas.', false)
        }

        let colecoesInexistentes = []
        let colecoesDropadas = []
        colecoes.map(async (colecao) => {
            if(!arrayColecoesExistentes.includes(colecao))
                return colecoesInexistentes.push(colecao)

            colecoesDropadas.push(colecao)
            return await db.dropCollection(colecao)
        })

        if(colecoesDropadas.length === 0)
        return retorno(`As coleções [${colecoesInexistentes}] não foram dropadas pois não existem.`, false)

        return retorno(`As coleções [${colecoesDropadas}] foram dropadas com sucesso.`, false)
       
    } catch (error) {
        return retorno('Erro ao executar o drop das coleções', true)
    }
}