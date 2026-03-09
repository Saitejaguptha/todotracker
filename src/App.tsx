import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SlackLayout from './components/layout/SlackLayout';
import TaskForm from './components/features/TaskForm';
import AllTasks from './pages/AllTasks';
import EditTask from './pages/EditTask';
import PendingTasks from './pages/PendingTasks';
import CompletedTasks from './pages/CompletedTasks';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Login from './pages/Login';
import RecentActivity from './pages/RecentActivity';
import Signup from './pages/Signup';
import DeleteTask from './pages/DeleteTask';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Legacy Redirects */}
          <Route path="/create" element={<Navigate to="/app/create" replace />} />
          <Route path="/all" element={<Navigate to="/app/all" replace />} />
          <Route path="/pending" element={<Navigate to="/app/pending" replace />} />
          <Route path="/completed" element={<Navigate to="/app/completed" replace />} />
          <Route path="/activity" element={<Navigate to="/app/activity" replace />} />
          <Route path="/edit" element={<Navigate to="/app/edit" replace />} />
          <Route path="/delete" element={<Navigate to="/app/delete" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          <Route path="/logout" element={<Navigate to="/app/logout" replace />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <SlackLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/create" replace />} />
            <Route path="create" element={<TaskForm />} />
            <Route path="all" element={<AllTasks />} />
            <Route path="pending" element={<PendingTasks />} />
            <Route path="completed" element={<CompletedTasks />} />
            <Route path="activity" element={<RecentActivity />} />
            <Route path="edit" element={<EditTask />} />
            <Route path="delete" element={<DeleteTask />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="logout" element={<Logout />} />
          </Route>
          {/* Error Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
