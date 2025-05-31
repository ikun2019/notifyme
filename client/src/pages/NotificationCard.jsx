import React from 'react';

const NotificationCard = ({ text, clicked }) => {
	return (
		<div
			className={`border rounded-lg p-4 mb-2 ${
				clicked ? 'bg-gray-50' : 'bg-white'
			} cursor-pointer hover:shadow`}
		>
			<p className="text-sm font-medium">{text}</p>
			<p className="text-xs text-gray-400 mt-1">{clicked ? 'Viewed' : 'New'}</p>
		</div>
	);
};

export default NotificationCard;
