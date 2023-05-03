import ModelError from "/ModelError.js";
import Cliente from "/Cliente.js";

export default class ClienteDTO {
  #cpf;
  #nome;
  #email;
  #telefone;

  constructor(cliente) {
    this.#cpf = cliente.getCpf();
    this.#nome = cliente.getNome();
    this.#email = cliente.getEmail();
    this.#telefone = cliente.getTelefone();
  }

  getCpf() {
    return this.#cpf;
  }

  getNome() {
    return this.#nome;
  }

  getEmail() {
    return this.#email;
  }

  getTelefone() {
    return this.#telefone;
  }

  toJSON() {
    return "{ " + '"cpf" : "' + this.#cpf + '",';
    '"nome" : "' + this.#nome + '",';
    '"email" : "' + this.#email + '",';
    '"telefone" : "' + this.#telefone + '"';
    ("}");
  }
}
