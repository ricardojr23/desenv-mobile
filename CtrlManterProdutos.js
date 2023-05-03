"use strict";

import Status from "/Status.js";
import Produto from "/Produto.js";
import ProdutoDTO from "/ProdutoDTO.js";
import DaoProduto from "/DaoProduto.js";
import ViewerProduto from "/ViewerProduto.js";

export default class CtrlManterProdutos {
  
  #dao;    
  #viewer;  
  #posAtual;
  #status; 
  

  constructor() {
    this.#dao = new DaoProduto();
    this.#viewer = new ViewerProduto(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  

  async #atualizarContextoNavegacao() {

    this.#status = Status.NAVEGANDO;


    this.#viewer.statusApresentacao();
    
    let conjProdutos = await this.#dao.obterProdutos();
    
    if(conjProdutos.length == 0) {
      this.#posAtual = 0;
      
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      if(this.#posAtual == 0 || this.#posAtual > conjProdutos.length)
        this.#posAtual = 1;
      this.#viewer.apresentar(this.#posAtual, conjProdutos.length, new ProdutoDTO(conjProdutos[this.#posAtual - 1]));
    }
  }
  
  

  async apresentarPrimeiro() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(conjProdutos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarProximo() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(this.#posAtual < conjProdutos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarAnterior() {
    let conjProdutos = await this.#dao.obterProdutos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  

  async apresentarUltimo() {
    let conjProdutos = await this.#dao.obterProdutos();
    this.#posAtual = conjProdutos.length;
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


 
  async alterar(nome, preco, categoria, descricao) {
    let produto = new Produto(nome, preco, categoria, descricao);
    await this.#dao.alterar(produto);
    this.#atualizarContextoNavegacao();
  }
  
 
  async incluir(nome, preco, categoria, descricao) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let produto = new Produto(nome, preco, categoria, descricao);
        await this.#dao.incluir(produto); 
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