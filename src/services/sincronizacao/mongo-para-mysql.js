import { database } from "../../database/index.js";
import { Marca } from "../../models/mongodb/Marca.js";
import { Produto } from "../../models/mongodb/Produto.js";
import { Pedido } from "../../models/mongodb/Pedido.js";

/**
 * Sincroniza as marcas do MongoDB para o MySQL
 */
async function sincronizarMarcas() {
  try {
    const marcasMongo = await Marca.find();
    const resultados = {
      inseridas: 0,
      atualizadas: 0,
      erros: [],
    };

    for (const marca of marcasMongo) {
      try {
        // Verifica se a marca já existe no MySQL (por nome, já que o ID do Mongo é diferente)
        const marcaExistente = await database("marcas")
          .where("nome", marca.nome)
          .first();

        if (marcaExistente) {
          // Atualiza a marca existente
          await database("marcas").where("id", marcaExistente.id).update({
            site: marca.site,
            telefone: marca.telefone,
          });
          resultados.atualizadas++;
        } else {
          // Insere nova marca
          await database("marcas").insert({
            nome: marca.nome,
            site: marca.site,
            telefone: marca.telefone,
          });
          resultados.inseridas++;
        }
      } catch (error) {
        resultados.erros.push({
          marca: marca.nome,
          erro: error.message,
        });
      }
    }

    return {
      tabela: "marcas",
      total: marcasMongo.length,
      ...resultados,
    };
  } catch (error) {
    return {
      tabela: "marcas",
      erro: error.message,
    };
  }
}

/**
 * Sincroniza os produtos do MongoDB para o MySQL
 */
async function sincronizarProdutos() {
  try {
    const produtosMongo = await Produto.find();
    const resultados = {
      inseridos: 0,
      atualizados: 0,
      erros: [],
    };

    for (const produto of produtosMongo) {
      try {
        // Verifica se a marca existe no MySQL
        const marcaMySQL = await database("marcas")
          .where("id", produto.id_marca)
          .first();

        if (!marcaMySQL) {
          resultados.erros.push({
            produto: produto.nome,
            erro: `Marca com ID ${produto.id_marca} não encontrada no MySQL`,
          });
          continue;
        }

        // Verifica se o produto já existe no MySQL (por nome e marca)
        const produtoExistente = await database("produtos")
          .where("nome", produto.nome)
          .where("id_marca", produto.id_marca)
          .first();

        if (produtoExistente) {
          // Atualiza o produto existente
          await database("produtos").where("id", produtoExistente.id).update({
            preco: produto.preco,
            estoque: produto.estoque,
          });
          resultados.atualizados++;
        } else {
          // Insere novo produto
          await database("produtos").insert({
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.estoque,
            id_marca: produto.id_marca,
          });
          resultados.inseridos++;
        }
      } catch (error) {
        resultados.erros.push({
          produto: produto.nome,
          erro: error.message,
        });
      }
    }

    return {
      tabela: "produtos",
      total: produtosMongo.length,
      ...resultados,
    };
  } catch (error) {
    return {
      tabela: "produtos",
      erro: error.message,
    };
  }
}

/**
 * Sincroniza os pedidos do MongoDB para o MySQL
 */
async function sincronizarPedidos() {
  try {
    const pedidosMongo = await Pedido.find();
    const resultados = {
      inseridos: 0,
      atualizados: 0,
      erros: [],
    };

    for (const pedido of pedidosMongo) {
      try {
        // Verifica se o cliente existe no MySQL
        let clienteMySQL = await database("clientes")
          .where("nome", pedido.cliente)
          .first();

        // Se o cliente não existe, cria um novo (com dados fictícios para email e cidade)
        if (!clienteMySQL) {
          const [clienteId] = await database("clientes").insert({
            nome: pedido.cliente,
            email: `${pedido.cliente
              .toLowerCase()
              .replace(/\s+/g, "")}@email.com`,
            cidade: "Não informado",
          });
          clienteMySQL = { id: clienteId };
        }

        // Verifica se o pedido já existe no MySQL (por data e cliente)
        const pedidoExistente = await database("pedidos")
          .where("data_pedido", pedido.data_pedido)
          .where("id_cliente", clienteMySQL.id)
          .first();

        if (pedidoExistente) {
          // Atualiza o pedido existente
          await database("pedidos").where("id", pedidoExistente.id).update({
            valor_total: pedido.valor_total,
          });

          // Remove os itens antigos
          await database("itens_pedidos")
            .where("id_pedido", pedidoExistente.id)
            .delete();

          // Insere os novos itens
          for (const item of pedido.itens) {
            await database("itens_pedidos").insert({
              id_pedido: pedidoExistente.id,
              id_produto: item.id_produto,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
            });
          }

          resultados.atualizados++;
        } else {
          // Insere novo pedido
          const [pedidoId] = await database("pedidos").insert({
            data_pedido: pedido.data_pedido,
            id_cliente: clienteMySQL.id,
            valor_total: pedido.valor_total,
          });

          // Insere os itens do pedido
          for (const item of pedido.itens) {
            await database("itens_pedidos").insert({
              id_pedido: pedidoId,
              id_produto: item.id_produto,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
            });
          }

          resultados.inseridos++;
        }
      } catch (error) {
        resultados.erros.push({
          pedido: pedido._id.toString(),
          erro: error.message,
        });
      }
    }

    return {
      tabela: "pedidos",
      total: pedidosMongo.length,
      ...resultados,
    };
  } catch (error) {
    return {
      tabela: "pedidos",
      erro: error.message,
    };
  }
}

/**
 * Sincroniza todas as coleções do MongoDB para o MySQL
 */
export async function sincronizarTudo() {
  const resultados = {
    sucesso: true,
    mensagem: "Sincronização concluída",
    detalhes: [],
  };

  try {
    // Sincroniza na ordem correta (marcas -> produtos -> pedidos)
    const resultadoMarcas = await sincronizarMarcas();
    resultados.detalhes.push(resultadoMarcas);

    const resultadoProdutos = await sincronizarProdutos();
    resultados.detalhes.push(resultadoProdutos);

    const resultadoPedidos = await sincronizarPedidos();
    resultados.detalhes.push(resultadoPedidos);

    // Verifica se houve algum erro
    const temErros = resultados.detalhes.some(
      (r) => r.erro || (r.erros && r.erros.length > 0)
    );

    if (temErros) {
      resultados.mensagem = "Sincronização concluída com alguns erros";
    }

    return resultados;
  } catch (error) {
    resultados.sucesso = false;
    resultados.mensagem = "Erro na sincronização";
    resultados.erro = error.message;
    return resultados;
  }
}

/**
 * Sincroniza uma coleção específica
 */
export async function sincronizarColecao(nomeColecao) {
  switch (nomeColecao.toLowerCase()) {
    case "marcas":
      return await sincronizarMarcas();
    case "produtos":
      return await sincronizarProdutos();
    case "pedidos":
      return await sincronizarPedidos();
    default:
      return {
        erro: `Coleção '${nomeColecao}' não encontrada. Opções válidas: marcas, produtos, pedidos`,
      };
  }
}
