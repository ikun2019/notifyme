import { useState } from 'react';
import axios from '../utils/axiosClient';
import { useSelector } from 'react-redux';

const NewPost = ({ isPremium = true }) => {
	const [text, setText] = useState('');
	const [tags, setTags] = useState([]);
	const [link, setLink] = useState('');
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	const maxChars = 100;

	const { user } = useSelector((state) => state.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess(false);
		if (!text.trim()) {
			setError('内容は必須です');
			return;
		}
		if (text.length > maxChars) {
			setError('内容は100文字以内にしてください');
			return;
		}
		const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;
		if (link && !urlRegex.test(link)) {
			setError('リンクが正しいURL形式ではありません');
			return;
		}

		try {
			setLoading(true);
			const formData = new FormData();
			formData.append('authorId', user?.id);
			formData.append('content', text);
			formData.append('link', link);
			formData.append('tags', tags);
			if (image) {
				formData.append('image', image);
			}
			await axios.post('/api/posts', formData, {
				withCredentials: true,
			});
			setText('');
			setLink('');
			setImage('');
			setTags([]);
			setSuccess(true);
		} catch (error) {
			console.error('❌ NewPost Error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-semibold mb-4">New Post</h2>
			{success && <p className="text-green-600">投稿が完了しました</p>}
			<form onSubmit={handleSubmit} className="space-y-3">
				{/* 通知本文 */}
				<textarea
					className="w-full border border-gray-300 rounded-md p-3 resize-none text-sm"
					rows={4}
					maxLength={maxChars}
					placeholder="Write your notification..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className="text-right text-xs text-gray-500 mt-1">
					{maxChars - text.length} characters left
				</div>

				{/* タグ */}
				<div className="mt-4 mb-2 font-medium text-sm">Tags</div>
				<button
					type="button"
					className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-md font-medium hover:bg-orange-200 transition"
					onClick={() => {
						const tag = prompt('Enter a tag (e.g., #Docker)');
						if (tag && !tags.includes(tag)) setTags([...tags, tag]);
					}}
				>
					+ Add Tag
				</button>

				{/* タグ表示 */}
				<div className="flex flex-wrap gap-2 mt-2">
					{tags.map((tag, index) => (
						<span
							key={index}
							className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
						>
							{tag}
						</span>
					))}
				</div>

				{/* リンク */}
				<div className="mt-6 mb-1 font-medium text-sm">Link</div>
				<input
					type="url"
					value={link}
					onChange={(e) => setLink(e.target.value)}
					placeholder="https://"
					className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-100"
				/>

				{/* プレミアム画像投稿 */}
				{isPremium && (
					<div className="mt-6">
						<div className="mb-1 font-medium text-sm">Image (Premium only)</div>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => setImage(e.target.files[0])}
							className="text-sm"
						/>
						{image && <div className="mt-2 text-xs text-gray-500">Selected: {image.name}</div>}
					</div>
				)}

				{/* 投稿ボタン */}
				<button
					type="submit"
					className="mt-6 w-full bg-blue-500 text-white text-sm py-2 rounded-md hover:bg-blue-600 transition"
				>
					{loading ? 'Loading...' : 'Post'}
				</button>
				{error && <p className="text-red-500">{error}</p>}
			</form>
		</div>
	);
};

export default NewPost;
