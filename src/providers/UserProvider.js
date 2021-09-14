import React, { useReducer } from 'react';
import UserContext from '../contexts/user.js';

function userReducer(state, action) {
	switch (action.type) {
		case 'LOGIN': {
			return { user: action.payload, loggedIn: true };
		}
		case 'LOGOUT': {
			return { user: null, loggedIn: false };
		}
		default: {
			throw new Error(`Unsupported action type: ${action.type}`);
		}
	}
}

function UserProvider(props) {
	const initialState = { user: null, loggedIn: false };
	const [state, dispatch] = useReducer(userReducer, initialState);
	const value = { state, dispatch };
	return <UserContext.Provider value={value} {...props} />;
}

export default UserProvider;
