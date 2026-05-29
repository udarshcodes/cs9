import Landing from '../pages/landing'
import AdminHome from '../pages/admin'
import UserHome from '../pages/user'
import ProtectedRoute from './ProtectedRoute'

export const routes = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminHome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/*',
    element: (
      <ProtectedRoute>
        <UserHome />
      </ProtectedRoute>
    ),
  },
]
