import { lastDayOfMonth } from 'date-fns'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { CartesianGrid, Label, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'

import { GoalShowed } from '../models/goal'
import Container from '../styles/components/GoalChart'
import { formatNumber } from '../utils/formatNumber'
import formatPrice from '../utils/formatPrice'
import getDate from '../utils/getDate'
import useDimensions from '../hooks/useDimensions'

type GoalChartProps =
{
	month: string
	goal: GoalShowed
}

const GoalChart: React.FC<GoalChartProps> = ({month, goal}) =>
{
	const {inMobile} = useDimensions()

	let monthSold = 0
	const dataPoints = goal.days.map(({day, sold}) =>
	{
		const [,,dayNumber] = day.split('-').map(day => Number(day))
		const daySold = Math.round(sold * 100) / 100
		monthSold += daySold

		return {dayNumber, daySold, monthSold}
	})

	const lastDay = lastDayOfMonth(new Date(month)).getDate()
	const soldToday = goal.days.find(({day}) => day === getDate(true))?.sold || 0
	const goalProgress = goal.sold / goal.goal * 100
	const needToSell = goal.goal - goal.sold
	const needToSellPerBusinessDay = needToSell / goal.remainingBusinessDays

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

			<div className='content'>
				<div className='chart'>
					<LineChart
						data={dataPoints}
						width={inMobile ? 300 : 600}
						height={inMobile ? 200 : 300}
						margin={{top: 0, right: 0, bottom: 0, left: 0}}
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
				<div className='summary'>
					<div className='info'>
						<span className='name'>
							Vendido no mês
						</span>
						<span className='value'>
							{formatPrice(goal.sold)}
						</span>
						<span className='obs'>
							Hoje {formatPrice(soldToday)}
						</span>
					</div>

					{
						// goalProgress < 100
						goalProgress >= 100
							? (
								<>
									<div className='info'>
										<span className='name'>
											Objetivo do mês
										</span>
										<span className='value'>
											{formatPrice(goal.goal)}
										</span>
										<span className='obs'>
											{formatNumber(goalProgress)}% realizado
										</span>
									</div>

									<div className='info'>
										<span className='name'>
											Necessário vender
										</span>
										<span className='value'>
											{formatPrice(needToSellPerBusinessDay)} por dia útil
										</span>
										<span className='obs'>
											Equivalente a {formatPrice(needToSell)}
										</span>
									</div>
								</>
							)
							: (
								<>
									<div className='info'>
										<span className='name'>
											Objetivo do mês atingido!
										</span>
										<span className='value'>
											{formatPrice(goal.goal)}
										</span>
									</div>
								</>
							)
					}
				</div>
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