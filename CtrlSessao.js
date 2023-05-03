"use strict";

import CtrlManterClientes from "/CtrlManterClientes.js";

export default class CtrlSessao {
  
  
  constructor() {
    this.ctrlAtual = new CtrlManterClientes();
  }
  
}

var sessao = new CtrlSessao();


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    console.log('Registro do Service Worker bem sucedido. O escopo de uso é ' + reg.scope);
  }).catch(function(error) {
    console.log('Registro do Service Worker com ' + error);
  });
}