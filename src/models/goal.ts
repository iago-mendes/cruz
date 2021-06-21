export type GoalRaw =
{
	month: string // unique
	companies: Array<
	{
		id: string
		sellers: Array<
		{
			id: string
			goal: number
		}>
		eCommerceGoal: number
	}>
	modifiedAt?: string
}

type GoalSeller =
{
	id: string
	name: string
	goal: number
	sold: number
}

type GoalCompany =
{
	id: string
	name: string
	goal: number
	sold: number
	sellers: GoalSeller[]
	eCommerceGoal: number
	eCommerceSold: number
}

export type GoalShowed =
{
	month: string
	companies: GoalCompany[]
	sellers: GoalSeller[]
	goal: number
	sold: number
	days: Array<
	{
		day: string
		sold: number
	}>
	remainingBusinessDays: number
}