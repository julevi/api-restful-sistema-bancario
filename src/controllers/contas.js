let { banco, contas} = require('../bancodedados');

const listaContas = (req, res) => {
    const senhaBancoInformada = req.query.senha_banco;

    if (senhaBancoInformada === banco.senha_banco) {
        return res.status(200).json(contas);
    } else {
        return res.status(400).json({ "mensagem": "A senha do banco informada é inválida!" });
    }
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Todos os campos são obrigatórios!" });
    }

    const cpfExistente = contas.some(conta => conta.usuario.cpf === cpf);
    if (cpfExistente) {
        return res.status(400).json({ "mensagem": "CPF já cadastrado. Escolha outro CPF." });
    }

    const emailExistente = contas.some(conta => conta.usuario.email === email);
    if (emailExistente) {
        return res.status(400).json({ "mensagem": "E-mail já cadastrado. Escolha outro e-mail." });
    }

    const numeroConta = (banco.identificador + 1).toString();

    const novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(novaConta);
    banco.identificador++;

    return res.status(201).json({ "mensagem": "Conta criada com sucesso" });
}

const excluirConta = (req, res) => {
    const { id } = req.params;

    const conta = contas.find((conta) => conta.numero === id);

    if (!conta) {
        return res.status(404).json({"mensagem": "Conta bancária não encontrada!" });
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({"mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    contas = contas.filter((conta) => conta.numero !== id);

    return res.status(204).send();
}

const atualizarConta = (req, res) => {
    const { id } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Todos os campos são obrigatórios!" });
    }

    const cpfExistente = contas.some(conta => conta.usuario.cpf === cpf && conta.numero !== id);
    if (cpfExistente) {
        return res.status(400).json({ "mensagem": "CPF já cadastrado. Escolha outro CPF." });
    }

    const emailExistente = contas.some(conta => conta.usuario.email === email && conta.numero !== id);
    if (emailExistente) {
        return res.status(400).json({ "mensagem": "E-mail já cadastrado. Escolha outro e-mail." });
    }

    const conta = contas.find((conta) => conta.numero === id);

    if (!conta) {
        return res.status(404).json({"mensagem": "Conta bancária não encontrada!" });
    }

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    return res.status(203).json();
};

module.exports = {
    listaContas,
    criarConta,
    excluirConta,
    atualizarConta
};
