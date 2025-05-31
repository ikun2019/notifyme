import React from 'react';

const thanksRanking = [
	{ name: 'Alice', thanks: 35 },
	{ name: 'Bob', thanks: 27 },
	{ name: 'You', thanks: 22 },
];

const ThanksLeaderboard = () => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Thanks Leaderboard</h2>
			<ul className="space-y-2">
				{thanksRanking.map((user, i) => (
					<li key={i} className="flex justify-between">
						<span className={`${user.name === 'You' ? 'font-semibold text-blue-600' : ''}`}>
							{i + 1}. {user.name}
						</span>
						<span>{user.thanks} Thanks</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ThanksLeaderboard;
