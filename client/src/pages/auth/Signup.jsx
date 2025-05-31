import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { validatePassword } from '../../utils/validatePassword';
import { supabase } from '../../utils/supabaseClient';

const Signup = () => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		confirm: '',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== form.confirm) {
			alert("Passwords don't match");
			return;
		}

		if (!validatePassword(form.password)) {
			alert('Password must be at least 8 characters and contain both letters and numbers.');
			return;
		}

		const { error } = await supabase.auth.signUp({
			email: form.email,
			password: form.password,
			options: {
				data: { displayName: form.name },
			},
		});

		if (error) {
			alert(error.message);
			return;
		}
		alert('Confirmation email sent. Please check your inbox.');
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Sign Up</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<input
					name="name"
					placeholder="Name"
					value={form.name}
					onChange={handleChange}
					className="w-full border px-3 py-2 rounded-md text-sm"
					required
				/>
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
				<input
					name="confirm"
					type="password"
					placeholder="Confirm Password"
					value={form.confirm}
					onChange={handleChange}
					className="w-full border px-3 py-2 rounded-md text-sm"
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
				>
					Create Account
				</button>
			</form>
			<p className="mt-4 text-sm text-center text-gray-600">
				Already have an account?{' '}
				<Link to="/login" className="text-blue-600 hover:underline">
					Log in
				</Link>
			</p>
		</div>
	);
};

export default Signup;
