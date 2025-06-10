import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosClient';
import { updateUserProfile } from '../store/modules/authSlice';
import MinimumLoadingSpinner from '../components/MinimumLoadingSpinner';

const ProfileEdit = () => {
	const [profile, setProfiles] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		avatarFile: null,
		previewUrl: '',
	});
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		axios.get(`/api/users/${user.id}`).then((result) => {
			setProfiles(result.data);
			setFormData((prev) => ({
				...prev,
				name: result.data.name,
				avatarFile: null,
				previewUrl: result.data.avatarUrl || '',
			}));
		});
	}, [user?.id]);

	const handleNameChange = (e) => {
		setFormData((prev) => ({ ...prev, name: e.target.value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				avatarFile: file,
				previewUrl: URL.createObjectURL(file),
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append('name', formData.name);
		if (formData.avatarFile) {
			data.append('avatar', formData.avatarFile);
		}
		try {
			const response = await axios.put(`/api/users/${user.id}`, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			dispatch(
				updateUserProfile({
					name: response.data.name,
					avatarUrl: response.data.avatarUrl,
				})
			);
			navigate('/user-profile');
		} catch (error) {
			console.error(error);
			alert('更新に失敗しました');
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<div className="relative flex items-center mb-4 min-h-[80px]">
				{profile ? (
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<img
									src={formData.previewUrl || '/default-avatar.png'}
									alt="Avatar"
									className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
								/>
								<label className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-700 transition">
									変更
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
								</label>
							</div>
							<div className="flex-1">
								<label htmlFor="name">User Name</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleNameChange}
									className="text-lg font-semibold border border-gray-300 rounded px-3 py-2 w-full"
									placeholder="ユーザー名"
								/>
							</div>
						</div>
						<div className="flex justify-end">
							<button
								type="submit"
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
							>
								Update
							</button>
						</div>
					</form>
				) : (
					<div className="py-4">
						<MinimumLoadingSpinner />
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfileEdit;
