let { contas, depositos, saques, transferencias } = require('../bancodedados');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }

    const conta = contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "O valor do depósito deve ser maior que zero!" });
    }

    conta.saldo += valor;

    const transacao = {
        data: new Date().toISOString(),
        numero_conta,
        valor
    };

    depositos.push(transacao);

    return res.status(200).send();
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta, o valor do saque e a senha são obrigatórios!" });
    }

    const conta = contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida para a conta informada!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "O valor do saque deve ser maior que zero!" });
    }

    if (valor > conta.saldo) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente para realizar o saque!" });
    }

    conta.saldo -= valor;

    const transacao = {
        data: new Date().toISOString(),
        numero_conta,
        valor
    };

    saques.push(transacao);

    return res.status(200).send();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta de origem, da conta de destino, a senha e o valor da transferência são obrigatórios!" });
    }

    const contaOrigem = contas.find((conta) => conta.numero === numero_conta_origem);

    if (!contaOrigem) {
        return res.status(404).json({ "mensagem": "Conta de origem não encontrada!" });
    }

    const contaDestino = contas.find((conta) => conta.numero === numero_conta_destino);

    if (!contaDestino) {
        return res.status(404).json({ "mensagem": "Conta de destino não encontrada!" });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida para a conta de origem informada!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "O valor da transferência deve ser maior que zero!" });
    }

    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ "mensagem": "Saldo insuficiente para realizar a transferência!" });
    }

    contaOrigem.saldo -= valor;

    contaDestino.saldo += valor;


    const transacao = {
        data: new Date().toISOString(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(transacao);

    return res.status(200).send();
};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta e a senha são obrigatórios!" });
    }

    const conta = contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida para a conta informada!" });
    }

    const extratoConta = {
        depositos: depositos.filter((transacao) => transacao.numero_conta === numero_conta),
        saques: saques.filter((transacao) => transacao.numero_conta === numero_conta),
        transferenciasEnviadas: transferencias.filter((transacao) => transacao.numero_conta_origem === numero_conta),
        transferenciasRecebidas: transferencias.filter((transacao) => transacao.numero_conta_destino === numero_conta)
    };

    return res.status(200).json(extratoConta);
};

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ "mensagem": "O número da conta e a senha são obrigatórios!" });
    }

    const conta = contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontrada!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida para a conta informada!" });
    }

    return res.status(200).json({ "saldo": conta.saldo });
};

module.exports = {
    depositar,
    sacar,
    transferir,
    extrato,
    saldo
};
