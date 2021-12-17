const customExpress = require('./configs/customExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

conexao.connect(erro => {
    if(erro) console.log(erro);

    console.log('Conectado ao Banco com sucesso');
    
    Tabelas.init(conexao);
    
    const app = customExpress();
    app.listen(3000, () => {console.log('Server running on port 3000')});
});

