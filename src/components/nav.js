import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/user.js';

/**
 * Navigation component for page header
 */
class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleNav = this.handleNav.bind(this);
	}

	handleLogout() {
		const { logout } = this.context;
		logout();
	}

	handleNav() {
		const { user, loggedIn } = this.context;
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
			loginNav = (
				<>
					<Menu.Item key="4" style={{ float: 'right' }}>
						<Link to="/register">Register</Link>
					</Menu.Item>
					<Menu.Item key="5" style={{ float: 'right' }}>
						<Link to="/login">Login</Link>
					</Menu.Item>
				</>
			);
		} else {
			loginNav = (
				<Menu.Item key="4" onClick={this.handleLogout} style={{ float: 'right' }}>
					<Link to="/">Logout</Link>
				</Menu.Item>
			);
		}
		return [apptNav, loginNav];
	}

	render() {
		return (
			<Menu theme="light" defaultSelectedKeys={['1']} mode="horizontal">
				<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
				<Menu.Item key="2"><Link to="/book_appointment">Book Appointment</Link></Menu.Item>
				{ this.handleNav()}
			</Menu>
		);
	}
}

Nav.contextType = UserContext;

export default Nav;
