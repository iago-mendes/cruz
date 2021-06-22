import styled from 'styled-components'

const Container = styled.div`
	#custom-tooltip
	{
		background: #fff;
		box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
		padding: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		font-size: 1.25rem;
		
		.month
		{
			color: ${p => p.theme.colors.primary};
		}

		.day
		{
			color: ${p => p.theme.colors.secondary};
		}
	}
`

export default Container