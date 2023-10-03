const express = require('express')
const rotas = express();

const { listaContas, criarConta, excluirConta, atualizarConta } = require("./controllers/contas");
const { depositar, sacar, transferir, extrato, saldo } = require("./controllers/transacoes");


rotas.get('/contas', listaContas)
rotas.post('/contas', criarConta)
rotas.delete('/contas/:id', excluirConta)
rotas.put ('/contas/:id', atualizarConta)

rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)

rotas.get('/contas/extrato', extrato)
rotas.get('/contas/saldo', saldo)

module.exports = rotas;