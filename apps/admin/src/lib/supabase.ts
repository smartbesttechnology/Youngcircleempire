import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://fkqhxpadlxlmzupqhpgv.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcWh4cGFkbHhsbXp1cHFocGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzA2NzYsImV4cCI6MjA2NTk0NjY3Nn0.90dYLtniDLWFnHN39G289eTHkx5VL862191wVpF0vUo"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
