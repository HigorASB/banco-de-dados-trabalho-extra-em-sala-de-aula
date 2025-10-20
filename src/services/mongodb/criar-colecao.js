import mongoose from "mongoose"
import { retorno } from "../retorno.js"

// o parametro da função {colecoes} é um array contendo objetos que possuem
// nome da coleção { name } 
// schema da coleção { schema }
export const criarColecao = async (colecoes) => {
    try {
       if(colecoes.length == 0){
        return retorno('Não existem coleções para serem adicionadas', true)
       }

       const { db } = mongoose.connection;
       const todasAsColecoes = await db.listCollections().toArray()
       const arrayColecoesExistentes = todasAsColecoes.map(colecao => colecao.name)

       let colecoesExistentes = []
       let colecoesCriadas = []
       colecoes.map((colecao) => {
        if(arrayColecoesExistentes.includes(colecao.name))
            return colecoesExistentes.push(colecao.name)
        
        colecoesCriadas.push(colecao.name)
        return mongoose.model(colecao.name, colecao.schema)
       })

       if(colecoesCriadas.length === 0)
        return retorno('Não foram criadas novas coleções', false)

       return retorno(`As coleções ${colecoesCriadas} foram criadas com sucesso.`, false)
       
    } catch (error) {
        return retorno('Erro ao executar a criação das coleções', true)
    }
}