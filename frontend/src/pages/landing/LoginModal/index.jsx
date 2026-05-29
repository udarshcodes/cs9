import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { authLogin } from './service'

function LoginModal({ isOpen, onClose, onLogin }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetState = () => {
    setError('')
    setIsForgotPassword(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await authLogin(userId, password)
      onLogin(data.user)
      handleClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid user ID or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = (event) => {
    event.preventDefault()
    setError(`A password reset link has been sent to ${userId || 'your email'}.`)
    setIsForgotPassword(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isForgotPassword ? 'Reset Password' : 'Login'}>
      {isForgotPassword ? (
        <>
          <h2 className="mb-4 text-center font-display text-[32px] font-bold leading-tight text-black">
            Reset Password
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-center text-[13px] leading-6 text-[#6b7280]">
            Enter your user ID or email address and we will send password reset instructions.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
            <label className="sr-only" htmlFor="reset-user-id">
              User ID
            </label>
            <input
              autoComplete="username"
              className="h-14 w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] outline-none shadow-sm transition placeholder:text-[#9da1a1] focus:border-black focus:ring-1 focus:ring-black"
              id="reset-user-id"
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter your user ID"
              required
              type="email"
              value={userId}
            />

            <button
              className="mt-2 min-h-14 rounded-lg bg-[#242633] px-5 text-[14px] font-medium text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#f3f4f5]"
              type="submit"
            >
              Send Reset Link
            </button>

            <button
              className="text-center text-[12px] font-medium text-[#6b7280] transition hover:text-black"
              onClick={() => {
                setError('')
                setIsForgotPassword(false)
              }}
              type="button"
            >
              Back to Login
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="mb-8 text-center font-display text-[32px] font-bold leading-tight text-black">
            Login
          </h2>

          {error && (
            <p className="mb-4 rounded-lg border border-[#f3c6c6] bg-[#fff5f5] px-4 py-3 text-center text-[14px] leading-5 text-[#ba1a1a]">
              {error}
            </p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <label className="sr-only" htmlFor="login-user-id">
              User ID
            </label>
            <input
              autoComplete="username"
              className="h-14 w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] outline-none shadow-sm transition placeholder:text-[#9da1a1] focus:border-black focus:ring-1 focus:ring-black"
              id="login-user-id"
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter your user ID"
              required
              type="email"
              value={userId}
            />

            <label className="sr-only" htmlFor="login-password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="h-14 w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] outline-none shadow-sm transition placeholder:text-[#9da1a1] focus:border-black focus:ring-1 focus:ring-black"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />

            <button
              className="self-end text-[12px] font-medium text-[#6b7280] transition hover:text-black"
              onClick={() => {
                setError('')
                setIsForgotPassword(true)
              }}
              type="button"
            >
              Forgot Password?
            </button>

            <button
              className="min-h-14 rounded-lg bg-[#242633] px-5 text-[14px] font-medium text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#f3f4f5] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </>
      )}
    </Modal>
  )
}

export default LoginModal
