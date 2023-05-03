"use strict";

import Produto from "/Produto.js";
import ModelError from "/ModelError.js";

export default class DaoProduto {
  
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoProduto.promessaConexao == null) {
      DaoProduto.promessaConexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("ProdutoDB", 1); 

        requestDB.onupgradeneeded = function criarBanco(evento) {
          let db = evento.target.result;
          let store = db.createObjectStore("ProdutoST", {autoIncrement: true});
          store.createIndex("idxNome", "nome", { unique: true });
        };

        requestDB.onerror = function erro(evento) {
          reject(new ModelError("Erro: " + evento.target.errorCode));
        };

        requestDB.onsuccess = function bancoAberto(evento) {
          if (evento.target.result) {
            resolve(evento.target.result);
          }
          else 
            reject(new ModelError("Erro: " + evento.target.errorCode));
        };
      });
    }
    return DaoProduto.promessaConexao;
  }
  
  async obterProdutopeloCPF(nome) {
    let connection = await this.obterConexao();   
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["ProdutoST"], "readonly");
        store = transacao.objectStore("ProdutoST");
        indice = store.index('idxNome');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(nome);
      consulta.onsuccess = function(evento) { 
        if(consulta.result != null) {
          let produto = consulta.result;
          resolve(new Produto(produto.nome, produto.nome, produto.email, produto.telefone)); 
        }        
        else
          resolve(null);
      };
      consulta.onerror = function(evento) { reject(null); };
    });
    
    return promessa;
  }


  async obterProdutos() {
    let connection = await this.obterConexao();      
    
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["ProdutoST"], "readonly");
        store = transacao.objectStore("ProdutoST");
        indice = store.index('idxNome');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {  
          const produto = cursor.value;
          array.push(new Produto(produto.nome, produto.nome, produto.email, produto.telefone));
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });

    return promessa;
  }


  async obterProdutosPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["ProdutoST"], "readonly");
        store = transacao.objectStore("ProdutoST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const produto = cursor.value;
          array.push(new Produto(produto.nome, produto.nome, produto.email, produto.telefone));
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    return promessa;
  }


  async incluir(produto) {
    let connection = await this.obterConexao();    
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["ProdutoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o produto: " + event.target.error));
      };
      let store = transacao.objectStore("ProdutoST");
      let requisicao = store.add(produto);
      requisicao.onsuccess = function(event) {
        resolve(true);              
      };
    });
    return resultado;
  }


  async alterar(produto) {
    let connection = await this.obterConexao();   
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ProdutoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o produto " + event.target.error));
      };
      let store = transacao.objectStore("ProdutoST");     
      let indice = store.index('idxNome');
      let keyValue = IDBKeyRange.only(produto.getNome());
      indice.openCursor(keyValue).onsuccess = function(evento) {
        const cursor = evento.target.result;
        if (cursor) {
          if (cursor.value.nome == produto.getNome()) {
            const request = cursor.update(produto);
            request.onsuccess = function () {
              resolve(true);
            };
          } 
        } else {
          reject(new ModelError("Produto com o NOME " + produto.getNome() + " não encontrado!",""));
        }
      };
    });
    return resultado;
  }
  


  async excluir(produto) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ProdutoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o produto", event.target.error));
      };
      let store = transacao.objectStore("ProdutoST");
      let indice = store.index('idxNome');
      var keyValue = IDBKeyRange.only(produto.getNome());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.nome == produto.getNome()) {
            const request = cursor.delete();
            request.onsuccess = function() { 
              resolve(true); 
            };
            return;
          }
        } else {
          reject(new ModelError("Produto com o NOME " + produto.getNome() + " não encontrado!",""));
        }
      };
    });
    return resultado;
  }

}
