import React from 'react';
import PropTypes from 'prop-types';

import {
	Card, message, Modal, Row, Typography
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import useAuthentication from '../hooks/useAuthentication.js';

/**
 * Card component for booking an appoinment.
 */
function AppointmentCard(props) {
	const { state: { user } } = useAuthentication();

	/**
	 * Send a request to web api to add an appoinment for the user.
	 */
	function addAppointment() {
		const {
			date, time, staffID, updateParent
		} = props;
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
			.then(() => message.success('Appointment has been booked', 5))
			.catch((err) => console.error(err));
	}

	/**
	 * Show a pop up to ask user to confirm booking an appoinment.
	 */
	function handleClick() {
		const { hoverable, time, date } = props;
		if (hoverable) {
			Modal.confirm({
				centered: true,
				closable: true,
				keyboard: true,
				icon: <QuestionCircleOutlined />,
				title: (
					<Typography.Text strong>
						Would you like to book this
						<br />
						appointment?
					</Typography.Text>
				),
				content: <Typography.Text>
					{date.toDateString()}
					<br />
					{`${time.substring(0, 5)} - ${time.substring(0, 2)}:30`}
					{/* eslint-disable-next-line react/jsx-closing-tag-location */}
				</Typography.Text>,
				onOk: addAppointment
			});
		}
	}

	const {
		title, subtitle, hoverable, type
	} = props;

	let card = (
		<Card
			style={{ width: '50rem' }}
			hoverable={hoverable}
		>
			<Card.Meta
				style={{ textAlign: 'start' }}
				title={`${title} - ${title.substring(0, 2)}:30`}
				description={<Typography.Text strong type={type}>{subtitle}</Typography.Text>}
			/>
		</Card>
	);
	if (hoverable) {
		card = (
			<button
				style={{ border: 'none', padding: '0px', backgroundColor: '#ffffff' }}
				type="button"
				onClick={handleClick}
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

export default AppointmentCard;
