import * as marcasController from "../controllers/marcas.js";
import * as produtosController from "../controllers/produtos.js";
import * as pedidosController from "../controllers/pedidos.js";
import {
  sincronizarTudo,
  sincronizarColecao,
} from "../../services/sincronizacao/mongo-para-mysql.js";

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
