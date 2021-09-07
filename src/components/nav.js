import React from 'react';
import { Menu } from 'antd';
import useAuthentication from '../hooks/useAuthentication.js';

/**
 * Navigation component for page header
 */
function Nav() {
	const { state, logout } = useAuthentication();

	function handleNav() {
		const { user, loggedIn } = state;
		let apptNav;
		let loginNav;

		try {
			if (user.role !== 'user') {
				apptNav = (
					<Menu.Item key="3">
						<a href="/dashboard">Staff Dashboard</a>
					</Menu.Item>
				);
			}
		} catch (err) {
			if (err instanceof TypeError) {
				// pass;
			} else {
				throw err;
			}
		}

		if (!loggedIn) {
			loginNav = (
				<>
					<Menu.Item key="4" style={{ float: 'right' }}>
						<a href="/register">Register</a>
					</Menu.Item>
					<Menu.Item key="5" style={{ float: 'right' }}>
						<a href="/login">Login</a>
					</Menu.Item>
				</>
			);
		} else {
			loginNav = (
				<Menu.Item
					key="6"
					onClick={(() => logout())}
					style={{ float: 'right' }}
				>
					<a href="/">Logout</a>
				</Menu.Item>
			);
		}
		return [apptNav, loginNav];
	}

	return (
		<Menu theme="light" defaultSelectedKeys={['1']}>
			<Menu.Item key="1"><a href="/">Home</a></Menu.Item>
			<Menu.Item key="2"><a href="/book_appointment">Book Appointment</a></Menu.Item>
			{handleNav()}
		</Menu>
	);
}

export default Nav;
