import { useState } from 'react'
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

    return formatter.format(number)
  }
	
	function toggleEditing()
	{
    setIsEditing(!isEditing)
  }

	return (
		<Container>
			<button className='controller'>
				<FiMinus />
			</button>

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
							value={value}
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

			<button className='controller'>
				<FiPlus />
			</button>
		</Container>
	)
}

export default NumberInput