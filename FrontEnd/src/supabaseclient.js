import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbqkrihvwaurorcdagiw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicWtyaWh2d2F1cm9yY2RhZ2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NzQ2ODUsImV4cCI6MjA0NTU1MDY4NX0.YKPc7TvBowLYKWVohA_5dsl9IfFMz7qr1fo4f7V3cY8'
export const supabase = createClient(supabaseUrl, supabaseKey)
