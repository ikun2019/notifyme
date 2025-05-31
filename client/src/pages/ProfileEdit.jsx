import React from 'react';

const ProfileEdit = ({ user }) => {
	return (
		<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
			<div className="flex items-center mb-4">
				<div className="w-14 h-14 bg-gray-100 rounded-full mr-4" />
				<div>
					<h2 className="text-xl font-semibold">{user.name}</h2>
					<p className="text-sm text-gray-500">{user.thanks} Thanks received</p>
				</div>
			</div>
		</div>
	);
};

export default ProfileEdit;
