import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from '../utils/axiosClient';

const UserDashboard = () => {
	const { user } = useSelector((state) => state.auth);
	const [stats, setStats] = useState({
		postCount: 0,
		totalViews: 0,
		thanksCount: 0,
	});
	const [topArticles, setTopArticles] = useState([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axios.get(`/api/posts/total-views/${user.id}`);
				setStats((prev) => ({
					...prev,
					postCount: response.data.postCount,
					totalViews: response.data.totalViews,
					thanksCount: response.data.thanksCount,
				}));
			} catch (error) {
				console.error(error);
			}
		};
		fetchStats();
	}, [user.id]);

	return (
		<div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow">
			<h2 className="text-lg font-bold mb-4">Dashboard Overview</h2>
			<div className="flex gap-6 mb-4">
				<div>
					投稿数: <span className="font-semibold">{stats.postCount}</span>
				</div>
				<div>
					合計閲覧数: <span className="font-semibold">{stats.totalViews}</span>
				</div>
				<div>
					Thanks: <span className="font-semibold">{stats.thanksCount}</span>
				</div>
			</div>
			<hr className="mb-4" />
			<h3 className="font-semibold mb-2">Top Articles</h3>
			<table className="w-full text-sm border">
				<thead>
					<tr className="bg-gray-100">
						<th className="border p-2 text-left">Title</th>
						<th className="border p-2 text-right">Views</th>
					</tr>
				</thead>
				<tbody>
					{topArticles.map((article) => (
						<tr key={article.id}>
							<td className="border p-2">{article.title}</td>
							<td className="border p-2 text-right">{article.views}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="mt-4 text-blue-600 text-sm">
				<Link to="/user-profile">Back to Profile</Link>
			</div>
		</div>
	);
};

export default UserDashboard;
