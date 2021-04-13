import {useState} from 'react'
import {FiMinus, FiPlus} from 'react-icons/fi'

import Container from '../styles/components/NumberInput'

interface NumberInputProps
{
	value: number
	setValue: (p: number) => void

	name: string
	label?: string
	placeholder?: string
}

const NumberInput: React.FC<NumberInputProps> = ({value, setValue, name, label, placeholder}) =>
{
	const [isEditing, setIsEditing] = useState(false)

	function handleChange(value: string)
	{
		const number = Number(value.replace(',', '.'))
		setValue(number)
	}

  function formatNumber(number: number)
	{
    const formatter = new Intl.NumberFormat('pt-BR',
		{
      style: 'decimal'
    })

		if (number === 0)
			return undefined
    return formatter.format(number)
  }
	
	function toggleEditing()
	{
    setIsEditing(!isEditing)
  }

	function decrease()
	{
		if (value >= 1)
			setValue(value - 1)
	}

	function increase()
	{
		setValue(value + 1)
	}

	return (
		<Container>
			<div className='numberInput'>
				{label && (
					<span>
						{label}
					</span>
				)}

				{
					isEditing
					? (
						<input
							type='number'
							name={name}
							value={Math.round(value * 100) / 100}
							placeholder={placeholder}
							onChange={e => handleChange(e.target.value)}
							onBlur={toggleEditing}
						/>
					) : (
						<input
							type='text'
							name={name}
							placeholder={placeholder}
							value={formatNumber(value)}
							onFocus={toggleEditing}
							readOnly
						/>
					)}
			</div>

			<div className='controllers'>
				<button
					title='Aumentar'
					onClick={increase}
				>
					<FiPlus />
				</button>
				<button
					title='Diminuir'
					onClick={decrease}
				>
					<FiMinus />
				</button>
			</div>
		</Container>
	)
}

export default NumberInput