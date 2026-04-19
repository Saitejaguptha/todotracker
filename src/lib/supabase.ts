import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://scjobjkrjvqkxihmkudh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjam9iamtyanZxa3hpaG1rdWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzQ5NzAsImV4cCI6MjA4ODAxMDk3MH0.1rvxCWHrmF8gtrS7yzG1d8JILhQJnj9Ct9RUfPvyJ1g'
export const supabase = createClient(supabaseUrl, supabaseKey)