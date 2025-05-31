import React from 'react';

const user = {
	name: 'John Doe',
	posts: 2,
	thanks: 6,
	following: 10,
	tags: ['#webdev', '#typescript', '#python', '#opensource', '#docker'],
};

const UserProfile = () => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
			{/* ユーザーアイコンと名前 */}
			<div className="flex items-center mb-4">
				<div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mr-4">
					{/* 代替アイコン */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z"
						/>
					</svg>
				</div>
				<div className="text-xl font-semibold">{user.name}</div>
			</div>

			{/* 投稿数・Thanks・フォロー */}
			<div className="flex gap-6 text-sm text-gray-700 mb-4">
				<div>
					<span className="font-semibold">{user.posts}</span> Posts
				</div>
				<div>
					<span className="font-semibold">{user.thanks}</span> Thanks
				</div>
				<div>
					<span className="font-semibold">{user.following}</span> Following
				</div>
			</div>

			<hr className="my-4" />

			{/* フォロー中のタグ */}
			<div>
				<h3 className="text-sm font-semibold mb-2">Following Tags</h3>
				<div className="flex flex-wrap gap-2">
					{user.tags.map((tag, index) => (
						<span
							key={index}
							className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
