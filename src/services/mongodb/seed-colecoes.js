import mongoose from "mongoose";
import { criarColecao } from "./criar-colecao.js";

export const colecoesParaCriar = async () => {
  const marcasSchema = {
    name: "marcas",
    schema: new mongoose.Schema({
      nome: { type: String, required: true },
      site: { type: String, required: true },
      telefone: { type: String, required: true },
    }),
  };

  const produtosSchema = {
    name: "produtos",
    schema: new mongoose.Schema({
      nome: { type: String, required: true },
      preco: { type: Number, required: true },
      estoque: { type: Number, required: true },
      marca: { type: String, required: true },
    }),
  };

  const pedidosSchema = {
    name: "pedidos",
    schema: new mongoose.Schema({
      data_pedido: { type: String, required: true },
      cliente: { type: String, required: true },
      valor_total: { type: Number, required: true },
    }),
  };

  return await criarColecao([marcasSchema, produtosSchema, pedidosSchema]);
};
