export interface SelectOption
{
	value: string
	label: string
}

export interface SelectOptionsList
{
	[key: string]: SelectOption[]
}