import React from 'react';
import PropTypes from 'prop-types';

import {
	Button, Row, Select, Typography
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

import AppointmentList from './appointment_list.js';
import UserContext from '../contexts/user.js';

/** Main page for booking appointments */
class BookAppointment extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			disabled: true,
			date: new Date(new Date().setHours(1, 0, 0, 0)),
			staff: [],
			staffID: 2,
			appointments: []
		};
		const { changeImage } = this.props;
		changeImage(false);
		this.changeDate = this.changeDate.bind(this);
		this.fetchStaff = this.fetchStaff.bind(this);
		this.fetchAppointments = this.fetchAppointments.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.fetchStaff();
		// this.fetchAppointments();
	}

	componentDidUpdate(_prevProps, prevState) {
		const { staffID, date } = this.state;
		if (staffID !== prevState.staffID || date !== prevState.date) {
			this.fetchAppointments();
		}
	}

	/**
	 *  Change the staffID state when the select option has changed
	 */
	handleChange(value) {
		this.setState({ staffID: value });
	}

	/**
	 * Change the date on the page
	 * @param {Number} adjust - The value to adjust the current date by
	 */
	changeDate(adjust) {
		const { date } = this.state;
		const adjustedDate = new Date(date);
		adjustedDate.setDate(date.getDate() + adjust);
		const today = new Date();
		today.setHours(1, 0, 0, 0);
		if (today.getTime() === adjustedDate.getTime()) {
			this.setState({ disabled: true, date: adjustedDate });
		} else {
			this.setState({ disabled: false, date: adjustedDate });
		}
	}

	/**
	 * Fetch all staff names and IDs from the web API
	 */
	fetchStaff() {
		const { user } = this.context;
		fetch('http://localhost:3000/api/v1/users/staff', {
			headers: {
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			}
		})
			.then((res) => res.json())
			.then((data) => this.setState({ staff: data }))
			.catch((err) => console.error(err));
	}

	/**
	 * Fetch all the appointments for a given date
	 */
	fetchAppointments() {
		const { user } = this.context;
		const { staffID, date } = this.state;
		fetch(`http://localhost:3000/api/v1/appt/${staffID}/${date.toISOString().substring(0, 10)}`, {
			headers: {
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			}
		})
			.then((res) => res.json())
			.then((data) => this.setState({ appointments: data }))
			.catch((err) => console.error(err));
	}

	render() {
		const {
			disabled, date, staff, staffID, appointments
		} = this.state;

		const staffList = staff.map((user) => (
			<Select.Option
				key={user.ID}
				value={user.ID}
				aria-label={`${user.firstName} ${user.lastName}`}
			>
				{`${user.firstName} ${user.lastName}`}
			</Select.Option>
		));

		const defaultStaff = (staff.length > 0) ? staff[0]
			: { firstName: 'Staff', lastName: 'User' };

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
						Staff:
					</Typography.Text>
					<Select
						id="staff_select"
						style={{ alignSelf: 'center', width: '12rem' }}
						size="large"
						defaultValue={`${defaultStaff.firstName} ${defaultStaff.lastName}`}
						onChange={this.handleChange}
						aria-label="Staff"
						aria-expanded="false"
						aria-activedescendant="staff_select"
					>
						{staffList}
					</Select>
				</Row>

				<Row justify="center">
					<Button
						style={{ marginRight: '4rem', width: '7rem' }}
						disabled={disabled}
						icon={<ArrowLeftOutlined />}
						size="large"
						onClick={() => this.changeDate(-1)}
					>
						Previous
					</Button>
					<Typography.Text
						strong
						style={{
							alignSelf: 'center',
							textAlign: 'center',
							fontSize: '16px',
							width: '9rem'
						}}
					>
						{date.toDateString()}
					</Typography.Text>
					<Button
						style={{ marginLeft: '4rem', width: '7rem' }}
						size="large"
						onClick={() => this.changeDate(1)}
					>
						Next
						<ArrowRightOutlined />
					</Button>
				</Row>

				<AppointmentList
					appointments={appointments}
					date={date}
					staffID={staffID}
					updateParent={this.fetchAppointments}
				/>
			</div>
		);
	}
}

BookAppointment.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};
BookAppointment.contextType = UserContext;

export default BookAppointment;
