import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Row, Select, Typography } from 'antd';

import AppointmentList from './appointment_list.js';
import AppointmentDatePicker from './appointment_datepicker.js';
import useAppointments from '../hooks/useAppointments.js';
import useAuthentication from '../hooks/useAuthentication.js';

/** Main page for booking appointments */
function BookAppointment(props) {
	const { state: { user } } = useAuthentication();
	const [staff, setStaff] = useState([]);

	const initStaffID = 2;
	const initDate = new Date(new Date().setHours(1, 0, 0, 0));
	const {
		date, staffID, appointments, setDate, setStaffID, getAppointments
	} = useAppointments(initStaffID, initDate);

	useEffect(() => {
		const { changeImage } = props;
		changeImage(false);
	}, []);

	/**
	 * Fetch all staff names and IDs from the web API
	 */
	useEffect(() => {
		fetch('http://localhost:3000/api/v1/users/staff', {
			headers: {
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			}
		})
			.then((res) => res.json())
			.then((data) => setStaff(data))
			.catch((err) => console.error(err));
	}, []);

	const staffList = staff.map((staffUser) => (
		<Select.Option
			key={staffUser.ID}
			value={staffUser.ID}
			aria-label={`${staffUser.firstName} ${staffUser.lastName}`}
		>
			{`${staffUser.firstName} ${staffUser.lastName}`}
		</Select.Option>
	));

	const defaultStaff = (staff.length > 0) ? staff[0]
		: { firstName: 'James', lastName: 'Johnson' };

	return (
		<div style={{ marginTop: '2rem' }}>
			<Typography.Title
				style={{ textAlign: 'center', marginBottom: '2rem' }}
			>
				Book an Appointment
			</Typography.Title>
			<Row justify="center" style={{ marginBottom: '2rem' }}>
				<Typography.Text
					strong
					style={{
						alignSelf: 'center',
						textAlign: 'center',
						fontSize: '16px',
						marginRight: '0.5rem'
					}}
				>
					Choose a mental health consultant:
				</Typography.Text>
				<Select
					id="staff_select"
					style={{ alignSelf: 'center', width: '12rem' }}
					size="large"
					defaultValue={`${defaultStaff.firstName} ${defaultStaff.lastName}`}
					onChange={(value) => setStaffID(value)}
					aria-label="Choose a mental health consultant:"
					aria-expanded="false"
					aria-activedescendant="staff_select"
					aria-owns="staff_select"
					aria-controls="staff_select"
					aria-autocomplete="none"
				>
					{staffList}
				</Select>
			</Row>

			<Row justify="center">
				<Typography.Text
					strong
					style={{ fontSize: '16px', marginBottom: '1rem' }}
				>
					Choose the appointment date below
				</Typography.Text>
			</Row>

			<Row justify="center">
				<AppointmentDatePicker
					disablePrevious
					date={date}
					setDate={setDate}
				/>
			</Row>

			<AppointmentList
				appointments={appointments}
				date={date}
				staffID={staffID}
				updateParent={getAppointments}
			/>
		</div>
	);
}

BookAppointment.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default BookAppointment;
