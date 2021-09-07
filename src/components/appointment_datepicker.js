import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

function AppointmentDatePicker(props) {
	const { disablePrevious, date, setDate } = props;
	const [disabled, setDisabled] = useState(disablePrevious);
	const dateFormat = 'dddd Do MMMM YYYY';

	/**
	 * Check if the current date matches today.
	 * Disable "Previous day" button if it matches.
	 */
	useEffect(() => {
		if (disablePrevious) {
			const today = new Date();
			today.setHours(1, 0, 0, 0);
			if (today.getTime() === date.getTime()) {
				setDisabled(true);
			} else {
				setDisabled(false);
			}
		}
	}, [date]);

	/**
	 * Change the date on the page
	 * @param {Number} adjust - The value to adjust the current date by
	 */
	function changeDate(adjust) {
		const adjustedDate = new Date(date);
		adjustedDate.setDate(date.getDate() + adjust);
		setDate(adjustedDate);
	}

	/**
	 * Disable dates before today in the DatePicker
	 * Applies only when disablePrevious
	 * @returns {boolean} Whether to disable previous dates
	 */
	function disableDate(currentDate) {
		if (disablePrevious) {
			return currentDate < moment().startOf('day');
		}
		return false;
	}

	return (
		<>
			<Button
				style={{ width: '9rem' }}
				disabled={disabled}
				icon={<ArrowLeftOutlined />}
				size="large"
				onClick={() => changeDate(-1)}
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
				disabledDate={disableDate}
				onChange={(momentDate) => setDate(momentDate.toDate())}
			/>
			<Button
				style={{ width: '7rem' }}
				size="large"
				onClick={() => changeDate(1)}
			>
				Next day
				<ArrowRightOutlined />
			</Button>
		</>
	);
}

AppointmentDatePicker.propTypes = {
	disablePrevious: PropTypes.bool.isRequired,
	date: PropTypes.instanceOf(Date).isRequired,
	setDate: PropTypes.func.isRequired
};
export default AppointmentDatePicker;
