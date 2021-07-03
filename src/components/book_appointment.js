import React from 'react';
import PropTypes from 'prop-types';

import {
	Button, DatePicker, Row, Select, Typography
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

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
		this.checkToday = this.checkToday.bind(this);
		this.fetchStaff = this.fetchStaff.bind(this);
		this.fetchAppointments = this.fetchAppointments.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.fetchStaff();
	}

	componentDidUpdate(_prevProps, prevState) {
		const { staffID, date } = this.state;
		if (staffID !== prevState.staffID || date !== prevState.date) {
			this.checkToday(date);
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
		this.setState({ date: adjustedDate });
	}

	/**
	 * Check if the current date matches today.
	 * Disable "Previous day" button if it matches.
	 * @param {Date} date - The date to be checked
	 */
	checkToday(date) {
		date.setHours(1, 0, 0, 0);
		const today = new Date();
		today.setHours(1, 0, 0, 0);
		if (today.getTime() === date.getTime()) {
			this.setState({ disabled: true });
		} else {
			this.setState({ disabled: false });
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
			: { firstName: 'James', lastName: 'Johnson' };
		const dateFormat = 'dddd Do MMMM YYYY';

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
						onChange={this.handleChange}
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
					<Button
						style={{ width: '9rem' }}
						disabled={disabled}
						icon={<ArrowLeftOutlined />}
						size="large"
						onClick={() => this.changeDate(-1)}
					>
						Previous day
					</Button>

					<DatePicker
						style={{ width: '18rem', margin: '0rem 2rem' }}
						size="large"
						inputReadOnly
						allowClear={false}
						value={moment(date, dateFormat)}
						format={dateFormat}
						disabledDate={(currentDate) => currentDate < moment().startOf('day')}
						onChange={(momentDate) => this.setState({ date: momentDate.toDate() })}
					/>
					<Button
						style={{ width: '7rem' }}
						size="large"
						onClick={() => this.changeDate(1)}
					>
						Next day
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
