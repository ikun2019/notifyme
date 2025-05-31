import React from 'react';

const thanksPosts = [
	{
		id: 1,
		text: 'Great resources for learning TypeScript!',
		tags: ['#typescript', '#webdev'],
	},
	{
		id: 2,
		text: 'An interesting approach to caching and scaling',
		tags: ['#architecture', '#performance'],
	},
	{
		id: 3,
		text: 'Check out my open-source Python library',
		tags: ['#python', '#opensource'],
	},
];

const ThanksHistory = () => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-semibold mb-1">Thanks</h2>
			<p className="text-sm text-gray-500 mb-4">Posts you have sent thanks to</p>

			<div className="space-y-4">
				{thanksPosts.map((post) => (
					<div key={post.id} className="border rounded-lg p-4 flex items-start justify-between">
						<div>
							<p className="text-sm font-medium mb-2">{post.text}</p>
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
						<div className="text-orange-500 text-sm font-semibold flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							Thanks
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ThanksHistory;
