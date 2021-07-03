import React from 'react';
import PropTypes from 'prop-types';

import {
	Button, Card, Col, DatePicker, Row, Typography
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

import UserContext from '../contexts/user.js';

/**
 * Dashboard component for staff users of the web application
 */
class StaffDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(new Date().setHours(1, 0, 0, 0)),
			appointments: []
		};
		const { changeImage } = this.props;
		changeImage(false);
		this.fetchAppointments = this.fetchAppointments.bind(this);
	}

	componentDidMount() {
		this.fetchAppointments();
	}

	componentDidUpdate(_prevProps, prevState) {
		const { date } = this.state;
		if (date !== prevState.date) {
			this.fetchAppointments();
		}
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
	 * Fetch appointments from web api for a staff member
	 */
	fetchAppointments() {
		const { user } = this.context;
		const { date } = this.state;
		fetch(`http://localhost:3000/api/v1/appt/${user.ID}/${date.toISOString().substring(0, 10)}`, {
			headers: {
				Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`
			}
		})
			.then((res) => res.json())
			.then((data) => this.setState({ appointments: data }))
			.then((err) => console.error(err));
	}

	render() {
		const { date, appointments } = this.state;
		const dateFormat = 'dddd Do MMMM YYYY';
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
					<Button
						style={{ width: '9rem' }}
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

				<Row style={{ marginTop: '2rem' }} justify="space-around">
					{appointmentList}
				</Row>
			</div>
		);
	}
}

StaffDashboard.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};
StaffDashboard.contextType = UserContext;

export default StaffDashboard;
