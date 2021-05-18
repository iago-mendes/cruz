import { AxiosRequestConfig, Method } from 'axios'

import getDate from '../../utils/getDate'
import { getRandomString } from '../../utils/getRandomString'
import db from '../db'

export type Config =
{
	url: string
	method: Method
	baseURL: string
	headers: any
	params: any
	data: any
}

export class ApiCall
{
	id: string
	date: string
	config: Config

	constructor(axiosConfig: AxiosRequestConfig)
	{
		this.id = this.getId()
		this.date = getDate()

		this.config =
		{
			url: axiosConfig.url,
			method: axiosConfig.method,
			baseURL: axiosConfig.baseURL,
			headers: axiosConfig.headers,
			params: axiosConfig.params,
			data: this.formatData(axiosConfig.data)
		}
	}

	private getId()
	{
		const id = getRandomString()
		return id
	}

	private formatData(data: any)
	{
		if (!(data instanceof FormData))
			return data
		
		let dataObj:
		{
			[key: string]: FormDataEntryValue
		} = {}

		data.forEach((value, key) =>
		{
			dataObj[key] = value
		})

		return dataObj
	}

	async save()
	{
		const apiCall =
		{
			id: this.id,
			date: this.date,
			config: this.config
		}

		await db.table('apiQueue').add(apiCall)
	}
}