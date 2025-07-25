'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Settings, Plus, Edit2, Trash2, BarChart3, DollarSign } from 'lucide-react'
import { supabase, MenuItem } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    totalItems: 0,
    activeTables: 0
  })

  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: 'hot_drinks' as 'hot_drinks' | 'cold_drinks' | 'shisha',
    description: '',
    emoji: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadMenuItems()
      loadStats()
    }
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = () => {
    if (password === 'Safwan123@@@') {
      setIsAuthenticated(true)
      setPassword('')
      toast.success('تم تسجيل الدخول بنجاح')
    } else {
      toast.error('كلمة المرور غير صحيحة')
    }
  }

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
      
      if (error) throw error
      if (data) setMenuItems(data)
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('حدث خطأ في تحميل القائمة')
    }
  }

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Get today's revenue and orders
      const { data: todayOrders, error: ordersError } = await supabase
        .from('table_orders')
        .select('total, created_at')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .eq('status', 'paid')
      
      if (ordersError) throw ordersError

      // Get active tables count
      const { data: activeTables, error: tablesError } = await supabase
        .from('table_orders')
        .select('table_number')
        .eq('status', 'active')
      
      if (tablesError) throw tablesError

      const todayRevenue = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0
      const todayOrdersCount = todayOrders?.length || 0
      const activeTablesCount = activeTables?.length || 0

      setStats({
        todayRevenue,
        todayOrders: todayOrdersCount,
        totalItems: menuItems.length,
        activeTables: activeTablesCount
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([newItem])
        .select()
      
      if (error) throw error
      
      await loadMenuItems()
      setShowAddModal(false)
      setNewItem({
        name: '',
        price: 0,
        category: 'hot_drinks',
        description: '',
        emoji: ''
      })
      toast.success('تم إضافة العنصر بنجاح')
    } catch (error) {
      console.error('Error adding menu item:', error)
      toast.error('حدث خطأ في إضافة العنصر')
    } finally {
      setLoading(false)
    }
  }

  const updateMenuItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: editingItem.name,
          price: editingItem.price,
          category: editingItem.category,
          description: editingItem.description,
          emoji: editingItem.emoji,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)
      
      if (error) throw error
      
      await loadMenuItems()
      setShowEditModal(false)
      setEditingItem(null)
      toast.success('تم تحديث العنصر بنجاح')
    } catch (error) {
      console.error('Error updating menu item:', error)
      toast.error('حدث خطأ في تحديث العنصر')
    } finally {
      setLoading(false)
    }
  }

  const deleteMenuItem = async () => {
    if (!itemToDelete) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemToDelete.id)
      
      if (error) throw error
      
      await loadMenuItems()
      setShowDeleteModal(false)
      setItemToDelete(null)
      toast.success('تم حذف العنصر بنجاح')
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('حدث خطأ في حذف العنصر')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'hot_drinks': return 'مشروبات ساخنة'
      case 'cold_drinks': return 'مشروبات باردة'
      case 'shisha': return 'أراكيل'
      default: return category
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} د.ع`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center" dir="rtl">
        <Toaster position="top-center" />
        
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">صفحة الإدارة</h1>
            <p className="text-gray-600">يرجى إدخال كلمة المرور للوصول</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="كلمة المرور"
              className="w-full p-3 border border-gray-300 rounded-lg text-center"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              دخول
            </button>
            <Link href="/" className="block text-center text-gray-600 hover:text-gray-800">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" dir="rtl">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:text-red-200">
              <ArrowRight className="w-6 h-6 ml-2" />
              <span>العودة للرئيسية</span>
            </Link>
            <div className="flex items-center">
              <Settings className="w-8 h-8 ml-3" />
              <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-red-200 hover:text-white"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الناتج اليومي</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.todayRevenue)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">طلبات اليوم</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todayOrders}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الطاولات النشطة</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeTables}</p>
              </div>
              <Settings className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">عناصر القائمة</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalItems}</p>
              </div>
              <Plus className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Menu Management */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">إدارة القائمة</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة عنصر جديد
            </button>
          </div>

          {['hot_drinks', 'cold_drinks', 'shisha'].map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {getCategoryName(category)}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.emoji}</span>
                          <h4 className="font-semibold">{item.name}</h4>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item)
                              setShowEditModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(item)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      )}
                      <p className="text-amber-600 font-bold">{formatPrice(item.price)}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة عنصر جديد</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="اسم العنصر"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
                placeholder="السعر (بالدينار العراقي)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value as 'hot_drinks' | 'cold_drinks' | 'shisha'})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="hot_drinks">مشروبات ساخنة</option>
                <option value="cold_drinks">مشروبات باردة</option>
                <option value="shisha">أراكيل</option>
              </select>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="الوصف (اختياري)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={newItem.emoji}
                onChange={(e) => setNewItem({...newItem, emoji: e.target.value})}
                placeholder="الرمز التعبيري (اختياري)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addMenuItem}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الإضافة...' : 'إضافة'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">تعديل العنصر</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                placeholder="اسم العنصر"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: parseInt(e.target.value) || 0})}
                placeholder="السعر (بالدينار العراقي)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value as 'hot_drinks' | 'cold_drinks' | 'shisha'})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="hot_drinks">مشروبات ساخنة</option>
                <option value="cold_drinks">مشروبات باردة</option>
                <option value="shisha">أراكيل</option>
              </select>
              <input
                type="text"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                placeholder="الوصف (اختياري)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={editingItem.emoji || ''}
                onChange={(e) => setEditingItem({...editingItem, emoji: e.target.value})}
                placeholder="الرمز التعبيري (اختياري)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={updateMenuItem}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري التحديث...' : 'تحديث'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingItem(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-700 mb-4">
              هل أنت متأكد من حذف &quot;{itemToDelete.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteMenuItem}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري الحذف...' : 'حذف'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setItemToDelete(null)
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}