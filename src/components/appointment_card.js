import React from 'react';
import PropTypes from 'prop-types';
import {
	Card, message, Modal, Row, Typography
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import UserContext from '../contexts/user.js';

/**
 * Card component for booking an appoinment.
 */
class AppointmentCard extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.addAppointment = this.addAppointment.bind(this);
	}

	/**
	 * Show a pop up to ask user to confirm booking an appoinment.
	 */
	handleClick() {
		const { hoverable, time, date } = this.props;
		if (hoverable) {
			Modal.confirm({
				centered: true,
				closable: true,
				keyboard: true,
				icon: <QuestionCircleOutlined />,
				title: <Typography.Text strong>Would you like to book this appointment?</Typography.Text>,
				content: <Typography.Text>
					{date.toDateString()}
					<br />
					{time.substring(0, time.length - 3)}
					{/* eslint-disable-next-line react/jsx-closing-tag-location */}
				</Typography.Text>,
				onOk: this.addAppointment
			});
		}
	}

	/**
	 * Send a request to web api to add an appoinment for the user.
	 */
	addAppointment() {
		const { user } = this.context;
		const {
			date, time, staffID, updateParent
		} = this.props;
		fetch('http://localhost:3000/api/v1/appt', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			},
			body: JSON.stringify({
				staffID,
				date: date.toISOString().substring(0, 10),
				startTime: time,
				endTime: `${time.substring(0, 2)}:30:00`
			})
		})
			.then(() => updateParent())
			.then(() => message.success('Appointment has been booked', 2.5))
			.catch((err) => console.error(err));
	}

	render() {
		const {
			title, subtitle, hoverable, type
		} = this.props;

		let card = (
			<Card
				style={{ width: '50rem' }}
				hoverable={hoverable}
			>
				<Card.Meta
					style={{ textAlign: 'start' }}
					title={title}
					description={<Typography.Text strong type={type}>{subtitle}</Typography.Text>}
				/>
			</Card>
		);
		if (hoverable) {
			card = (
				<button
					style={{ border: 'none', padding: '0px', backgroundColor: '#ffffff' }}
					type="button"
					onClick={this.handleClick}
				>
					{card}
				</button>
			);
		}

		return (
			<Row style={{ marginBottom: '1rem' }} justify="center">
				{/* Imbed Card in button to allow for keyboard focus and highlighting */}
				{card}
			</Row>
		);
	}
}

AppointmentCard.propTypes = {
	staffID: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	date: PropTypes.instanceOf(Date).isRequired,
	time: PropTypes.string.isRequired,
	hoverable: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	updateParent: PropTypes.func.isRequired
};
AppointmentCard.contextType = UserContext;

export default AppointmentCard;
