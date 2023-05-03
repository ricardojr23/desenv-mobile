import ModelError from "/ModelError.js";
import Produto from "/Produto.js";

export default class ProdutoDTO {
  #nome;
  #preco;
  #categoria;
  #descricao;

  constructor(produto) {
    this.#nome = produto.getNome();
    this.#preco = produto.getPreco();
    this.#categoria = produto.getCategoria();
    this.#descricao = produto.getDescricao();
  }

  getNome() {
    return this.#nome;
  }

  getPreco() {
    return this.#preco;
  }

  getCategoria() {
    return this.#categoria;
  }

  getDescricao() {
    return this.#descricao;
  }

  toJSON() {
    return "{ " + '"nome" : "' + this.#nome + '",';
    '"preco" : "' + this.#preco + '",';
    '"categoria" : "' + this.#categoria + '",';
    '"descricao" : "' + this.#descricao + '"';
    ("}");
  }
}
