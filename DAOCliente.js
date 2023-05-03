"use strict";

import Cliente from "/Cliente.js";
import ModelError from "/ModelError.js";

export default class DaoCliente {
  
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoCliente.promessaConexao == null) {
      DaoCliente.promessaConexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("ClienteDB", 1); 

        requestDB.onupgradeneeded = function criarBanco(evento) {
          let db = evento.target.result;
          let store = db.createObjectStore("ClienteST", {autoIncrement: true});
          store.createIndex("idxCPF", "cpf", { unique: true });
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
    return DaoCliente.promessaConexao;
  }
  
  async obterClientepeloCPF(cpf) {
    let connection = await this.obterConexao();   
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["ClienteST"], "readonly");
        store = transacao.objectStore("ClienteST");
        indice = store.index('idxCPF');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(cpf);
      consulta.onsuccess = function(evento) { 
        if(consulta.result != null) {
          let cliente = consulta.result;
          resolve(new Cliente(cliente.cpf, cliente.nome, cliente.email, cliente.telefone)); 
        }        
        else
          resolve(null);
      };
      consulta.onerror = function(evento) { reject(null); };
    });
    
    return promessa;
  }


  async obterClientes() {
    let connection = await this.obterConexao();      
    
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["ClienteST"], "readonly");
        store = transacao.objectStore("ClienteST");
        indice = store.index('idxCPF');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {  
          const cliente = cursor.value;
          array.push(new Cliente(cliente.cpf, cliente.nome, cliente.email, cliente.telefone));
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });

    return promessa;
  }


  async obterClientesPeloAutoIncrement() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["ClienteST"], "readonly");
        store = transacao.objectStore("ClienteST");
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const cliente = cursor.value;
          array.push(new Cliente(cliente.cpf, cliente.nome, cliente.email, cliente.telefone));
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    return promessa;
  }


  async incluir(cliente) {
    let connection = await this.obterConexao();    
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["ClienteST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o cliente: " + event.target.error));
      };
      let store = transacao.objectStore("ClienteST");
      let requisicao = store.add(cliente);
      requisicao.onsuccess = function(event) {
        resolve(true);              
      };
    });
    return resultado;
  }


  async alterar(cliente) {
    let connection = await this.obterConexao();   
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ClienteST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o cliente " + event.target.error));
      };
      let store = transacao.objectStore("ClienteST");     
      let indice = store.index('idxCPF');
      let keyValue = IDBKeyRange.only(cliente.getCPF());
      indice.openCursor(keyValue).onsuccess = function(evento) {
        const cursor = evento.target.result;
        if (cursor) {
          if (cursor.value.cpf == cliente.getCPF()) {
            const request = cursor.update(cliente);
            request.onsuccess = function () {
              resolve(true);
            };
          } 
        } else {
          reject(new ModelError("Cliente com o CPF " + cliente.getCPF() + " não encontrado!",""));
        }
      };
    });
    return resultado;
  }
  


  async excluir(cliente) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["ClienteST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o cliente", event.target.error));
      };
      let store = transacao.objectStore("ClienteST");
      let indice = store.index('idxCPF');
      var keyValue = IDBKeyRange.only(cliente.getCPF());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.cpf == cliente.getCPF()) {
            const request = cursor.delete();
            request.onsuccess = function() { 
              resolve(true); 
            };
            return;
          }
        } else {
          reject(new ModelError("Cliente com o CPF " + cliente.getCPF() + " não encontrado!",""));
        }
      };
    });
    return resultado;
  }

}
