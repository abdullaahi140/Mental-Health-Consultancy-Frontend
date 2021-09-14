import { useEffect, useState } from 'react';
import useAuthentication from './useAuthentication.js';

function useAppointments(initStaffID, initDate) {
	const [staffID, setStaffID] = useState(initStaffID);
	const [date, setDate] = useState(initDate);
	const [appointments, setAppointments] = useState([]);
	const { state: { user } } = useAuthentication();

	function getAppointments() {
		fetch(`${process.env.REACT_APP_API_URL}/api/v1/appt/${staffID}/${date.toISOString().substring(0, 10)}`, {
			headers: {
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			}
		})
			.then((res) => res.json())
			.then((data) => setAppointments(data))
			.then((err) => console.error(err));
	}

	/**
	* Fetch appointments from web api for a staff member
	*/
	useEffect(() => getAppointments(), [staffID, date]);

	return {
		date, appointments, setDate, staffID, setStaffID, getAppointments
	};
}

export default useAppointments;
