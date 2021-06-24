import {
	BsChevronBarLeft,
	BsChevronLeft,
	BsChevronRight,
	BsChevronBarRight
} from 'react-icons/bs'

import Container from '../styles/components/Paginate'
import Loading from './Loading'

interface PaginateProps {
	page: number
	setPage: (p: number) => void

	totalPages: number

	loading: boolean
	noResults: boolean
}

const Paginate: React.FC<PaginateProps> = ({
	page,
	setPage,
	totalPages,
	loading,
	noResults,
	children
}) => {
	function goBack() {
		if (page > 1) setPage(page - 1)
	}

	function goNext() {
		if (page < totalPages) setPage(page + 1)
	}

	function handlePageChange(value: string) {
		const tmpPage = Number(value)

		if (tmpPage >= 1 && tmpPage <= totalPages) setPage(tmpPage)
	}

	return (
		<Container>
			{loading ? (
				<Loading style={{marginTop: '40vh'}} />
			) : noResults ? (
				<div className="noResults">
					<h1>Nenhum resultado foi encontrado!</h1>
				</div>
			) : (
				<main className="main">{children}</main>
			)}

			<div className="paginate">
				<div className="buttons">
					<button onClick={() => setPage(1)}>
						<BsChevronBarLeft size={30} />
					</button>
					<button onClick={goBack}>
						<BsChevronLeft size={30} />
					</button>
				</div>
				<div className="controller">
					<input
						type="number"
						value={page}
						onChange={e => handlePageChange(e.target.value)}
						min={1}
						max={totalPages}
					/>
					<span> / {totalPages}</span>
				</div>
				<div className="buttons">
					<button onClick={goNext}>
						<BsChevronRight size={30} />
					</button>
					<button>
						<BsChevronBarRight size={30} onClick={() => setPage(totalPages)} />
					</button>
				</div>
			</div>
		</Container>
	)
}

export default Paginate
