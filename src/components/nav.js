import React from 'react';
import { Link } from 'react-router-dom';
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
						<Link to="/dashboard">Staff Dashboard</Link>
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
			loginNav = [
				<Menu.Item key="4" style={{ float: 'right' }}>
					<Link to="/register">Register</Link>
				</Menu.Item>,
				<Menu.Item key="5" style={{ float: 'right' }}>
					<Link to="/login">Login</Link>
				</Menu.Item>
			];
		} else {
			loginNav = [
				<Menu.Item
					key="6"
					onClick={(() => logout())}
					style={{ float: 'right' }}
				>
					<Link to="/">Logout</Link>
				</Menu.Item>
			];
		}
		return [apptNav, ...loginNav];
	}

	return (
		<Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
			<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
			<Menu.Item key="2"><Link to="/book_appointment">Book Appointment</Link></Menu.Item>
			{handleNav()}
		</Menu>
	);
}

export default Nav;
