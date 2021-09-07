import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
	Card, Col, Row, Typography
} from 'antd';

import AppointmentDatePicker from './appointment_datepicker.js';
import useAppointments from '../hooks/useAppointments.js';
import useAuthentication from '../hooks/useAuthentication.js';

/**
 * Dashboard component for staff users of the web application
 */
function StaffDashboard(props) {
	const { state: { user } } = useAuthentication();
	const staffID = user.ID;
	const initDate = new Date(new Date().setHours(1, 0, 0, 0));
	const { date, appointments, setDate } = useAppointments(staffID, initDate);

	useEffect(() => {
		const { changeImage } = props;
		changeImage(false);
	}, []);

	const appointmentList = appointments.map((appt) => (
		<Col key={appt.ID}>
			<Card style={{ width: 400, marginBottom: '2rem' }}>
				<Card.Meta
					title={(
						<Typography.Title level={5}>
							{`${appt.startTime.substring(0, 5)} - ${appt.endTime.substring(0, 5)}`}
						</Typography.Title>
					)}
					description={(
						<Typography.Text>
							{`${appt.firstName} ${appt.lastName}`}
						</Typography.Text>
					)}
				/>
			</Card>
		</Col>
	));

	return (
		<div style={{ margin: '2rem 9rem 0rem' }}>
			<Typography.Title
				style={{ textAlign: 'center', marginBottom: '2rem' }}
			>
				Consultant Dashboard
			</Typography.Title>

			<Row justify="center">
				<Typography.Text
					strong
					style={{ fontSize: '16px', marginBottom: '1rem' }}
				>
					Show appointments for the date below
				</Typography.Text>
			</Row>

			<Row justify="center">
				<AppointmentDatePicker date={date} setDate={setDate} />
			</Row>

			<Row style={{ marginTop: '2rem' }} justify="space-around">
				{appointmentList}
			</Row>
		</div>
	);
}

StaffDashboard.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default StaffDashboard;
