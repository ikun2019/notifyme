import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { supabase } from '../utils/supabaseClient';
import { login, logout } from '../store/modules/authSlice';
import { useLocation } from 'react-router-dom';

const SessionManager = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		const restoreSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const skipRestore = location.pathname.startsWith('/reset-password');
			if (session?.user && !skipRestore) {
				dispatch(
					login({
						user: session.user,
						token: session.access_token,
					})
				);
			}
		};

		const authSubscription = async () => {
			const {
				data: { subscription },
			} = await supabase.auth.onAuthStateChange((event, session) => {
				if (event === 'SIGN_IN' && session?.user) {
					dispatch(
						login({
							user: session.user,
							token: session.access_token,
						})
					);
				} else if (event === 'SIGNED_OUT') {
					dispatch(logout());
				}
			});
			return () => subscription.unsubscribe();
		};

		restoreSession();
		authSubscription();
	}, [dispatch, location.pathname]);
	return null;
};

export default SessionManager;
