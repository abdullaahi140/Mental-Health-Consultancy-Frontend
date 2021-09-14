import React, { useState } from 'react';
import {
	BrowserRouter as Router, Switch, Route
} from 'react-router-dom';
import { Layout } from 'antd';
import './App.less';

import Nav from './components/nav.js';
import Home from './components/home.js';
import Login from './components/login.js';
import Register from './components/register.js';
import BookAppointment from './components/book_appointment.js';
import StaffDashboard from './components/staff_dashboard.js';

import UserProvider from './providers/UserProvider.js';
import PrivateRoute from './HoC/private.js';

function App() {
	const [imageStyle, setImageStyle] = useState({ backgroundImage: 'none' });

	function changeImage(checkImage) {
		if (checkImage) {
			setImageStyle({
				backgroundImage: 'url(splash.jpeg)',
				backgroundPosition: '-256px',
				backgroundSize: '2208px 1443px'
			});
		} else {
			setImageStyle({ backgroundImage: 'none' });
		}
	}

	return (
		<Router>
			<UserProvider>
				<Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
					<Layout.Header>
						<Nav />
					</Layout.Header>

					<Layout.Content style={imageStyle}>
						<Switch>
							<Route path="/dashboard">
								<StaffDashboard changeImage={changeImage} />
							</Route>
							<PrivateRoute
								path="/book_appointment"
								component={BookAppointment}
								changeImage={changeImage}
							/>
							<Route path="/register">
								<Register changeImage={changeImage} />
							</Route>
							<Route path="/login">
								<Login changeImage={changeImage} />
							</Route>
							<Route exact path="/">
								<Home changeImage={changeImage} />
							</Route>
						</Switch>
					</Layout.Content>

					<Layout.Footer style={{ textAlign: 'center' }}>Mental Health Consultancy</Layout.Footer>
				</Layout>
			</UserProvider>
		</Router>
	);
}

export default App;
