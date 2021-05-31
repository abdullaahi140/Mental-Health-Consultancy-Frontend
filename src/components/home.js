import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Typography } from 'antd';

class Home extends React.Component {
	constructor(props) {
		super(props);
		const { changeImage } = this.props;
		changeImage(true);
	}

	render() {
		const { history } = this.props;
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
					Book an appointment with a professional consultant
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
}

Home.propTypes = {
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired,
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default withRouter(Home);
