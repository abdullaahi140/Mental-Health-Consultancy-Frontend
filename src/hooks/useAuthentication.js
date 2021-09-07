import { useContext } from 'react';
import UserContext from '../contexts/user.js';

function useAuthentication() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useAuthentication must be used within a UserProvider');
	}

	const [state, dispatch] = context;
	const login = ((user) => dispatch({ type: 'LOGIN', payload: user }));
	const logout = (() => dispatch({ type: 'LOGOUT' }));

	return {
		state, dispatch, login, logout
	};
}

export default useAuthentication;
