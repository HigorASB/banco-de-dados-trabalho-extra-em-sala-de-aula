import "dotenv/config";
import mongoose from "mongoose";
import { colecoesParaCriar } from "./seed-colecoes.js";
import { droparColecao } from "./dropar-colecao.js";

export const conexaoMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL + process.env.MONGO_DATABASE);
    console.log("Conectou-se ao MongoDB");

    // Descomente a linha abaixo para criar as coleções automaticamente na inicialização
    await colecoesParaCriar();

    // Descomente a linha abaixo para dropar coleções (cuidado!)
    // await droparColecao();
  } catch (error) {
    console.error("Erro ao conectar no MongoDB", error);
  }
};
