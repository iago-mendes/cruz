import Dexie from 'dexie'

const db = new Dexie('cruz')
db.version(3).stores(
	{
		companies: '_id, imagem, razao_social, nome_fantasia, cnpj, telefones, email, descricao_curta, descricao, site, comissao, tabelas, condicoes, produtos',
		clients: '_id, razao_social, nome_fantasia, imagem, cnpj, insc_estadual, email, senha, vendedores, representadas, endereco, status, condicoes',
		sellers: '_id, nome, imagem, telefones, email, senha, funcao, admin, representadas',
		requests: '_id, cliente, vendedor, representada, produtos, data, condicao, frete, contato, digitado_por, tipo, status',
		apiQueue: 'id, date, config',
		goals: 'month, companies'
	}
)

export default db