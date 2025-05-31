import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/modules/authSlice';
import { supabase } from '../../utils/supabaseClient';

const Login = () => {
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { data, error } = await supabase.auth.signInWithPassword({
			email: form.email,
			password: form.password,
		});

		if (error) {
			alert(error.message);
			return;
		}

		dispatch(login({ user: data.user, token: data.session.access_token }));
		navigate('/');
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Log In</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					className="w-full border px-3 py-2 rounded-md text-sm"
					required
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					className="w-full border px-3 py-2 rounded-md text-sm"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
				>
					Log In
				</button>
			</form>
			<p className="mt-4 text-sm text-center text-gray-600">
				Don't have an account?{' '}
				<Link to="/signup" className="text-blue-600 hover:underline">
					Sign up
				</Link>
			</p>
			<p className="mt-2 text-sm text-center text-gray-600">
				Forgot your password?{' '}
				<Link to="/send-reset-password" className="text-blue-600 hover:underline">
					Reset here
				</Link>
			</p>
		</div>
	);
};

export default Login;
