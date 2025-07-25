import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface MenuItem {
  id: number
  name: string
  price: number
  category: 'hot_drinks' | 'cold_drinks' | 'shisha'
  description?: string
  emoji?: string
  created_at?: string
  updated_at?: string
}

export interface TableOrder {
  id: number
  table_number: number
  items: OrderItem[]
  total: number
  status: 'active' | 'paid' | 'cancelled'
  created_at: string
  updated_at?: string
}

export interface OrderItem {
  menu_item_id: number
  name: string
  price: number
  quantity: number
  category: string
}

export interface Reservation {
  id: number
  name: string
  email?: string
  phone?: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}