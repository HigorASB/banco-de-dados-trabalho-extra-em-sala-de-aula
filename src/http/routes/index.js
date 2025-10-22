import * as marcasController from "../controllers/marcas.js";
import * as produtosController from "../controllers/produtos.js";
import * as pedidosController from "../controllers/pedidos.js";
import {
  sincronizarTudo,
  sincronizarColecao,
} from "../../services/sincronizacao/mongo-para-mysql.js";
import { database } from "../../database/index.js";

export const routes = async (app) => {
  // Rota de teste
  app.get("/", (req, res) => {
    res.status(200).send({ message: "API Ok - MongoDB + MySQL" });
  });

  // ========== ROTAS DE MARCAS (MongoDB) ==========
  app.get("/marcas", marcasController.list);
  app.get("/marcas/:id", marcasController.listById);
  app.post("/marcas", marcasController.create);
  app.put("/marcas/:id", marcasController.update);
  app.delete("/marcas/:id", marcasController.remove);

  // ========== ROTAS DE PRODUTOS (MongoDB) ==========
  app.get("/produtos", produtosController.list);
  app.get("/produtos/:id", produtosController.listById);
  app.post("/produtos", produtosController.create);
  app.put("/produtos/:id", produtosController.update);
  app.delete("/produtos/:id", produtosController.remove);

  // ========== ROTAS DE PEDIDOS (MongoDB) ==========
  app.get("/pedidos", pedidosController.list);
  app.get("/pedidos/:id", pedidosController.listById);
  app.post("/pedidos", pedidosController.create);
  app.put("/pedidos/:id", pedidosController.update);
  app.delete("/pedidos/:id", pedidosController.remove);

  // ========== ROTAS DE CONSULTA MYSQL (para facilitar) ==========
  // Consultar marcas no MySQL
  app.get("/mysql/marcas", async (req, res) => {
    try {
      const marcas = await database("marcas").select();
      return res.status(200).send({
        message: "Marcas do MySQL",
        data: marcas,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erro ao consultar MySQL",
        erro: error.message,
      });
    }
  });

  // Consultar produtos no MySQL
  app.get("/mysql/produtos", async (req, res) => {
    try {
      const produtos = await database("produtos")
        .select("produtos.*", "marcas.nome as marca_nome")
        .leftJoin("marcas", "produtos.id_marca", "marcas.id");
      return res.status(200).send({
        message: "Produtos do MySQL",
        data: produtos,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erro ao consultar MySQL",
        erro: error.message,
      });
    }
  });

  // Consultar pedidos no MySQL
  app.get("/mysql/pedidos", async (req, res) => {
    try {
      const pedidos = await database("pedidos")
        .select("pedidos.*", "clientes.nome as cliente_nome")
        .leftJoin("clientes", "pedidos.id_cliente", "clientes.id");
      return res.status(200).send({
        message: "Pedidos do MySQL",
        data: pedidos,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Erro ao consultar MySQL",
        erro: error.message,
      });
    }
  });

  // ========== ROTAS DE SINCRONIZAÇÃO (MongoDB -> MySQL) ==========
  // Sincronizar todas as coleções
  app.post("/sync", async (req, res) => {
    try {
      const resultado = await sincronizarTudo();
      return res.status(200).send(resultado);
    } catch (error) {
      return res.status(500).send({
        sucesso: false,
        mensagem: "Erro ao sincronizar",
        erro: error.message,
      });
    }
  });

  // Sincronizar uma coleção específica
  app.post("/sync/:colecao", async (req, res) => {
    try {
      const { colecao } = req.params;
      const resultado = await sincronizarColecao(colecao);
      return res.status(200).send(resultado);
    } catch (error) {
      return res.status(500).send({
        sucesso: false,
        mensagem: "Erro ao sincronizar",
        erro: error.message,
      });
    }
  });
};
