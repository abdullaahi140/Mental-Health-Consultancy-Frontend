import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './App.less';

import Nav from './components/nav.js';
import Home from './components/home.js';
import Login from './components/login.js';
import Register from './components/register.js';

import UserContext from './contexts/user.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			loggedIn: false,
			imageStyle: { backgroundImage: 'none' }
		};
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.changeImage = this.changeImage.bind(this);
	}

	login(user) {
		this.setState({ user, loggedIn: true });
	}

	logout() {
		this.setState({ user: null, loggedIn: false });
	}

	changeImage(checkImage) {
		if (checkImage) {
			this.setState({
				imageStyle: {
					backgroundImage: 'url(splash.jpeg)',
					backgroundPosition: '-256px',
					backgroundSize: '2208px 1443px'
				}
			});
		} else {
			this.setState({ imageStyle: { backgroundImage: 'none' } });
		}
	}

	render() {
		const context = {
			...this.state,
			login: this.login,
			logout: this.logout
		};
		const { imageStyle } = this.state;

		return (
			<UserContext.Provider value={context}>
				<Router>
					<Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
						<Layout.Header className="header">
							<Nav />
						</Layout.Header>

						<Layout.Content style={imageStyle}>
							<Switch>
								<Route path="/register">
									<Register changeImage={this.changeImage} />
								</Route>
								<Route path="/login">
									<Login changeImage={this.changeImage} />
								</Route>
								<Route exact path="/">
									<Home changeImage={this.changeImage} />
								</Route>
							</Switch>
						</Layout.Content>

						<Layout.Footer style={{ textAlign: 'center' }}>Mental Health Consultancy</Layout.Footer>
					</Layout>
				</Router>
			</UserContext.Provider>
		);
	}
}

export default App;
