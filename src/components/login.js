import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import {
	Form, Typography, Input, Button, message, Row, Col
} from 'antd';
import PropTypes from 'prop-types';

import useAuthentication from '../hooks/useAuthentication.js';

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
	{ required: true, message: 'Please enter your password!' }
];

const usernameRules = [
	{ required: true, message: 'Please enter your username!', whitespace: true }
];

/**
 * Login form component for app signup.
 */
function LoginForm(props) {
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
				message.error('Incorrect username or password. Try again.', 5);
			});
	}

	return (
		<Row type="flex" justify="center" align="middle" style={{ minHeight: '83vh' }}>
			<Col span={16}>
				<Typography.Title
					style={{ textAlign: 'center', marginBottom: '2rem' }}
				>
					Login
				</Typography.Title>
				<Form
					{...formItemLayout}
					name="login"
					onFinish={loginUser}
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
				<Typography style={{ textAlign: 'center', fontSize: '16px' }}>
					Don&#39;t have an account?&nbsp;
					<Link
						to={{
							pathname: '/register',
							state: location.state
						}}
					>
						Register one here
					</Link>
				</Typography>
			</Col>
		</Row>
	);
}

LoginForm.propTypes = {
	/** Function to change the background image of the page */
	changeImage: PropTypes.func.isRequired
};

export default LoginForm;
