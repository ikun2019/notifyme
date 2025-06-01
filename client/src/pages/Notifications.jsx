import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from '../utils/axiosClient';

const Notifications = () => {
	const [notifications, setNotifications] = useState([]);
	useEffect(() => {
		axios
			.get('/api/posts')
			.then((response) => setNotifications(response.data))
			.catch((err) => console.error('❌ getAllPosts Error:', err));
	}, []);

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

	return (
		<div className="max-w-xl mx-auto px-4 py-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Notifications</h1>
				<Link
					to="/new"
					className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
				>
					New Post
				</Link>
			</div>

			{notifications.map((item) => (
				<div key={item.id} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
					<div className="flex flex-wrap gap-2 mb-2">
						{item.tags.map((tag, i) => (
							<span
								key={i}
								className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
							>
								{tag.name}
							</span>
						))}
						<span className="ml-auto text-sm text-gray-400">{item.createdAt}</span>
					</div>

					{/* 本文テキスト */}
					<p className="text-sm font-medium mb-2">{item.content}</p>

					{/* 任意リンク */}
					{item.link && (
						<a
							href={`${item.link}`}
							className="text-sm text-gray-500 underline mb-2 block"
							target="_blank"
							rel="noopener noreferrer"
						>
							{item.link}
						</a>
					)}

					{/* 任意画像（プレミアムユーザー用） */}
					{item.imageUrl && (
						<div className="rounded-md overflow-hidden mb-2">
							<img src={item.imageUrl} alt="Attached" className="w-full h-auto object-cover" />
						</div>
					)}

					{/* Thanksボタン */}
					<div className="flex justify-end mt-1">
						<button className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Thanks
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Notifications;
