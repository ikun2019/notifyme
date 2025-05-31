import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/modules/authSlice';
import { supabase } from '../utils/supabaseClient';

import {
	Bars3Icon,
	XMarkIcon,
	HomeIcon,
	PlusCircleIcon,
	TagIcon,
	StarIcon,
	UserCircleIcon,
	ArrowRightEndOnRectangleIcon,
	ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

const pageTitles = {
	'/': 'Home',
	'/new': 'New Post',
	'/followed-tags': 'Followed Tags',
	'/thanks-history': 'Thanks Sent',
	'/received-leaderboard': 'Thanks Leaderboard',
	'/user-profile': 'My Profile',
	'/edit-profile': 'Edit Profile',
	'/notification-card': 'Notification Card',
	'/user-ranking': 'User Ranking',
};

const DefaultLayout = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [thanksOpen, setThanksOpen] = useState(false);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated } = useSelector((state) => state.auth);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		dispatch(logout());
		navigate('/login');
	};

	useEffect(() => {
		if (
			location.pathname.startsWith('/thanks-history') ||
			location.pathname.startsWith('/received-thanks') ||
			location.pathname.startsWith('/thanks-leaderboard')
		) {
			setThanksOpen(true);
		}
	}, [location.pathname]);

	return (
		<div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row">
			{/* サイドバー (PC) */}
			<aside className="hidden md:flex flex-col w-56 bg-white border-r shadow-sm p-4">
				<h1 className="text-xl font-bold text-blue-600 mb-6">NotifyMe</h1>
				<nav className="flex flex-col gap-3 text-sm">
					<NavItem to="/" label="Home" icon={HomeIcon} />
					<NavItem to="/new" label="Post" icon={PlusCircleIcon} />
					<NavItem to="/followed-tags" label="Tags" icon={TagIcon} />

					{/* Thanksグループ */}
					<div>
						<button
							onClick={() => setThanksOpen(!thanksOpen)}
							className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-blue-50 transition"
						>
							<StarIcon className="h-5 w-5" />
							<span className="flex-1 text-left">Thanks</span>
							<svg
								className={`h-4 w-4 transform transition-transform ${
									thanksOpen ? 'rotate-90' : ''
								}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
						{thanksOpen && (
							<div className="pl-8 mt-2 flex flex-col gap-2 text-gray-600">
								<SubNavItem to="/thanks-history" label="Sent" />
								<SubNavItem to="/received-thanks" label="Received" />
								<SubNavItem to="/thanks-leaderboard" label="Leaderboard" />
							</div>
						)}
					</div>
					{isAuthenticated ? (
						<>
							<NavItem to="/user-profile" label="My Page" icon={UserCircleIcon} />
							<button
								onClick={handleLogout}
								className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 text-sm"
							>
								<ArrowRightStartOnRectangleIcon className="h-5 w-5" />
								Logout
							</button>
						</>
					) : (
						<NavItem to="/login" label="Login" icon={ArrowRightEndOnRectangleIcon} />
					)}
				</nav>
			</aside>

			{/* モバイルヘッダー */}
			<header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
				<h1 className="text-lg font-bold text-blue-600">NotifyMe</h1>
				<button onClick={() => setMenuOpen(!menuOpen)}>
					{menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
				</button>
			</header>

			{/* モバイルメニュー */}
			{menuOpen && (
				<nav className="md:hidden bg-white shadow px-4 py-3 border-b">
					<div className="flex flex-col gap-3 text-sm">
						<NavItem to="/" label="Home" icon={HomeIcon} onClick={() => setMenuOpen(false)} />
						<NavItem
							to="/new"
							label="Post"
							icon={PlusCircleIcon}
							onClick={() => setMenuOpen(false)}
						/>
						<NavItem
							to="/followed-tags"
							label="Tags"
							icon={TagIcon}
							onClick={() => setMenuOpen(false)}
						/>

						{/* Thanksグループ */}
						<button
							onClick={() => setThanksOpen(!thanksOpen)}
							className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition"
						>
							<StarIcon className="h-5 w-5" />
							<span className="flex-1 text-left">Thanks</span>
							<svg
								className={`h-4 w-4 transform transition-transform ${
									thanksOpen ? 'rotate-90' : ''
								}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
						{thanksOpen && (
							<div className="pl-8 mt-2 flex flex-col gap-2 text-gray-600">
								<SubNavItem to="/thanks-history" label="Sent" onClick={() => setMenuOpen(false)} />
								<SubNavItem
									to="/received-thanks"
									label="Received"
									onClick={() => setMenuOpen(false)}
								/>
								<SubNavItem
									to="/thanks-leaderboard"
									label="Leaderboard"
									onClick={() => setMenuOpen(false)}
								/>
							</div>
						)}

						{isAuthenticated ? (
							<>
								<NavItem
									to="/user-profile"
									label="My Page"
									icon={UserCircleIcon}
									onClick={() => setMenuOpen(false)}
								/>
								<button
									onClick={() => {
										setMenuOpen(false);
										handleLogout();
									}}
									className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 text-sm"
								>
									<ArrowRightStartOnRectangleIcon className="h-5 w-5" />
									Logout
								</button>
							</>
						) : (
							<NavItem
								to="/login"
								label="Login"
								icon={ArrowRightEndOnRectangleIcon}
								onClick={() => setMenuOpen(false)}
							/>
						)}
					</div>
				</nav>
			)}

			{/* メイン */}
			<main className="flex-1 p-4 max-w-3xl mx-auto w-full">
				<h2 className="text-xl font-semibold mb-4">{pageTitles[location.pathname] || ''}</h2>
				<Outlet />
			</main>
		</div>
	);
};

function NavItem({ to, label, icon: Icon, onClick }) {
	const location = useLocation();
	const isActive = location.pathname === to;
	return (
		<Link
			to={to}
			onClick={onClick}
			className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition ${
				isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
			}`}
		>
			<Icon className="h-5 w-5" />
			{label}
		</Link>
	);
}

function SubNavItem({ to, label, onClick }) {
	const location = useLocation();
	const isActive = location.pathname === to;
	return (
		<Link
			to={to}
			onClick={onClick}
			className={`px-2 py-1 rounded-md hover:bg-blue-50 transition ${
				isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
			}`}
		>
			{label}
		</Link>
	);
}
export default DefaultLayout;
