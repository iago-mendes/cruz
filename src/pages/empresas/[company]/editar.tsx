import Router from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import api from '../../../services/api'

interface Comissao
{
    porcentagem: number
    obs: Array<string>
}

const defaultComissao =
{
    porcentagem: 0.00,
    obs: ['']
}

interface Company
{
    _id: string
    imagem?: string
    razao_social: string
    nome_fantasia: string
    cnpj: string
    telefones: Array<number>
    email: string
    descricao_curta?: string
    descricao?: string
    site?: string
    comissao: Comissao
}

export default function EditCompany()
{
    const {company: id} = Router.query
    if (!id) return <h1>Carregando...</h1>

    const [shownNumbers, setShownNumbers] = useState<string[]>([])

    const [imagem, setImagem] = useState<File>()
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [telefones, setTelefones] = useState<number[]>([0])
    const [email, setEmail] = useState('')
    const [comissao, setComissao] = useState<Comissao>(defaultComissao)
    const [descricaoCurta, setDescricaoCurta] = useState('')
    const [descricao, setDescricao] = useState('')
    const [site, setSite] = useState('')

    useEffect(() =>
    {
        api.get(`companies-all/${id}`).then(res =>
        {
            const company: Company = res.data

            setRazaoSocial(company.razao_social)
            setNomeFantasia(company.nome_fantasia)
            setCnpj(company.cnpj)
            setTelefones(company.telefones)
            setShownNumbers(company.telefones.map(tel => String(tel)))
            setEmail(company.email)
            setComissao(company.comissao)
            setDescricao(company.descricao_curta)
            setDescricao(company.descricao)
            setSite(company.site)
                
        }).catch(error => console.log('[error when getting info]', error))
    }, [])

    function handleInputChange(e: ChangeEvent<HTMLInputElement>)
    {
        if (e.target.name === 'imagem') setImagem(e.target.files[0])
        if (e.target.name === 'razao_social') setRazaoSocial(e.target.value)
        if (e.target.name === 'nome_fantasia') setNomeFantasia(e.target.value)
        if (e.target.name === 'cnpj') setCnpj(e.target.value)
        if (e.target.name === 'email') setEmail(e.target.value)
        if (e.target.name === 'descricao_curta') setDescricaoCurta(e.target.value)
        if (e.target.name === 'site') setSite(e.target.value)
    }

    function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>)
    {
        if (e.target.name === 'descricao') setDescricao(e.target.value)
    }

    function handleNumberChange(e: ChangeEvent<HTMLInputElement>, index: number)
    {
        const number = e.target.value.replace(/\D/g,'')
        console.log('[number]', number)
    }

    return (
        <div className="container" id="editCompany">
            <header></header>
            <form>
                <div>
                    <label htmlFor="imagem">Imagem</label>
                    <input type="file" name="imagem" id="imagem"/>
                </div>
                <div>
                    <label htmlFor="razao_social">Razão social</label>
                    <input
                        type="text"
                        name="razao_social"
                        id="razao_social"
                        value={razaoSocial}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="nome_fantasia">Nome fantasia</label>
                    <input
                        type="text"
                        name="nome_fantasia"
                        id="nome_fantasia"
                        value={nomeFantasia}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                        type="text"
                        name="cnpj"
                        id="cnpj"
                        value={cnpj}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="telefone">Telefones</label>
                    {shownNumbers.map((number, index) => (
                        <div key={index} className="phone">
                            <input
                                type="text"
                                name="telefone"
                                id="telefone"
                                value={number}
                                onChange={(e) => handleNumberChange(e, index)}
                            />
                            <button>-</button>
                        </div>
                    ))}
                </div>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <h2>Comissão</h2>
                    <label htmlFor="comissao_porcentagem">Porcentagem</label>
                    <input type="text" name="comissao_porcentagem" id="comissao_porcentagem"/>
                    <label htmlFor="comissao_obs">Observações</label>
                    {comissao.obs.map((obs, index) => (
                        <li key={index} className="obs">
                            <input
                                type="text"
                                name="comissao_obs"
                                id="comissao_obs"
                                value={obs}
                                onChange={handleInputChange}
                            />
                            <button>-</button>
                        </li>
                    ))}
                </div>
                <div>
                    <label htmlFor="descricao_curta">Descrição curta</label>
                    <input
                        type="text"
                        name="descricao_curta"
                        id="descricao_curta"
                        value={descricaoCurta}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        name="descricao"
                        id="descricao"
                        cols={30}
                        rows={10}
                        value={descricao}
                        onChange={handleTextareaChange}
                    />
                </div>
                <div>
                    <label htmlFor="site">Site</label>
                    <input
                        type="text"
                        name="site"
                        id="site"
                        value={site}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="buttons">
                    <button className="cancel">Cancelar</button>
                    <button type="submit" className="submit">Confirmar</button>
                </div>
            </form>
        </div>
    )
}