const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimentos {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        const atendimentoDatado = {...atendimento, data, dataCriacao};

        const clienteValido = atendimento.cliente.length >= 5;
        const dataValida = moment(data).isSameOrAfter(dataCriacao);

        const validacoes = [
            {
                'nome': 'cliente',
                'valido': clienteValido,
                'mensagem': 'Cliente precisa ter 5 ou mais caracteres'
            },
            {
                'nome': 'data',
                'valido': dataValida,
                'mensagem': 'Data de agendamento precisa ser atual ou poseterior a data atual'
            }
        ];

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros) return res.status(400).json(erros);

        const sql = 'INSERT INTO atendimentos SET ?';

        conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            }

            res.status(201).json(atendimento);
        })
    }

    lista(res) {
        const sql = 'SELECT * FROM atendimentos';
        conexao.query(sql, (erro, resultados) => {
            if(erro) return res.status(400).json(erro);

            res.status(200).json(resultados);
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id=${id}`;
        conexao.query(sql, id, (erro, resposta) => {
            const atendimento = resposta[0];
            if(erro) return res.status(400).json(erro);

            res.status(200).json(atendimento);
        });
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        const sql = 'UPDATE atendimentos SET ? WHERE id=?';
        conexao.query(sql, [valores, id], (erro) => {
            if(erro) return res.status(400).json(erro);

            res.status(200).json({...valores, id});
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM atendimentos WHERE id=?';
        conexao.query(sql, id, (erro, resultado) => {
            if(erro) return res.status(400).json(erro);

            res.status(200).json(id);
        });
    }
}

module.exports = new Atendimentos;