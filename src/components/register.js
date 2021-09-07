import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
	Form, Input, Button, message, Row, Col, Typography
} from 'antd';

import PropTypes from 'prop-types';
import useAuthentication from '../hooks/useAuthentication.js';

// Form layout for different screen sizes
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }
};

const firstNameRules = [
	{
		required: true,
		message: 'Please enter your first name!'
	}
];

const lastNameRules = [
	{
		required: true,
		message: 'Please enter your last name!'
	}
];

const usernameRules = [
	{
		required: true,
		message: 'Username must be 3 characters minimum!',
		whitespace: true,
		min: 3
	}
];

const passwordRules = [
	{
		required: true,
		message: 'Username must be 6 characters minimum!',
		min: 6
	}
];

const confirmRules = [
	{ required: true, message: 'Please confirm your password!' },
	/**
	 * Validator that checks if the password and confirm password field matches
	 * @param {} - Function that gets a field from a form using the value prop
	 * @returns Promise that rejects or resolves if the password fields match
	 */
	({ getFieldValue }) => ({
		validator(_rule, value) {
			if (!value || getFieldValue('password') === value) {
				return Promise.resolve();
			}
			return Promise.reject(Error('The password does not match!'));
		}
	})
];

/**
 * Registration form component for app signup.
 */
function RegistrationForm(props) {
	const { login } = useAuthentication();
	const [redirect, setRedirect] = useState(false);
	const location = useLocation();
	const history = useHistory();
	const { from } = location.state || { from: { pathname: '/' } };
	if (redirect) {
		history.push(from.pathname);
	}

	useEffect(() => {
		const { changeImage } = props;
		changeImage(false);
	}, []);

	/**
	 * Post the login request using values from the form
	 * */
	function loginUser(values) {
		const { username, password } = values;
		fetch('http://localhost:3000/api/v1/auth/login', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${username}:${password}`)}`
			}
		})
			.then((res) => res.json())
			.then((user) => {
				login(user);
				setRedirect(true);
			})
			.catch((err) => {
				console.error(err);
				message.error('Username is taken');
			});
	}

	/**
	 * Sumbit handler that posts the form response to the API
	 * @param {Object} values - Object containing all the values entered in the form
	 */
	function onFinish(values) {
		const { confirm: _confirm, ...body } = values;
		fetch('http://localhost:3000/api/v1/users', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
			.then((res) => res.json())
			.then((data) => loginUser(data))
			.catch((err) => {
				err.json()
					.then((data) => message.error(data.message));
			});
	}

	return (
		<Row type="flex" justify="space-around" align="middle" style={{ minHeight: '83vh' }}>
			<Col span={16}>
				<Typography.Title
					style={{ textAlign: 'center', marginBottom: '2rem' }}
				>
					Register
				</Typography.Title>
				<Form {...formItemLayout} name="register" onFinish={onFinish} scrollToFirstError>
					<Form.Item name="firstName" label="First Name" rules={firstNameRules}>
						<Input size="large" />
					</Form.Item>

					<Form.Item name="lastName" label="Last Name" rules={lastNameRules}>
						<Input size="large" />
					</Form.Item>

					<Form.Item name="username" label="Username" rules={usernameRules}>
						<Input size="large" />
					</Form.Item>

					<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
						<Input.Password size="large" />
					</Form.Item>

					<Form.Item
						name="confirm"
						label="Confirm Password"
						dependencies={['password']}
						hasFeedback
						rules={confirmRules}
					>
						<Input.Password size="large" />
					</Form.Item>

					<Form.Item {...tailFormItemLayout}>
						<Button
							type="primary"
							size="large"
							htmlType="submit"
						>
							Register
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
}

RegistrationForm.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default RegistrationForm;
