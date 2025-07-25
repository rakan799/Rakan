'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Users, Mail, Phone, Coffee } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1
  })
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.date || !formData.time || !formData.guests) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (!formData.email && !formData.phone) {
      toast.error('يرجى إدخال البريد الإلكتروني أو رقم الهاتف للتأكيد')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([{
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests.toString()),
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      setShowConfirmation(true)
      toast.success('تم إرسال طلب الحجز بنجاح!')
    } catch (error) {
      console.error('Error creating reservation:', error)
      toast.error('حدث خطأ في إرسال طلب الحجز')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 1
    })
    setShowConfirmation(false)
  }

  // Generate time options
  const timeOptions = []
  for (let hour = 8; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'م' : 'ص'}`
      timeOptions.push({ value: timeString, display: displayTime })
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (showConfirmation) {
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
                <h1 className="text-2xl font-bold">حجز طاولة</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-green-600 mb-4">تم إرسال طلب الحجز!</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                شكرًا لك على اختيار كافي فالهلا. تم استلام طلب حجزك وسيتم التواصل معك قريبًا للتأكيد.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الحجز:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-semibold">{new Date(formData.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الوقت:</span>
                    <span className="font-semibold">{timeOptions.find(t => t.value === formData.time)?.display}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عدد الأشخاص:</span>
                    <span className="font-semibold">{formData.guests} شخص</span>
                  </div>
                  {formData.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-semibold">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">رقم الهاتف:</span>
                      <span className="font-semibold">{formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={resetForm}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  حجز طاولة أخرى
                </button>
                <Link
                  href="/"
                  className="block w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold">حجز طاولة</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">احجز مكانك المفضل</h2>
            <p className="text-gray-700 leading-relaxed">
              استمتع بتجربة فريدة في كافي فالهلا. احجز طاولتك مسبقًا لضمان الحصول على أفضل الأماكن
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Calendar className="inline w-5 h-5 ml-1" />
                  التاريخ *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Clock className="inline w-5 h-5 ml-1" />
                  الوقت *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">اختر الوقت</option>
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.display}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Users className="inline w-5 h-5 ml-1" />
                  عدد الأشخاص *
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'شخص' : 'أشخاص'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Mail className="inline w-5 h-5 ml-1" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Phone className="inline w-5 h-5 ml-1" />
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="07xxxxxxxxx"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>ملاحظة:</strong> يرجى إدخال البريد الإلكتروني أو رقم الهاتف على الأقل للتأكيد.
                  ساعات العمل: السبت - الخميس (8:00 ص - 12:00 م)، الجمعة (2:00 م - 12:00 م)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال طلب الحجز'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">للاستفسار والحجز المباشر</h3>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div>
                <Phone className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="font-semibold">الهاتف</p>
                <p className="text-gray-600">[ضع الرقم هنا]</p>
              </div>
              <div>
                <Mail className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="font-semibold">البريد الإلكتروني</p>
                <p className="text-gray-600">info@safwancafe.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}