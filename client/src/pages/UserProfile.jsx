import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosClient';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import MinimumLoadingSpinner from '../components/MinimumLoadingSpinner';

const UserProfile = () => {
	const [profile, setProfile] = useState({
		id: '',
		name: '',
		email: '',
		avaterUrl: '',
		postCount: 0,
		followedTags: [],
		thanksReceived: 0,
	});
	const { user } = useSelector((state) => state.auth);
	useEffect(() => {
		axios.get(`/api/users/${user.id}`).then((result) => {
			setProfile((prev) => ({
				...prev,
				id: result.data.id,
				name: result.data.name,
				email: result.data.email,
				avaterUrl: result.data.avaterUrl,
				postCount: result.data.postCount,
				followedTags: result.data.followedTags,
				thanksReceived: result.data.thanksReceived,
			}));
		});
	}, [user?.id]);

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
			{profile ? (
				<form className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative">
							<img
								src={profile.avaterUrl || '/default-avatar.png'}
								alt="Avatar"
								className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
							/>
						</div>
						<div className="flex-1">
							<h2 className="text-lg font-semibold">{profile.name}</h2>
							<p className="text-sm text-gray-500">{profile.email}</p>
							<Link
								to="/edit-profile"
								className="inline-block text-sm text-blue-600 hover:underline mt-2"
							>
								Edit Profile
							</Link>
						</div>
					</div>
				</form>
			) : (
				<div className="py-4 w-full flex justify-center">
					<MinimumLoadingSpinner />
				</div>
			)}

			{/* 投稿数・Thanks・フォロー */}
			<div className="flex gap-6 text-sm text-gray-700 mb-4">
				<div>
					<span className="font-semibold">{profile.postCount}</span> Posts
				</div>
				<div>
					<span className="font-semibold">{profile.thanksReceived}</span> Thanks
				</div>
				<div>
					<span className="font-semibold">{profile.followedTags.length}</span> Following
				</div>
			</div>

			<hr className="my-4" />

			{/* フォロー中のタグ */}
			<div>
				<h3 className="text-sm font-semibold mb-2">Following Tags</h3>
				<div className="flex flex-wrap gap-2">
					{profile.followedTags?.map((tag, index) => (
						<span
							key={index}
							className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
						>
							{tag.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
