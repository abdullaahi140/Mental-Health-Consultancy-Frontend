import React from 'react';
import PropTypes from 'prop-types';

import AppointmentCard from './appointment_card.js';

/**
 * List of appoinments as cards
 * @param {Object} props - Object passed by parent component
 * @returns Appointment list component
 */
function AppointmentList(props) {
	const {
		appointments, date, staffID, updateParent
	} = props;
	const times = ['09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00',
		'14:00:00', '15:00:00', '16:00:00', '17:00:00'];
	const apptStartTime = appointments.map((appt) => appt.startTime);

	const apptList = times.map((time, index) => {
		// Setting the text for card depending on if appt is booked
		let hoverable = true;
		let subtitle = 'BOOK NOW';
		let type = 'success';
		if (apptStartTime.includes(time)) {
			hoverable = false;
			subtitle = 'BOOKED';
			type = 'danger';
		}

		return (
			<AppointmentCard
				// eslint-disable-next-line react/no-array-index-key
				key={index}
				staffID={staffID}
				title={time.substring(0, time.length - 3)}
				subtitle={subtitle}
				date={date}
				time={times[index]}
				hoverable={hoverable}
				type={type}
				updateParent={updateParent}
			/>
		);
	});

	return (
		<div style={{ margin: '2rem 2rem' }}>
			{apptList}
		</div>
	);
}

AppointmentList.propTypes = {
	appointments: PropTypes.array.isRequired,
	date: PropTypes.instanceOf(Date).isRequired,
	staffID: PropTypes.number.isRequired,
	updateParent: PropTypes.func.isRequired
};

export default AppointmentList;
