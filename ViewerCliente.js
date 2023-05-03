import Status from "/Status.js";
import Cliente from "/Cliente.js";
import ViewerError from "/ViewerError.js";

export default class ViewerCliente {

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso    = this.obterElemento('divAviso'); 
    this.divDialogo  = this.obterElemento('divDialogo');

    this.btPrimeiro  = this.obterElemento('btPrimeiro');
    this.btAnterior  = this.obterElemento('btAnterior');
    this.btProximo   = this.obterElemento('btProximo');
    this.btUltimo    = this.obterElemento('btUltimo');

    this.btIncluir   = this.obterElemento('btIncluir');
    this.btSair      = this.obterElemento('btSair');

    this.btOk        = this.obterElemento('btOk');
    this.btCancelar  = this.obterElemento('btCancelar');

    this.tfCpf       = this.obterElemento('tfCpf');
    this.tfNome      = this.obterElemento('tfNome');
    this.tfEmail     = this.obterElemento('tfEmail');
    this.tfTelefone  = this.obterElemento('tfTelefone');
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir;

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    elemento.viewer = this;
    return elemento;
  }
  
  getCtrl() { 
    return this.#ctrl;
  }
  
  apresentar(pos, qtde, cliente) {    
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(cliente == null) {
      this.tfCpf.value       = "";
      this.tfNome.value      = "";
      this.tfEmail.value     = "";
      this.tfTelefone.value  = "";
      this.divAviso.innerHTML = " Número de Clientes: 0";
    } else {
      this.tfCpf.value       = cliente.getCpf();
      this.tfNome.value      = cliente.getNome();
      this.tfEmail.value     = cliente.getEmail();
      this.tfTelefone.value  = cliente.getTelefone();
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Clientes: " + qtde;
    }
  }

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
    
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    
    if(operacao == Status.INCLUINDO) {
      this.tfCpf.disabled = false;
      this.tfCpf.value = "";
      this.tfNome.value = "";
      this.tfEmail.value = "";
      this.tfTelefone.value = "";
    }
  }
  
  statusApresentacao() { 
    this.tfCpf.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.tfCpf.disabled = true;
    this.tfNome.disabled = true;
    this.tfEmail.disabled = true;
    this.tfTelefone.disabled = true;
  }

}

function fnBtPrimeiro() {
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

function fnBtProximo() {
  this.viewer.getCtrl().apresentarProximo();
  
}

function fnBtAnterior() {
  this.viewer.getCtrl().apresentarAnterior();
  
}

function fnBtUltimo() {
  this.viewer.getCtrl().apresentarUltimo();
  
}

function fnBtIncluir() {
  this.viewer.getCtrl().iniciarIncluir();
}


function fnBtOk() {
  const cpf = this.viewer.tfCpf.value;
  const nome = this.viewer.tfNome.value;
  const email = this.viewer.tfEmail.value;
  const telefone = this.viewer.tfTelefone.value;
    
  this.viewer.getCtrl().efetivar(cpf, nome, email, telefone); 

}

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}