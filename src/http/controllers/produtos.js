import { Produto } from "../../models/mongodb/Produto.js";

// Listar todos os produtos do MongoDB
export async function list(req, res) {
  try {
    const produtos = await Produto.find();

    res.status(200).send({
      message: "Dados consultados com sucesso.",
      data: produtos,
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

// Buscar produto por ID do MongoDB
export async function listById(req, res) {
  try {
    const { id } = req.params;
    const produto = await Produto.findById(id);

    if (!produto) {
      return res.status(404).send({
        message: "Produto não encontrado.",
        data: {},
        error: false,
      });
    }

    return res.status(200).send({
      message: "Dados consultados com sucesso.",
      data: produto,
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

// Criar novo produto no MongoDB
export async function create(req, res) {
  try {
    const { nome, preco, estoque, id_marca, marca_nome } = req.body;

    if (!nome || !preco || !estoque || !id_marca || !marca_nome) {
      return res.status(400).send({
        message:
          "Todos os campos são obrigatórios: nome, preco, estoque, id_marca, marca_nome",
        data: {},
        error: true,
      });
    }

    const novoProduto = new Produto({
      nome,
      preco,
      estoque,
      id_marca,
      marca_nome,
    });
    await novoProduto.save();

    res.status(201).send({
      message: "Produto criado com sucesso.",
      data: novoProduto,
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

// Atualizar produto no MongoDB
export async function update(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco, estoque, id_marca, marca_nome } = req.body;

    const produto = await Produto.findByIdAndUpdate(
      id,
      { nome, preco, estoque, id_marca, marca_nome },
      { new: true, runValidators: true }
    );

    if (!produto) {
      return res.status(404).send({
        message: "Produto não encontrado.",
        data: {},
        error: false,
      });
    }

    res.status(200).send({
      message: "Produto atualizado com sucesso.",
      data: produto,
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

// Deletar produto do MongoDB
export async function remove(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByIdAndDelete(id);

    if (!produto) {
      return res.status(404).send({
        message: "Produto não encontrado.",
        data: {},
        error: false,
      });
    }

    res.status(200).send({
      message: "Produto deletado com sucesso.",
      data: produto,
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
