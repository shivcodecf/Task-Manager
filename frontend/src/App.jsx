import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './ui/Login';
import Signup from './ui/Signup';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import RootLayout from './ui/RootLayout';
import NotFound from './ui/NotFound';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />, 
      children: [
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Signup /> },
        {
          path: 'manager',
          element: (
            <ProtectedRoute allowedRoles={['manager']}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: 'user',
          element: (
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path:"*",
      element:<NotFound/>
    }
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
