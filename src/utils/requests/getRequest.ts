import RequestRaw from '../../models/request'
import CompanyRaw from '../../models/company'
import ClientRaw from '../../models/client'
import { SellerRaw } from '../../models/seller'
import formatImage from '../formatImage'
import db from '../../services/offline/db'
import getPricedProducts from '../getPricedProducts'
import { Product } from './getPricedProducts'

export interface RequestFormated
{
	id: string
	data: string
	condicao: string
	digitado_por?: string
	peso: number
	volume: number
	contato:
	{
		nome: string
		telefone: string
	}
	frete: string
	tipo:
	{
    venda: boolean
    troca: boolean
	}
	status:
	{
    concluido: boolean
    enviado: boolean
    faturado: boolean
	}
	cliente:
	{
		id: string
		nome_fantasia: string
		razao_social: string
		imagem: string
		endereco:
		{
			rua?: string | undefined
			numero?: number | undefined
			complemento?: string | undefined
			bairro?: string | undefined
			cep?: string | undefined
			cidade?: string | undefined
			uf?: string | undefined
		}
		cnpj: string
		insc_estadual: string
		telefone?: number | undefined
		email: string
	}
	vendedor:
	{
		id: string
		nome: string
		imagem: string
	}
	representada:
	{
		id: string
		razao_social: string
		nome_fantasia: string
		imagem: string
	}
	produtos: Product[]
	descontoTotal: number
	valorTotalProdutos: number
	valorTotal: number
	quantidadeTotal: number
}

export async function getRequest(id: string)
{
	const rawRequest: RequestRaw = await db.table('requests').get(id)
	if (!rawRequest)
		return undefined

	const client: ClientRaw = await db.table('clients').get(rawRequest.cliente)
	if (!client)
		return undefined

	const seller: SellerRaw = await db.table('sellers').get(rawRequest.vendedor)

	const company: CompanyRaw = await db.table('companies').get(rawRequest.representada)
	if (!company)
		return undefined

	const {
		products,
		totalValue,
		totalProductsValue,
		totalDiscount,
		totalQuantity,
		weight,
		volume
	} = getPricedProducts(rawRequest, company, client)

	const request: RequestFormated =
	{
		id: rawRequest._id,
		data: rawRequest.data,
		condicao: rawRequest.condicao,
		digitado_por: rawRequest.digitado_por,
		peso: weight,
		volume: volume,
		contato: rawRequest.contato?.nome ? rawRequest.contato : {nome: '', telefone: ''},
		frete: rawRequest.frete ? rawRequest.frete : '',
		tipo: rawRequest.tipo,
		status: rawRequest.status,
		cliente:
		{
			id: rawRequest.cliente,
			nome_fantasia: client.nome_fantasia,
			razao_social: client.razao_social,
			imagem: client.imagem,
			endereco: client.endereco,
			cnpj: client.cnpj,
			insc_estadual: client.insc_estadual,
			telefone: client.telefone,
			email: client.email,
		},
		vendedor:
		{
			id: seller ? String(rawRequest.vendedor) : 'ecommerceId',
			nome: seller ? seller.nome : 'E-Commerce',
			imagem: seller ? seller.imagem : formatImage(undefined)
		},
		representada:
		{
			id: rawRequest.representada,
			razao_social: company.razao_social,
			nome_fantasia: company.nome_fantasia,
			imagem: company.imagem
		},
		produtos: products,
		descontoTotal: totalDiscount,
		valorTotalProdutos: totalProductsValue,
		valorTotal: totalValue,
		quantidadeTotal: totalQuantity
	}
	return request
}