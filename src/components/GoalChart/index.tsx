import {lastDayOfMonth} from 'date-fns'
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs'
import {
	CartesianGrid,
	Label,
	Line,
	LineChart,
	ReferenceLine,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import {useRouter} from 'next/router'

import Container from './styles'
import {GoalShowed} from '../../models/goal'
import {formatNumber} from '../../utils/formatNumber'
import formatPrice from '../../utils/formatPrice'
import getDate from '../../utils/getDate'
import useDimensions from '../../hooks/useDimensions'
import {SkeletonLoading} from '../SkeletonLoading'
import {formatMonth} from '../../utils/formatMonth'

type GoalChartProps = {
	month: string
	setMonth?: (month: string) => void
	goal: GoalShowed

	showDetailsButton?: boolean
}

const GoalChart: React.FC<GoalChartProps> = ({
	month,
	setMonth,
	goal,
	showDetailsButton = false
}) => {
	const {inMobile} = useDimensions()
	const {push} = useRouter()

	let monthSold = 0
	const dataPoints = goal.days.map(({day, sold}) => {
		const [, , dayNumber] = day.split('-').map(day => Number(day))
		const daySold = Math.round(sold * 100) / 100
		monthSold += daySold

		return {dayNumber, daySold, monthSold}
	})

	const lastDay = lastDayOfMonth(new Date(month)).getDate()
	const soldToday = goal.days.find(({day}) => day === getDate(true))?.sold || 0
	const goalProgress = (goal.sold / goal.goal) * 100
	const needToSell = goal.goal - goal.sold
	const needToSellPerBusinessDay = needToSell / goal.remainingBusinessDays

	function changeMonth(change: number) {
		let [yearNumber, monthNumber] = month.split('-').map(part => Number(part))
		monthNumber += change

		if (monthNumber <= 0) {
			monthNumber = 12
			yearNumber--
		}
		if (monthNumber > 12) {
			monthNumber = 1
			yearNumber++
		}

		const newMonth = yearNumber + '-' + String(monthNumber).padStart(2, '0')
		setMonth(newMonth)
	}

	return (
		<Container>
			<header>
				<h2>Evolução de venda</h2>

				<div className="controller">
					{setMonth && (
						<button onClick={() => changeMonth(-1)}>
							<BsChevronLeft />
						</button>
					)}

					<span>{formatMonth(month)}</span>

					{setMonth && (
						<button onClick={() => changeMonth(+1)}>
							<BsChevronRight />
						</button>
					)}
				</div>
			</header>

			{goal.month === 'not found' ? (
				<div className="notFound">
					<p>Meta não encontrada!</p>
					<button
						className="action"
						onClick={() => push(`metas/${month}/definir`)}
					>
						Definir meta
					</button>
				</div>
			) : (
				<div className="content">
					<div className="chart">
						{goal.month === 'loading' ? (
							<SkeletonLoading
								width={inMobile ? '300px' : '750px'}
								height={inMobile ? '200px' : '300px'}
							/>
						) : (
							<LineChart
								data={dataPoints}
								width={inMobile ? 300 : 750}
								height={inMobile ? 200 : 300}
								margin={{top: 0, right: 0, bottom: 0, left: 0}}
							>
								<Line
									type="monotone"
									dataKey="monthSold"
									stroke="#84130B"
									strokeWidth={2}
								/>
								<Line
									type="monotone"
									dataKey="daySold"
									stroke="#CC9749"
									strokeWidth={2}
								/>
								<ReferenceLine
									y={goal.goal}
									ifOverflow="extendDomain"
									stroke="#260503"
								>
									<Label
										value="Meta do mês"
										position="insideTopRight"
										color="#260503"
									/>
								</ReferenceLine>

								<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
								<XAxis
									type="number"
									dataKey="dayNumber"
									stroke="#260503"
									domain={[1, lastDay]}
								/>
								<YAxis stroke="#260503" />
								<Tooltip content={<CustomTooltip />} />
							</LineChart>
						)}
					</div>
					<div className="summary">
						<div className="actions">
							{showDetailsButton && (
								<button
									className="action"
									onClick={() => push(`/metas/${month}`)}
								>
									Ver detalhes
								</button>
							)}
							<button
								className="action"
								onClick={() => push(`/metas/${month}/definir`)}
							>
								Definir meta
							</button>
						</div>

						<div className="info">
							<span className="name">Vendido no mês</span>
							<span className="value">
								{goal.month === 'loading' ? (
									<SkeletonLoading height="2rem" width="10rem" />
								) : (
									formatPrice(goal.sold)
								)}
							</span>
							<span className="obs">
								{goal.month === 'loading' ? (
									<SkeletonLoading height="1rem" width="7.5rem" />
								) : (
									'Hoje ' + formatPrice(soldToday)
								)}
							</span>
						</div>

						{goal.month === 'loading' ? (
							<>
								<div className="info">
									<span className="name">Objetivo do mês</span>
									<span className="value">
										<SkeletonLoading height="2rem" width="10rem" />
									</span>
									<span className="obs">
										<SkeletonLoading height="1rem" width="7.5rem" />
									</span>
								</div>

								<div className="info">
									<span className="name">Necessário vender</span>
									<span className="value">
										<SkeletonLoading height="2rem" width="10rem" />
									</span>
									<span className="obs">
										<SkeletonLoading height="1rem" width="7.5rem" />
									</span>
								</div>
							</>
						) : goalProgress < 100 ? (
							<>
								<div className="info">
									<span className="name">Objetivo do mês</span>
									<span className="value">
										{goal.month === 'loading' ? (
											<SkeletonLoading height="2rem" width="10rem" />
										) : (
											formatPrice(goal.goal)
										)}
									</span>
									<span className="obs">
										{goal.month === 'loading' ? (
											<SkeletonLoading height="1rem" width="7.5rem" />
										) : (
											formatNumber(goalProgress) + '% realizado'
										)}
									</span>
								</div>

								<div className="info">
									{needToSellPerBusinessDay < 0 ? (
										<span className="value">Meta não atingida!</span>
									) : (
										<>
											<span className="name">Necessário vender</span>
											<span className="value">
												{formatPrice(needToSellPerBusinessDay)} por dia útil
											</span>
											<span className="obs">
												Equivalente a {formatPrice(needToSell)}
											</span>
										</>
									)}
								</div>
							</>
						) : (
							<>
								<div className="info">
									<span className="name">Objetivo do mês</span>
									<span className="value">{formatPrice(goal.goal)}</span>
									<span className="obs">Realizado!</span>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</Container>
	)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({active, payload, label}: any) => {
	if (!(active && payload && payload.length)) return null

	return (
		<div id="custom-tooltip">
			<strong>Dia {label}</strong>
			<span className="month">
				Vendido no mês: {formatPrice(payload[0].value)}
			</span>
			<span className="day">
				Vendido no dia: {formatPrice(payload[1].value)}
			</span>
		</div>
	)
}

export default GoalChart
