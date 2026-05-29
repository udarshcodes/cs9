import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function ProtectedRoute({ requiredRole, children }) {
  const user = useAuthStore((state) => state.user)

  if (!user) return <Navigate to="/" replace />

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

export default ProtectedRoute
