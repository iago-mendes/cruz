import { lastDayOfMonth } from 'date-fns'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { CartesianGrid, Label, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'

import { GoalShowed } from '../models/goal'
import Container from '../styles/components/GoalChart'
import formatPrice from '../utils/formatPrice'

type GoalChartProps =
{
	month: string
	goal: GoalShowed
}

const GoalChart: React.FC<GoalChartProps> = ({month, goal}) =>
{
	let monthSold = 0
	const dataPoints = goal.days.map(({day, sold}) =>
	{
		const [,,dayNumber] = day.split('-').map(day => Number(day))
		const daySold = Math.round(sold * 100) / 100
		monthSold += daySold

		return {dayNumber, daySold, monthSold}
	})

	const lastDay = lastDayOfMonth(new Date(month)).getDate()

	return (
		<Container>
			<header>
				<div className='controller'>
					<button>
						<BsChevronLeft />
					</button>

					<span>
						{month}
					</span>

					<button>
						<BsChevronRight />
					</button>
				</div>
			</header>

			<div className='chart'>
				<LineChart
					data={dataPoints}
					width={500}
					height={300}
				>
					<Line type='monotone' dataKey='monthSold' stroke='#84130B' strokeWidth={2} />
					<Line type='monotone' dataKey='daySold' stroke='#CC9749' strokeWidth={2} />
					<ReferenceLine y={goal.goal} ifOverflow='extendDomain' stroke='#260503'>
						<Label value='Meta do mês' position='insideTopRight' color='#260503' />
					</ReferenceLine>

					<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
					<XAxis type='number' dataKey='dayNumber' stroke='#260503' domain={[1, lastDay]} />
					<YAxis stroke='#260503' />
					<Tooltip content={<CustomTooltip />} />
				</LineChart>
			</div>
		</Container>
	)
}

const CustomTooltip = ({ active, payload, label }: any) =>
{
	if (!(active && payload && payload.length))
		return null
	
	return (
		<div id='custom-tooltip' >
			<strong>Dia {label}</strong>
			<span className='month' >
					Vendido no mês: {formatPrice(payload[0].value)}
			</span>
			<span className='day' >
					Vendido no dia: {formatPrice(payload[1].value)}
			</span>
		</div>
	)

}

export default GoalChart