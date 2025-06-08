import React from 'react';

const MinimumLoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center">
			<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
		</div>
	);
};

export default MinimumLoadingSpinner;
