import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { validatePassword } from '../../utils/validatePassword';
import { supabase } from '../../utils/supabaseClient';
import { logout } from '../../store/modules/authSlice';

const ResetPasswordForm = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [form, setForm] = useState({
		password: '',
		confirm: '',
	});

	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.password !== form.confirm) {
			setError('Password do not match.');
			return;
		}
		if (!validatePassword(form.password)) {
			setError('Password must be at least 8 characters and contain both letters and numbers.');
			return;
		}
		const { error } = await supabase.auth.updateUser({ password: form.password });

		if (error) {
			setError(error.message);
			return;
		}
		await supabase.auth.signOut();
		dispatch(logout());
		setSuccess(true);
		setTimeout(() => {
			navigate('/login');
		}, 2000);
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Set New Password</h2>
			{success ? (
				<p className="text-green-600 font-medium text-sm">
					パスワードが更新されました。ログイン画面にリダイレクトします。
				</p>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="password"
						name="password"
						placeholder="New password"
						value={form.password}
						onChange={handleChange}
						required
						className="w-full border px-3 py-2 rounded-md text-sm"
					/>
					<input
						type="password"
						name="confirm"
						placeholder="Confirm new password"
						value={form.confirm}
						onChange={handleChange}
						required
						className="w-full border px-3 py-2 rounded-md text-sm"
					/>
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
					>
						Reset Password
					</button>
				</form>
			)}
		</div>
	);
};

export default ResetPasswordForm;
