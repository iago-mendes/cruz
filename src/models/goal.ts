export type GoalRaw = {
	month: string // unique
	companies: Array<{
		id: string
		sellers: Array<{
			id: string
			goal: number
		}>
		eCommerceGoal: number
	}>
	modifiedAt?: string
}

export type GoalSeller = {
	id: string
	name: string
	goal: number
	sold: number
}

export type GoalCompany = {
	id: string
	name: string
	goal: number
	sold: number
	sellers: GoalSeller[]
	eCommerceGoal: number
	eCommerceSold: number
}

export type GoalShowed = {
	month: string
	companies: GoalCompany[]
	sellers: GoalSeller[]
	goal: number
	sold: number
	days: Array<{
		day: string
		sold: number
	}>
	remainingBusinessDays: number
}

export const loadingGoal: GoalShowed = {
	month: 'loading',
	companies: [],
	sellers: [],
	goal: 0,
	sold: 0,
	days: [],
	remainingBusinessDays: 0
}

export const notFoundGoal: GoalShowed = {
	month: 'not found',
	companies: [],
	sellers: [],
	goal: 0,
	sold: 0,
	days: [],
	remainingBusinessDays: 0
}
