import { Pedido } from "../../models/mongodb/Pedido.js";

// Listar todos os pedidos do MongoDB
export async function list(req, res) {
  try {
    const pedidos = await Pedido.find();

    res.status(200).send({
      message: "Dados consultados com sucesso.",
      data: pedidos,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      message: "Erro no servidor.",
      data: error.message,
      error: true,
    });
  }
}

// Buscar pedido por ID do MongoDB
export async function listById(req, res) {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).send({
        message: "Pedido não encontrado.",
        data: {},
        error: false,
      });
    }

    return res.status(200).send({
      message: "Dados consultados com sucesso.",
      data: pedido,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      message: "Erro no servidor.",
      data: error.message,
      error: true,
    });
  }
}

// Criar novo pedido no MongoDB
export async function create(req, res) {
  try {
    const { data_pedido, cliente, valor_total, itens } = req.body;

    if (!cliente || !valor_total) {
      return res.status(400).send({
        message: "Campos obrigatórios: cliente, valor_total",
        data: {},
        error: true,
      });
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).send({
        message: "O pedido deve conter ao menos um item",
        data: {},
        error: true,
      });
    }

    const novoPedido = new Pedido({
      data_pedido: data_pedido || new Date(),
      cliente,
      valor_total,
      itens,
    });
    await novoPedido.save();

    res.status(201).send({
      message: "Pedido criado com sucesso.",
      data: novoPedido,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      message: "Erro no servidor.",
      data: error.message,
      error: true,
    });
  }
}

// Atualizar pedido no MongoDB
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { data_pedido, cliente, valor_total, itens } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { data_pedido, cliente, valor_total, itens },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).send({
        message: "Pedido não encontrado.",
        data: {},
        error: false,
      });
    }

    res.status(200).send({
      message: "Pedido atualizado com sucesso.",
      data: pedido,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      message: "Erro no servidor.",
      data: error.message,
      error: true,
    });
  }
}

// Deletar pedido do MongoDB
export async function remove(req, res) {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByIdAndDelete(id);

    if (!pedido) {
      return res.status(404).send({
        message: "Pedido não encontrado.",
        data: {},
        error: false,
      });
    }

    res.status(200).send({
      message: "Pedido deletado com sucesso.",
      data: pedido,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      message: "Erro no servidor.",
      data: error.message,
      error: true,
    });
  }
}
