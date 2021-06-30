import {useRouter} from 'next/router'
import {
	BiBuildings,
	BiSearch,
	BiLineChart,
	BiSpreadsheet,
	BiDotsVerticalRounded
} from 'react-icons/bi'
import {FiUsers, FiX} from 'react-icons/fi'
import {FaStore} from 'react-icons/fa'
import {FormEvent, useEffect, useState} from 'react'

import Container, {Options} from '../styles/components/Header'
import useClickOutside from '../hooks/useClickOutside'

interface HeaderProps {
	display: string

	showSearch?: boolean
	search?: string
	setSearch?: (search: string) => void
	searchPlaceholder?: string

	options?: Array<{
		display: string
		action: () => void
		color?: string
	}>
}

const Header: React.FC<HeaderProps> = ({
	display,
	showSearch = false,
	search = '',
	setSearch,
	searchPlaceholder,
	options = []
}) => {
	const Router = useRouter()
	const [page, setPage] = useState('')
	const [tmpSearch, setTmpSearch] = useState(search)

	const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)
	const optionsRef = useClickOutside(() => setIsOptionsExpanded(false))

	useEffect(() => {
		const tmp = Router.pathname.split('/')[1]
		setPage(tmp)
	}, [Router.pathname])

	function getIcon() {
		if (page === '' || page === 'pedido') return <BiSpreadsheet size={30} />
		if (page === 'clientes') return <FaStore size={30} />
		if (page === 'empresas') return <BiBuildings size={30} />
		if (page === 'vendedores') return <FiUsers size={30} />
		if (page === 'indicadores') return <BiLineChart size={30} />
	}

	useEffect(() => {
		if (tmpSearch !== search) setTmpSearch(search)
	}, [search])

	function handleSearch(e: FormEvent) {
		e.preventDefault()

		setSearch(tmpSearch)
	}

	function handleClearSearch() {
		setTmpSearch('')
		setSearch('')
	}

	return (
		<Container>
			<div className="display">
				{getIcon()}
				<h1>{display}</h1>
			</div>

			{showSearch && (
				<form className="search" onSubmit={handleSearch}>
					<button type="submit" title="Pesquisar">
						<BiSearch />
					</button>
					<input
						type="text"
						name="search"
						value={tmpSearch}
						onChange={e => setTmpSearch(e.target.value)}
						placeholder={searchPlaceholder}
					/>
					<button type="button" onClick={handleClearSearch} title="Limpar">
						<FiX />
					</button>
				</form>
			)}

			{options.length > 0 && (
				<Options
					isExpanded={isOptionsExpanded}
					length={options.length}
					ref={optionsRef}
				>
					<button
						className="controller"
						onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
					>
						<BiDotsVerticalRounded />
					</button>

					<ul>
						{options.map((option, index) => (
							<li key={index} onClick={option.action}>
								<span style={option.color ? {color: option.color} : {}}>
									{option.display}
								</span>
							</li>
						))}
					</ul>
				</Options>
			)}
		</Container>
	)
}

export default Header
