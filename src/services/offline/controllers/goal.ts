import { differenceInBusinessDays, lastDayOfMonth } from 'date-fns'

import { GoalCompany, GoalRaw, GoalSeller } from '../../../models/goal'
import db from '../db'
import { SellerRaw } from '../../../models/seller'
import CompanyRaw from '../../../models/company'
import RequestRaw from '../../../models/request'
import getTotalValue from '../../../utils/requests/getTotalValue'

export const goalController =
{
	create: async (body: any) =>
	{
		const {month, companies} = body

		const addedRequest = {month, companies}

		await db.table('goals').add(addedRequest, month)
	},

	update: async (body: any, month?: string) =>
	{
		if (!month)
			return
		
		const previousGoal = await db.table('goals').get(month)
		if (!previousGoal)
			return
		
		const {companies} = body

		const updatedRequest =
		{
			month,
			companies: companies ? companies : previousGoal.companies
		}

		await db.table('goals').put(updatedRequest, month)
	},

	remove: async (month?: string) =>
	{
		if (!month)
			return
		
		await db.table('goals').delete(month)
	},

	raw: async () =>
	{
		const goals = await db.table('goals').toArray()
		return goals
	},

	rawOne: async (month?: string) =>
	{
		if (!month)
			return undefined

		const rawGoal: GoalRaw = await db.table('goals').get(month)
		return rawGoal
	},

	show: async (month?: string) =>
	{
		if (!month)
			throw new Error('Nenhum mês informado!')
			

		const goal: GoalRaw = await db.table('goals').get(month)
		if (!goal)
			throw new Error('Meta não encontrada!')
		
		let totalGoal = 0
		let totalSold = 0
		
		let companies: GoalCompany[] = []
		let sellers: GoalSeller[] = []
		let days: Array<
		{
			day: string
			sold: number
		}> = []

		await Promise.all(goal.companies.map(async company =>
		{
			const rawCompany: CompanyRaw = await db.table('companies').get(company.id)
			const companyName = rawCompany
				? rawCompany.nome_fantasia
				: 'Representada não encontrada'
			
			let companyGoal = 0
			let companySold = 0
			let companySellers: GoalSeller[] = []

			await Promise.all(company.sellers.map(async seller =>
			{
				const rawSeller: SellerRaw = await db.table('sellers').get(seller.id)
				const sellerName = rawSeller
					? rawSeller.nome
					: 'Vendedor não encontrado'
				
				const requests: RequestRaw[] = (await db.table('requests').toArray())
					.filter(({representada, vendedor}: RequestRaw) => (
						representada === company.id && vendedor === seller.id
					))
				const monthRequests = requests.filter(({data}) => data.includes(month))

				let sellerSold = 0
				monthRequests.forEach(rawRequest =>
				{
					const totalValue = getTotalValue(rawRequest, rawCompany)

					sellerSold += totalValue

					const existingDayIndex = days.findIndex(({day}) => rawRequest.data.includes(day))
					if (existingDayIndex < 0)
						days.push(
							{
								day: rawRequest.data,
								sold: totalValue
							})
					else
						days[existingDayIndex].sold += totalValue
				})
				
				companyGoal += seller.goal
				companySold += sellerSold

				const existingIndex = sellers.findIndex(({id}) => String(id) == String(seller.id))
				if (existingIndex > 0)
				{
					sellers[existingIndex].goal += seller.goal
					sellers[existingIndex].sold += sellerSold
				}
				else
					sellers.push(
						{
							id: seller.id,
							name: sellerName,
							goal: seller.goal,
							sold: sellerSold
						})
				
				companySellers.push(
					{
						id: seller.id,
						name: sellerName,
						goal: seller.goal,
						sold: sellerSold
					})
			}))

			companySellers.sort((a, b) => a.sold > b.sold ? -1 : 1)

			const eCommerceRequests: RequestRaw[] = (await db.table('requests').toArray())
				.filter(({representada, vendedor}: RequestRaw) => (
					representada === company.id && vendedor == undefined
				))
			const monthECommerceRequests = eCommerceRequests.filter(({data}) => data.includes(month))

			let eCommerceSold = 0
			monthECommerceRequests.forEach(rawRequest =>
			{
				const totalValue = getTotalValue(rawRequest, rawCompany)
				eCommerceSold += totalValue

				const existingDayIndex = days.findIndex(({day}) => rawRequest.data.includes(day))
				if (existingDayIndex < 0)
					days.push(
						{
							day: rawRequest.data,
							sold: totalValue
						})
				else
					days[existingDayIndex].sold += totalValue
			})

			companyGoal += company.eCommerceGoal
			companySold += eCommerceSold

			totalGoal += companyGoal
			totalSold += companySold

			companies.push(
				{
					id: company.id,
					name: companyName,
					goal: companyGoal,
					sold: companySold,
					sellers: companySellers,
					eCommerceGoal: company.eCommerceGoal,
					eCommerceSold
				})
		}))

		sellers.sort((a, b) => a.sold > b.sold ? -1 : 1)
		days.sort((a, b) => a.day < b.day ? -1 : 1)

		const today = new Date(Date.now())
		const monthMiddleDate = new Date(`${month}-15`)
		const lastMonthDay = lastDayOfMonth(monthMiddleDate)
		const remainingBusinessDays = differenceInBusinessDays(lastMonthDay, today)

		const showResponse =
		{
			month,
			companies,
			sellers,
			goal: totalGoal,
			sold: totalSold,
			days,
			remainingBusinessDays
		}

		return showResponse
	}
}