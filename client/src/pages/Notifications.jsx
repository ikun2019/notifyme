import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from '../utils/axiosClient';

const Notifications = () => {
	const [activeTag, setActiveTag] = useState({ name: 'All', id: null });
	const [notifications, setNotifications] = useState([]);
	const [tags, setTags] = useState([]);
	const [followedTags, setFollowedTags] = useState([]);
	const cacheRef = useRef(null);

	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (cacheRef.current) {
			setNotifications(cacheRef.current);
			return;
		}
		axios
			.get('/api/posts')
			.then((response) => {
				setNotifications(response.data);
				const allTags = [
					...new Map(
						response.data.flatMap((item) =>
							item.tags.map((t) => [t.id, { id: t.id, name: t.name }])
						)
					).values(),
				].sort((a, b) => a.name.localeCompare(b.name));
				setTags(allTags);
			})
			.catch((err) => console.error('❌ getAllPosts Error:', err));
		// フォローしているタグを取得
		axios
			.get(`/api/users/follow-tag/${user?.id}`)
			.then((response) => setFollowedTags(response.data))
			.catch((err) => console.error('❌ getFollowTag Error:', err));
	}, [user?.id]);

	useEffect(() => {
		const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
		socket.onmessage = (event) => {
			try {
				const newNotification = JSON.parse(event.data);
				setNotifications((prev) => [newNotification, ...prev]);
			} catch (error) {
				console.error('❌ WebSocket Error:', error);
			}
		};
		return () => {
			socket.close();
		};
	}, []);

	const handleTagClick = async (tag) => {
		setActiveTag(tag);
		if (tag.name === 'All') {
			const response = await axios.get('/api/posts');
			setNotifications(response.data);
			return;
		}
		try {
			const response = await axios.get(`/api/posts/${tag.id}`);
			setNotifications(response.data);
		} catch (error) {
			console.error('❌ getPostsByTagId Error:', error);
		}
	};

	return (
		<div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
			<h1 className="text-2xl font-bold mb-4">New Notifications</h1>

			{/* タグタブ */}
			<div className="flex space-x-2 overflow-x-auto border-b pb-2">
				{[{ name: 'All', id: null }, ...followedTags].map((tag) => (
					<button
						key={tag.id}
						onClick={() => handleTagClick(tag)}
						className={`text-sm px-4 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
							activeTag.name === tag.name
								? 'bg-blue-600 text-white shadow-sm'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						}`}
					>
						# {tag.name}
					</button>
				))}
			</div>

			{/* 通知一覧 */}
			<div className="space-y-1">
				{notifications.map((item) => (
					<div
						key={item.id}
						className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition"
					>
						{item.imageUrl && (
							<img
								src={item.imageUrl}
								alt="thumb"
								className="w-20 h-20 object-cover rounded-md flex-shrink-0"
							/>
						)}
						<div className="flex-1">
							<div className="flex flex-wrap gap-2 mb-1">
								{item.tags.map((tag, i) => (
									<span
										key={i}
										className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
									>
										# {tag.name}
									</span>
								))}
							</div>
							<p className="text-base font-semibold text-gray-800 line-clamp-2">{item.content}</p>
							{item.link && (
								<a
									href={item.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-500 hover:underline mt-1 inline-block"
								>
									{item.link}
								</a>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Notifications;
