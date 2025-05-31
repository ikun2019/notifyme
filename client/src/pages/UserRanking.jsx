import React from 'react';

const userStats = [
	{ name: 'Alice', posts: 12, thanks: 35 },
	{ name: 'Bob', posts: 18, thanks: 27 },
	{ name: 'You', posts: 10, thanks: 22 },
];

const UserRanking = () => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">User Ranking</h2>
			<table className="w-full text-sm text-left">
				<thead className="text-gray-500 border-b">
					<tr>
						<th className="py-2">User</th>
						<th>Posts</th>
						<th>Thanks</th>
					</tr>
				</thead>
				<tbody>
					{userStats.map((u, i) => (
						<tr key={i} className="border-b">
							<td className="py-2 font-medium">{u.name}</td>
							<td>{u.posts}</td>
							<td>{u.thanks}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserRanking;
