import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const SendResetPassword = () => {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		});
		if (error) {
			alert(error.message);
			return;
		}
		setSubmitted(true);
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
			{submitted ? (
				<div className="text-green-600 font-medium text-sm">
					📧 パスワード再設定用のメールを送信しました。
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						name="email"
						placeholder="Your email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full border px-3 py-2 rounded-md text-sm"
					/>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
					>
						Send Reset Email
					</button>
				</form>
			)}
		</div>
	);
};

export default SendResetPassword;
