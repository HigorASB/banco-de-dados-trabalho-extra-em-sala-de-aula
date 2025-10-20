import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    estoque: { type: Number, required: true },
    id_marca: { type: Number, required: true }, // ID da marca no MySQL
    marca_nome: { type: String, required: true }, // Nome da marca para facilitar consultas
  },
  {
    timestamps: true,
    collection: "produtos",
  }
);

export const Produto = mongoose.model("Produto", produtoSchema);
