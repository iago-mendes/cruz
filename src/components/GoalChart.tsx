import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

import { GoalShowed } from '../models/goal'
import Container from '../styles/components/GoalChart'

type GoalChartProps =
{
	month: string
	goal: GoalShowed
}

const GoalChart: React.FC<GoalChartProps> = ({month, goal}) =>
{
	const dataPoints = goal.days.map(({day, sold}) =>
	{
		const x = new Date(day)
		const y = sold

		return {x, y}
	})

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
				{JSON.stringify(dataPoints)}
			</div>
		</Container>
	)
}

export default GoalChart