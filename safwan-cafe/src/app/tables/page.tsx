'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Coffee, ShoppingCart, CreditCard, Trash2, Plus, Minus } from 'lucide-react'
import { supabase, MenuItem, TableOrder, OrderItem } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

function TablesPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [tableOrders, setTableOrders] = useState<{[key: number]: TableOrder}>({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Load menu items and table orders on component mount
  useEffect(() => {
    loadMenuItems()
    loadTableOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
      
      if (error) throw error
      
      if (data) {
        setMenuItems(data)
      } else {
        // Initialize with default menu if empty
        await initializeDefaultMenu()
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
      // If table doesn't exist, create it with default data
      await initializeDefaultMenu()
    }
  }

  const initializeDefaultMenu = async () => {
    const defaultMenu: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>[] = [
      // Hot drinks
      { name: 'قهوة عربية', price: 3000, category: 'hot_drinks', description: 'نكهة أصيلة بطابع شرقي', emoji: '☕' },
      { name: 'إسبريسو مزدوج', price: 4000, category: 'hot_drinks', description: 'قوة ونكهة مركّزة', emoji: '☕' },
      { name: 'لاتيه بالفانيلا', price: 5000, category: 'hot_drinks', description: 'نعومة وحلاوة في فنجان', emoji: '☕' },
      { name: 'شاي أعشاب طبيعي', price: 2500, category: 'hot_drinks', description: 'صحة ودفء', emoji: '🍵' },
      
      // Cold drinks
      { name: 'آيس لاتيه كراميل', price: 6000, category: 'cold_drinks', description: 'نكهة منعشة', emoji: '🧊' },
      { name: 'فرابتشينو شوكولا', price: 7000, category: 'cold_drinks', description: 'لمحبي الحلا', emoji: '🍫' },
      { name: 'موهيتو كلاسيك', price: 5500, category: 'cold_drinks', description: 'نعناع ولمون', emoji: '🍃' },
      { name: 'عصير برتقال فريش', price: 4000, category: 'cold_drinks', description: 'طبيعي 100%', emoji: '🍊' },
      
      // Shisha
      { name: 'تفاح أحمر', price: 15000, category: 'shisha', description: 'نكهة كلاسيكية', emoji: '🍎' },
      { name: 'ليمون نعناع', price: 15000, category: 'shisha', description: 'منعش ومميز', emoji: '🍋' },
      { name: 'تين إنجليزي', price: 18000, category: 'shisha', description: 'نكهة فاخرة', emoji: '🫐' },
      { name: 'عنب مع نعناع', price: 16000, category: 'shisha', description: 'خليط رائع', emoji: '🍇' },
      { name: 'معسل خاص', price: 20000, category: 'shisha', description: 'خلطات مميزة', emoji: '🔥' }
    ]

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(defaultMenu)
        .select()
      
      if (error) throw error
      if (data) setMenuItems(data)
    } catch (error) {
      console.error('Error initializing menu:', error)
      // Fallback to local state if database fails
      setMenuItems(defaultMenu.map((item, index) => ({ ...item, id: index + 1 })))
    }
  }

  const loadTableOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('table_orders')
        .select('*')
        .eq('status', 'active')
      
      if (error) throw error
      
      if (data) {
        const ordersMap: {[key: number]: TableOrder} = {}
        data.forEach(order => {
          ordersMap[order.table_number] = order
        })
        setTableOrders(ordersMap)
      }
    } catch (error) {
      console.error('Error loading table orders:', error)
    }
  }

  const openTable = (tableNumber: number) => {
    setSelectedTable(tableNumber)
    const existingOrder = tableOrders[tableNumber]
    if (existingOrder) {
      setCurrentOrder(existingOrder.items)
    } else {
      setCurrentOrder([])
    }
  }

  const addToOrder = (menuItem: MenuItem) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(item => item.menu_item_id === menuItem.id)
      if (existingItem) {
        return prev.map(item => 
          item.menu_item_id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, {
          menu_item_id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          category: menuItem.category
        }]
      }
    })
  }

  const removeFromOrder = (menuItemId: number) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(item => item.menu_item_id === menuItemId)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.menu_item_id === menuItemId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      } else {
        return prev.filter(item => item.menu_item_id !== menuItemId)
      }
    })
  }

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const saveOrder = async () => {
    if (!selectedTable || currentOrder.length === 0) {
      toast.error('يرجى إضافة عناصر للطلب')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        table_number: selectedTable,
        items: currentOrder,
        total: calculateTotal(),
        status: 'active' as const,
        updated_at: new Date().toISOString()
      }

      const existingOrder = tableOrders[selectedTable]
      
      if (existingOrder) {
        // Update existing order
        const { error } = await supabase
          .from('table_orders')
          .update(orderData)
          .eq('id', existingOrder.id)
        
        if (error) throw error
      } else {
        // Create new order
        const { error } = await supabase
          .from('table_orders')
          .insert([{ ...orderData, created_at: new Date().toISOString() }])
          .select()
        
        if (error) throw error
      }

      await loadTableOrders()
      toast.success('تم حفظ الطلب بنجاح')
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error('حدث خطأ في حفظ الطلب')
    } finally {
      setLoading(false)
    }
  }

  const payOrder = async () => {
    if (!selectedTable || !tableOrders[selectedTable]) {
      toast.error('لا يوجد طلب للدفع')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('table_orders')
        .update({ status: 'paid' })
        .eq('id', tableOrders[selectedTable].id)
      
      if (error) throw error

      await loadTableOrders()
      setCurrentOrder([])
      setSelectedTable(null)
      toast.success('تم الدفع بنجاح وتصفير الطاولة')
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('حدث خطأ في عملية الدفع')
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async () => {
    if (deletePassword !== '@@@') {
      toast.error('رمز المسح غير صحيح')
      return
    }

    if (!selectedTable || !tableOrders[selectedTable]) {
      toast.error('لا يوجد طلب للمسح')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('table_orders')
        .delete()
        .eq('id', tableOrders[selectedTable].id)
      
      if (error) throw error

      await loadTableOrders()
      setCurrentOrder([])
      setSelectedTable(null)
      setShowDeleteModal(false)
      setDeletePassword('')
      toast.success('تم مسح الطلب بنجاح')
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('حدث خطأ في مسح الطلب')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" dir="rtl">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center hover:text-amber-200">
              <ArrowRight className="w-6 h-6 ml-2" />
              <span>العودة للرئيسية</span>
            </Link>
            <div className="flex items-center">
              <Coffee className="w-8 h-8 ml-3" />
              <h1 className="text-2xl font-bold">صفحة الطاولات</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!selectedTable ? (
          /* Tables Grid */
          <div>
            <h2 className="text-3xl font-bold text-center text-amber-900 mb-8">اختر الطاولة</h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {Array.from({ length: 50 }, (_, i) => i + 1).map(tableNumber => (
                <button
                  key={tableNumber}
                  onClick={() => openTable(tableNumber)}
                  className={`
                    aspect-square rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105
                    ${tableOrders[tableNumber] 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white text-gray-800 hover:bg-amber-100 shadow-md'
                    }
                  `}
                >
                  {tableNumber}
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded border"></div>
                  <span className="text-gray-700">طاولة فارغة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span className="text-gray-700">طاولة بها طلب</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Order Management */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Menu */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-900">القائمة</h2>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              {['hot_drinks', 'cold_drinks', 'shisha'].map(category => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    {getCategoryName(category)}
                  </h3>
                  <div className="space-y-3">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{item.emoji}</span>
                              <h4 className="font-semibold">{item.name}</h4>
                            </div>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            )}
                            <p className="text-amber-600 font-bold">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => addToOrder(item)}
                            className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Order */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                طلب الطاولة {selectedTable}
              </h2>

              {currentOrder.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا يوجد عناصر في الطلب</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {currentOrder.map(item => (
                    <div key={item.menu_item_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-amber-600">{formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromOrder(item.menu_item_id)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => addToOrder(menuItems.find(m => m.id === item.menu_item_id)!)}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>المجموع:</span>
                  <span className="text-amber-600">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={saveOrder}
                  disabled={loading || currentOrder.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الحفظ...' : 'اطلب الآن'}
                </button>

                {tableOrders[selectedTable] && (
                  <>
                    <button
                      onClick={payOrder}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      {loading ? 'جاري الدفع...' : 'دفع'}
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={loading}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      مسح الطلب
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">تأكيد مسح الطلب</h3>
            <p className="text-gray-700 mb-4">
              يرجى إدخال الرمز السري لمسح الطلب بشكل كامل:
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="أدخل الرمز السري"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center"
            />
            <div className="flex gap-3">
              <button
                onClick={deleteOrder}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري المسح...' : 'مسح'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
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

export default TablesPage;