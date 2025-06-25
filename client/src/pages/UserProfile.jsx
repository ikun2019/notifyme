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
		avatarUrl: '',
		postCount: 0,
		followedTags: [],
		thanksReceived: 0,
	});
	const [followedTags, setFollowedTag] = useState([]);
	const [allTags, setAllTags] = useState([]);
	const [search, setSearch] = useState('');

	const { user } = useSelector((state) => state.auth);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [userRes, followedTagsRes] = await Promise.all([
					axios.get(`/api/users/${user.id}`),
					axios.get(`/api/users/follow-tag/${user?.id}`),
				]);
				setProfile((prev) => ({
					...prev,
					id: userRes.data.id,
					name: userRes.data.name,
					email: userRes.data.email,
					avatarUrl: userRes.data.avatarUrl,
					postCount: userRes.data.postCount,
					followedTags: userRes.data.followedTags,
					thanksReceived: userRes.data.thanksReceived,
				}));
				setFollowedTag(followedTagsRes.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [user?.id]);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (search.trim() !== '') {
				axios
					.get('/api/tags', {
						params: {
							search: encodeURIComponent(search),
						},
					})
					.then((response) => {
						setAllTags(response.data);
					})
					.catch(console.error);
			} else {
				setAllTags([]);
			}
		}, 400);
		return () => clearTimeout(delayDebounce);
	}, [search]);

	const toggleFollow = async (tag) => {
		const isFollowed = followedTags.some((t) => t.id === tag.id);
		try {
			if (isFollowed) {
				setFollowedTag(followedTags.filter((t) => t.id !== tag.id));
				await axios.delete(
					'/api/users/follow-tag',
					{
						data: {
							userId: user.id,
							tagId: tag.id,
						},
					},
					{ withCredentials: true }
				);
			} else {
				setFollowedTag([...followedTags, tag]);
				await axios.post(
					`/api/users/follow-tag`,
					{
						userId: user.id,
						tagId: tag.id,
					},
					{ withCredentials: true }
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
			{profile ? (
				<form className="space-y-4">
					<div className="flex items-center space-x-4">
						<div className="relative">
							<img
								src={profile.avatarUrl || '/default-avatar.png'}
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
					{followedTags.length === 0 && (
						<div className="text-center text-gray-400 text-sm">タグが見つかりません</div>
					)}
					{followedTags?.map((tag, index) => (
						<span
							key={index}
							onClick={() => toggleFollow(tag)}
							className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full cursor-pointer"
						>
							# {tag.name}
						</span>
					))}
				</div>
			</div>

			{/* 検索バー */}
			<div>
				<input
					type="text"
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full mb-4 px-3 py-2 border border-blue-100 bg-blue-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
				/>
			</div>
			<div className="space-y-2">
				{allTags.map((tag) => {
					const isFollowed = followedTags.some((followedTag) => followedTag?.id === tag.id);
					return (
						<div
							key={tag.id}
							className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
								isFollowed ? 'bg-blue-50 text-blue-600' : 'bg-orange-100 text-orange-600'
							}`}
							onClick={() => toggleFollow(tag)}
						>
							<span className="font-medium text-sm">{tag.name}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke={isFollowed ? 'currentColor' : 'transparent'}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default UserProfile;
