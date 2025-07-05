import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './contexts/auth-context'
import { ProtectedRoute } from './components/protected-route'
import { LoginPage } from './pages/login'
import { DashboardLayout } from './components/layout/dashboard-layout'
import { DashboardPage } from './pages/dashboard'
import { TestPage } from './pages/test'
import { BookingsPage } from './pages/bookings'
import { RentalsPage } from './pages/rentals'
import { ServicesPage } from './pages/services'
import { LinksPage } from './pages/links'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/bookings" element={<BookingsPage />} />
                        <Route path="/rentals" element={<RentalsPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/links" element={<LinksPage />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
