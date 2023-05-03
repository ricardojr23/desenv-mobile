import ModelError from "/ModelError.js";

export default class Produto {

  constructor(nome, preco, categoria, descricao) {
  
    this.setNome(nome);
    this.setPreco(preco);
    this.setCategoria(categoria);
    this.setDescricao(descricao);      
  }
  

  getNome() {
    return this.nome;
  }
    

  setNome(nome) {
    // if(!Produto.validarCpf(preco))
    //   throw new ModelError("CPF Inválido: " + preco);
    this.preco = preco;
  }
    

  getPreco() {
    return this.preco;
  }
  
  

  setPreco(preco) {
    // if(!Produto.validarNome(preco))
    //   throw new ModelError("Nome Inválido: " + preco);
    this.preco = preco;
  }
  
  

  getCategoria() {
    return this.categoria;
  }
  
  

  setCategoria(categoria) {
    // if(!Produto.validarEmail(categoria))
    //   throw new ModelError("Email inválido: " + categoria);
    this.categoria = categoria;
  }
  
  

  getDescricao() {
    return this.descricao;
  }
  
  

  setDescricao(descricao) {
    // if(!Produto.validarTelefone(descricao))
    //   throw new ModelError("Telefone inválido: " + descricao);
    this.descricao = descricao;
  }
  
  

  /*static validarCpf(strCpf) {
    let soma;
    let resto;
    let i;

    soma = 0;
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace("-", "");

    if (strCpf == "00000000000") return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(10, 11))) return false;
    return true;
  }

  
*/
//   static validarNome(preco) {
//     if(preco == null || preco == "" || preco == undefined)
//       return false;
//     if (preco.length > 40) 
//       return false;
//     const padraoNome = /[A-Z][a-z] */;
//     if (!padraoNome.test(preco)) 
//       return false;
//     return true;
//   }

  

//   static validarEmail(categoria) {
//     if(categoria == null || categoria == "" || categoria == undefined)
//       return false;

//     const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
//     if (!padraoEmail.test(categoria)) 
//       return false;
//     return true;
//   }

  

//   static validarTelefone(descricao) {
//     if(descricao == null || descricao == "" || descricao == undefined)
//       return false;

//     const padraoTelefone = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
//     if (!padraoTelefone.test(descricao)) 
//       return false;
//     return true;
//   }

  
   
  mostrar() {
    let texto = "Nome: " + this.nome + "\n";
    texto += "Preço: " + this.preco + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}