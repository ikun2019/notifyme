import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// * Layoutのインポート
import DefaultLayout from './layouts/Dafault';

// * ページのインポート
import Notifications from './pages/Notifications';
import NewPost from './pages/NewPost';
import FollowedTags from './pages/FollowedTags';
import ThanksHistory from './pages/ThanksHistory';
import UserProfile from './pages/UserProfile';
import ReceivedThanks from './pages/ReceivedThanks';
import NotificationCard from './pages/NotificationCard';
import ThanksLeaderboard from './pages/ThanksLeaderboard';
import ProfileEdit from './pages/ProfileEdit';
import UserRanking from './pages/UserRanking';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import SendResetPassword from './pages/auth/SendResetPassword';
import ResetPasswordForm from './pages/auth/ResetPasswordForm';

// * componentsのインポート
import ProtectedRoute from './components/ProtectedRoute';
import SessionManager from './components/SessionManager';

const App = () => {
	return (
		<BrowserRouter>
			<SessionManager />
			<Routes>
				<Route path="/" element={<DefaultLayout />}>
					<Route index element={<Notifications />} />
					<Route
						path="/new"
						element={
							<ProtectedRoute>
								<NewPost />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/followed-tags"
						element={
							<ProtectedRoute>
								<FollowedTags />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/thanks-history"
						element={
							<ProtectedRoute>
								<ThanksHistory />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/received-thanks"
						element={
							<ProtectedRoute>
								<ReceivedThanks />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/user-profile"
						element={
							<ProtectedRoute>
								<UserProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/edit-profile"
						element={
							<ProtectedRoute>
								<ProfileEdit />
							</ProtectedRoute>
						}
					/>
					<Route path="/notification-card" element={<NotificationCard />} />
					<Route
						path="/thanks-leaderboard"
						element={
							<ProtectedRoute>
								<ThanksLeaderboard />
							</ProtectedRoute>
						}
					/>
					<Route path="/user-ranking" element={<UserRanking />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/send-reset-password" element={<SendResetPassword />} />
					<Route path="/reset-password" element={<ResetPasswordForm />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
