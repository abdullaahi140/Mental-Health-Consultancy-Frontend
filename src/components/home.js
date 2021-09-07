import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Typography } from 'antd';

function Home(props) {
	const history = useHistory();

	useEffect(() => {
		const { changeImage } = props;
		changeImage(true);
	}, []);

	return (
		<>
			<Typography.Title style={{
				margin: '9rem',
				marginBottom: '1rem',
				width: '60rem',
				fontStyle: 'normal',
				fontWeight: 'normal',
				fontSize: '54px'
			}}
			>
				Need professional help?
				<br />
				Book an appointment with a
				<br />
				mental health consultant.
			</Typography.Title>
			<Button
				type="primary"
				size="large"
				style={{ margin: '0.5rem 9rem' }}
				onClick={() => history.push('/book_appointment')}
			>
				Book an appointment
			</Button>
		</>
	);
}

Home.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default Home;
