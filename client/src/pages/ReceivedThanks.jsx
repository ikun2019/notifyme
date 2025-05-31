import React from 'react';

const receivedThanks = [
	{
		id: 1,
		text: 'Your TypeScript guide helped me a lot!',
		tags: ['#typescript', '#frontend'],
		from: 'Alice',
	},
	{
		id: 2,
		text: 'Thanks for the open-source CLI tool!',
		tags: ['#opensource', '#cli'],
		from: 'Bob',
	},
];

const ReceivedThanks = () => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<h2 className="text-xl font-semibold mb-4">Thanks Received</h2>
			{receivedThanks.map((item) => (
				<div key={item.id} className="border rounded-lg p-4 mb-4">
					<p className="text-sm font-medium mb-1">{item.text}</p>
					<p className="text-xs text-gray-500 mb-2">from {item.from}</p>
					<div className="flex gap-2 flex-wrap">
						{item.tags.map((tag, i) => (
							<span key={i} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
								{tag}
							</span>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default ReceivedThanks;
