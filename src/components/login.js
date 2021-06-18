import React from 'react';
import { withRouter } from 'react-router-dom';

import {
	Form, Typography, Input, Button, message, Row, Col
} from 'antd';
import PropTypes from 'prop-types';

import UserContext from '../contexts/user.js';

// Form layout for different screen sizes
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};

// Form layout for buttons at the end of the form
const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }
};

const passwordRules = [
	{ required: true, message: 'Please input your password!' }
];

const usernameRules = [
	{ required: true, message: 'Please input your username!', whitespace: true }
];

/**
 * Login form component for app signup.
 */
class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		const { changeImage } = this.props;
		changeImage(false);
		this.state = { redirect: false };
		this.login = this.login.bind(this);
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
			<Row type="flex" justify="center" align="middle" style={{ minHeight: '83vh' }}>
				<Col span={24}>
					<Typography.Title
						style={{ textAlign: 'center', marginBottom: '2rem' }}
					>
						Login
					</Typography.Title>
					<Form
						{...formItemLayout}
						name="login"
						onFinish={this.login}
						scrollToFirstError
					>
						<Form.Item name="username" label="Username" rules={usernameRules}>
							<Input size="large" />
						</Form.Item>
						<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
							<Input.Password size="large" />
						</Form.Item>
						<Form.Item {...tailFormItemLayout}>
							<Button
								style={{ marginBottom: '1rem' }}
								size="large"
								type="primary"
								htmlType="submit"
							>
								Login
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		);
	}
}

LoginForm.contextType = UserContext;
LoginForm.propTypes = {
	/** Object containing info on the past, present and future location of the app  */
	location: PropTypes.object.isRequired,
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired,
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default withRouter(LoginForm);
