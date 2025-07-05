import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import { useTheme } from '../components/theme-provider'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'

export function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState('admin@ycempire.studio')
  const [password, setPassword] = useState('Jonah@180')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          toast.error('Signup failed: ' + error.message)
        } else {
          toast.success('Account created! Please check your email to verify your account.')
          setIsSignUp(false)
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error('Login failed: ' + error.message)
        } else {
          toast.success('Login successful!')
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <img
            className="mx-auto h-16 w-auto"
            src="https://i.postimg.cc/XYtQC54J/YCE-LOGO-ICON.png"
            alt="Young Circle Empire"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the Young Circle Empire admin dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create Admin Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Create your admin account to access the dashboard'
                : 'Enter your admin credentials to continue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ycempire.studio"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? (isSignUp ? 'Creating account...' : 'Signing in...')
                  : (isSignUp ? 'Create Account' : 'Sign in')
                }
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : 'Need to create an admin account? Sign up'
                  }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
