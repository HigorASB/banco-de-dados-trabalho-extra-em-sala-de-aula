import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    site: { type: String, required: true },
    telefone: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "marcas",
  }
);

export const Marca = mongoose.model("Marca", marcaSchema);
