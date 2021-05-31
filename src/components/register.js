import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Form, Input, Button, message, Row, Col
} from 'antd';

import PropTypes from 'prop-types';
import UserContext from '../contexts/user.js';

// Form layout for different screen sizes
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }
};

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
class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);
		const { changeImage } = this.props;
		changeImage(false);
		this.state = { redirect: false };
		this.onFinish = this.onFinish.bind(this);
	}

	/**
	 * Sumbit handler that posts the form response to the API
	 * @param {Object} values - Object containing all the values entered in the form
	 */
	onFinish(values) {
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
			.then((data) => this.login(data))
			.catch((err) => {
				err.json()
					.then((data) => message.error(data.message));
			});
	}

	/**
	 * Post the login request using values from the form
	 * */
	login(values) {
		const { username, password } = values;
		fetch('http://localhost:3000/api/v1/auth/login', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${username}:${password}`)}`
			}
		})
			.then((res) => res.json())
			.then((user) => {
				const { login } = this.context;
				login(user);
				this.setState({ redirect: true });
			})
			.catch((err) => {
				console.error(err);
				message.error('Incorrect username or password');
			});
	}

	render() {
		const { redirect } = this.state;
		const { location, history } = this.props;
		const { from } = location.state || { from: { pathname: '/' } };
		if (redirect) {
			history.push(from.pathname);
		}

		return (
			<Row type="flex" justify="space-around" align="middle" style={{ minHeight: '83vh' }}>
				<Col span={24}>
					<Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError>
						<Form.Item name="firstName" label="First Name">
							<Input />
						</Form.Item>

						<Form.Item name="lastName" label="Last Name">
							<Input />
						</Form.Item>

						<Form.Item name="username" label="Username" rules={usernameRules}>
							<Input />
						</Form.Item>

						<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
							<Input.Password />
						</Form.Item>

						<Form.Item
							name="confirm"
							label="Confirm Password"
							dependencies={['password']}
							hasFeedback
							rules={confirmRules}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmlType="submit">
								Register
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		);
	}
}

RegistrationForm.contextType = UserContext;
RegistrationForm.propTypes = {
	/** Object containing info on the past, present and future location of the app  */
	location: PropTypes.object.isRequired,
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired,
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default withRouter(RegistrationForm);
