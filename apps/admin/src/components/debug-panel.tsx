import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { supabase } from '../lib/supabase'
import {
  Bug,
  X,
  Trash2,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  Database,
  CheckCircle
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: Date
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  data?: any
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private listeners: ((logs: LogEntry[]) => void)[] = []

  log(level: LogEntry['level'], message: string, data?: any, stack?: string) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      data,
      stack
    }

    this.logs.unshift(entry)
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100)
    }

    this.notifyListeners()
    
    // Also log to console
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, data || '')
  }

  error(message: string, data?: any, stack?: string) {
    this.log('error', message, data, stack)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  getLogs() {
    return this.logs
  }

  clearLogs() {
    this.logs = []
    this.notifyListeners()
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]))
  }
}

export const logger = new Logger()

// Override console methods to capture logs
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

console.error = (...args) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')
  logger.error(message, args.length > 1 ? args.slice(1) : undefined)
  originalConsoleError.apply(console, args)
}

console.warn = (...args) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')
  logger.warn(message, args.length > 1 ? args.slice(1) : undefined)
  originalConsoleWarn.apply(console, args)
}

// Capture unhandled errors
window.addEventListener('error', (event) => {
  logger.error(
    `Unhandled Error: ${event.message}`,
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    },
    event.error?.stack
  )
})

window.addEventListener('unhandledrejection', (event) => {
  logger.error(
    `Unhandled Promise Rejection: ${event.reason}`,
    { reason: event.reason }
  )
})

interface DebugPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function DebugPanel({ isOpen, onClose }: DebugPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    const unsubscribe = logger.subscribe(setLogs)
    setLogs(logger.getLogs())
    return unsubscribe
  }, [])

  useEffect(() => {
    // Test Supabase connection when panel opens
    if (isOpen) {
      testSupabaseConnection()
    }
  }, [isOpen])

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('checking')
      logger.info('Testing Supabase connection...')

      // Test basic connection
      const { data, error } = await supabase
        .from('bookings')
        .select('count', { count: 'exact', head: true })

      if (error) {
        logger.error('Supabase connection test failed', { error: error.message, details: error })
        setConnectionStatus('error')
      } else {
        logger.info('Supabase connection test successful', { count: data })
        setConnectionStatus('connected')
      }
    } catch (error) {
      logger.error('Supabase connection test exception', { error })
      setConnectionStatus('error')
    }
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter)

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelBadge = (level: LogEntry['level']) => {
    const variants = {
      error: 'destructive',
      warn: 'warning',
      info: 'default',
      debug: 'secondary'
    } as const

    return (
      <Badge variant={variants[level] as any} className="text-xs">
        {level.toUpperCase()}
      </Badge>
    )
  }

  const exportLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.message}${
        log.data ? '\nData: ' + JSON.stringify(log.data, null, 2) : ''
      }${log.stack ? '\nStack: ' + log.stack : ''}`
    ).join('\n\n')

    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <CardTitle>Debug Panel</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>View error logs and debug information ({filteredLogs.length} entries)</span>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="text-xs">Supabase:</span>
              {connectionStatus === 'checking' && (
                <Badge variant="secondary">Checking...</Badge>
              )}
              {connectionStatus === 'connected' && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </CardDescription>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {(['all', 'error', 'warn', 'info', 'debug'] as const).map(level => (
                <Button
                  key={level}
                  variant={filter === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(level)}
                >
                  {level === 'all' ? 'All' : level.toUpperCase()}
                  {level !== 'all' && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {logs.filter(log => log.level === level).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={testSupabaseConnection}>
                <Database className="h-4 w-4 mr-2" />
                Test DB
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={logger.clearLogs}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs found
              </div>
            ) : (
              filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">{log.message}</p>
                    
                    {log.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          Additional Data
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    
                    {log.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          Stack Trace
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                          {log.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
