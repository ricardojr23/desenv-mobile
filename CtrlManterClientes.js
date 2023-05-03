"use strict";

import Status from "/Status.js";
import Cliente from "/Cliente.js";
import ClienteDTO from "/ClienteDTO.js";
import DaoCliente from "/DaoCliente.js";
import ViewerCliente from "/ViewerCliente.js";

export default class CtrlManterClientes {
  
  #dao;    
  #viewer;  
  #posAtual;
  #status; 
  

  constructor() {
    this.#dao = new DaoCliente();
    this.#viewer = new ViewerCliente(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  

  async #atualizarContextoNavegacao() {

    this.#status = Status.NAVEGANDO;


    this.#viewer.statusApresentacao();
    
    let conjClientes = await this.#dao.obterClientes();
    
    if(conjClientes.length == 0) {
      this.#posAtual = 0;
      
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      if(this.#posAtual == 0 || this.#posAtual > conjClientes.length)
        this.#posAtual = 1;
      this.#viewer.apresentar(this.#posAtual, conjClientes.length, new ClienteDTO(conjClientes[this.#posAtual - 1]));
    }
  }
  
  

  async apresentarPrimeiro() {
    let conjClientes = await this.#dao.obterClientes();
    if(conjClientes.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarProximo() {
    let conjClientes = await this.#dao.obterClientes();
    if(this.#posAtual < conjClientes.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarAnterior() {
    let conjClientes = await this.#dao.obterClientes();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarUltimo() {
    let conjClientes = await this.#dao.obterClientes();
    this.#posAtual = conjClientes.length;
    this.#atualizarContextoNavegacao();
  }

  
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }

  
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    this.efetivar = this.alterar;
  }


 
  async alterar(cpf, nome, email, telefone) {
    let aluno = new Cliente(cpf, nome, email, telefone);
    await this.#dao.alterar(aluno);
    this.#atualizarContextoNavegacao();
  }
  
 
  async incluir(cpf, nome, email, telefone) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let aluno = new Cliente(cpf, nome, email, telefone);
        await this.#dao.incluir(aluno); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  getStatus() {
    return this.#status;
  } 
}