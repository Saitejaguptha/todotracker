import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SlackLayout from './components/layout/SlackLayout';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading components
const TaskForm = lazy(() => import('./components/features/TaskForm'));
const AllTasks = lazy(() => import('./pages/AllTasks'));
const EditTask = lazy(() => import('./pages/EditTask'));
const PendingTasks = lazy(() => import('./pages/PendingTasks'));
const CompletedTasks = lazy(() => import('./pages/CompletedTasks'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Logout = lazy(() => import('./pages/Logout'));
const Login = lazy(() => import('./pages/Login'));
const RecentActivity = lazy(() => import('./pages/RecentActivity'));
const Signup = lazy(() => import('./pages/Signup'));
const DeleteTask = lazy(() => import('./pages/DeleteTask'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-indigo-50/30 backdrop-blur-sm fixed inset-0 z-[9999]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-900 font-bold animate-pulse">Loading experience...</p>
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
