import React, { useState } from 'react';

const allTags = ['#golang', '#microservices', '#serverless', '#webdevelopment'];

const FollowedTags = () => {
	const [search, setSearch] = useState('');
	const [followed, setFollowed] = useState(['#golang', '#microservices', '#serverless']);

	const toggleFollow = (tag) => {
		if (followed.includes(tag)) {
			setFollowed(followed.filter((t) => t !== tag));
		} else {
			setFollowed([...followed, tag]);
		}
	};

	const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()));
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-semibold mb-1">Followed Tags</h2>
			<p className="text-sm text-gray-500 mb-4">
				Select hashtags to receive notifications for posts with those tags.
			</p>

			{/* 検索バー */}
			<input
				type="text"
				placeholder="Search"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="w-full mb-4 px-3 py-2 border border-blue-100 bg-blue-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
			/>

			{/* タグ一覧 */}
			<div className="space-y-2">
				{filteredTags.map((tag) => {
					const isFollowed = followed.includes(tag);
					return (
						<div
							key={tag}
							className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
								isFollowed ? 'bg-blue-50 text-blue-600' : 'bg-orange-100 text-orange-600'
							}`}
							onClick={() => toggleFollow(tag)}
						>
							<span className="font-medium text-sm">{tag}</span>
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

export default FollowedTags;
