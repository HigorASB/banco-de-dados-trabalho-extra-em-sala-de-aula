import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema(
  {
    data_pedido: { type: Date, required: true, default: Date.now },
    cliente: { type: String, required: true },
    valor_total: { type: Number, required: true },
    itens: [
      {
        id_produto: { type: Number, required: true },
        produto_nome: { type: String, required: true },
        quantidade: { type: Number, required: true },
        preco_unitario: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    collection: "pedidos",
  }
);

export const Pedido = mongoose.model("Pedido", pedidoSchema);
