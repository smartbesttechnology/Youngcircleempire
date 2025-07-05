import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CheckCircle, XCircle, Database, Loader2 } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  data?: any
}

export function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: TestResult['status'], message: string, data?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.data = data
        return [...prev]
      } else {
        return [...prev, { name, status, message, data }]
      }
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setTests([])

    // Test 1: Basic Supabase connection
    updateTest('Connection', 'pending', 'Testing basic connection...')
    try {
      const { data, error } = await supabase.from('bookings').select('count', { count: 'exact', head: true })
      if (error) {
        updateTest('Connection', 'error', `Connection failed: ${error.message}`, error)
      } else {
        updateTest('Connection', 'success', 'Connection successful', data)
      }
    } catch (error: any) {
      updateTest('Connection', 'error', `Connection exception: ${error.message}`, error)
    }

    // Test 2: Check bookings table
    updateTest('Bookings Table', 'pending', 'Checking bookings table...')
    try {
      const { data, error } = await supabase.from('bookings').select('*').limit(5)
      if (error) {
        updateTest('Bookings Table', 'error', `Bookings query failed: ${error.message}`, error)
      } else {
        updateTest('Bookings Table', 'success', `Found ${data?.length || 0} bookings`, data)
      }
    } catch (error: any) {
      updateTest('Bookings Table', 'error', `Bookings exception: ${error.message}`, error)
    }

    // Test 3: Check equipment_rentals table
    updateTest('Rentals Table', 'pending', 'Checking equipment_rentals table...')
    try {
      const { data, error } = await supabase.from('equipment_rentals').select('*').limit(5)
      if (error) {
        updateTest('Rentals Table', 'error', `Rentals query failed: ${error.message}`, error)
      } else {
        updateTest('Rentals Table', 'success', `Found ${data?.length || 0} rentals`, data)
      }
    } catch (error: any) {
      updateTest('Rentals Table', 'error', `Rentals exception: ${error.message}`, error)
    }

    // Test 4: Check services table
    updateTest('Services Table', 'pending', 'Checking services table...')
    try {
      const { data, error } = await supabase.from('services').select('*').limit(5)
      if (error) {
        updateTest('Services Table', 'error', `Services query failed: ${error.message}`, error)
      } else {
        updateTest('Services Table', 'success', `Found ${data?.length || 0} services`, data)
      }
    } catch (error: any) {
      updateTest('Services Table', 'error', `Services exception: ${error.message}`, error)
    }

    // Test 5: Check equipment_items table
    updateTest('Equipment Table', 'pending', 'Checking equipment_items table...')
    try {
      const { data, error } = await supabase.from('equipment_items').select('*').limit(5)
      if (error) {
        updateTest('Equipment Table', 'error', `Equipment query failed: ${error.message}`, error)
      } else {
        updateTest('Equipment Table', 'success', `Found ${data?.length || 0} equipment items`, data)
      }
    } catch (error: any) {
      updateTest('Equipment Table', 'error', `Equipment exception: ${error.message}`, error)
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Running...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Database Connection Test</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Testing Supabase connection and database tables
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={runTests} disabled={isRunning}>
          <Database className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(test.status)}
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                </div>
                {getStatusBadge(test.status)}
              </div>
              <CardDescription>{test.message}</CardDescription>
            </CardHeader>
            {test.data && (
              <CardContent>
                <details className="bg-gray-50 dark:bg-gray-800 border rounded-md p-3">
                  <summary className="text-sm font-medium cursor-pointer">
                    View Data
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 overflow-auto max-h-64">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </details>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {tests.length === 0 && !isRunning && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Click "Run Tests" to start testing the database connection</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
