import Link from 'next/link'
import { Coffee, Users, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" dir="rtl">
      {/* Header */}
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Coffee className="w-8 h-8 ml-3" />
            <h1 className="text-3xl font-bold">كافي فالهلا</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            مرحبًا بكم في كافي فالهلا
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            اكتشف عالم النكهات الهادئة في قلب المدينة. نقدم لكم تجربة فريدة تجمع بين القهوة المختصة، 
            المشروبات المنعشة، أجواء راقية، وأرقى أنواع الأراكيل. استرخِ، وذُق الفرق.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tables Page Button */}
          <Link href="/tables" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Users className="w-10 h-10 text-amber-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">صفحة الطاولات</h3>
              <p className="text-gray-600">
                إدارة الطاولات والطلبات، عرض القوائم وإجراء الطلبات المختلفة
              </p>
            </div>
          </Link>

          {/* Admin Page Button */}
          <Link href="/admin" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                <Settings className="w-10 h-10 text-red-800" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">صفحة الإدارة</h3>
              <p className="text-gray-600">
                إدارة القوائم والأسعار، عرض الإحصائيات والناتج اليومي
              </p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-amber-900 mb-8">خدماتنا</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h4 className="font-bold text-lg mb-2">مشروبات ساخنة</h4>
              <p className="text-gray-600">قهوة عربية، إسبريسو، لاتيه، وشاي أعشاب</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🧊</div>
              <h4 className="font-bold text-lg mb-2">مشروبات باردة</h4>
              <p className="text-gray-600">آيس لاتيه، فرابتشينو، موهيتو، وعصائر طبيعية</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h4 className="font-bold text-lg mb-2">أراكيل فاخرة</h4>
              <p className="text-gray-600">أفضل أنواع التبغ مع فحم طبيعي</p>
            </div>
          </div>
        </div>

        {/* Reservation Section */}
        <div className="mt-12 text-center">
          <Link href="/reservation" className="inline-block bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-700 transition-colors">
            احجز طاولتك الآن
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <p className="mb-2">📍 العنوان: [ضع العنوان هنا]</p>
              <p className="mb-2">📞 الهاتف: [ضع الرقم هنا]</p>
              <p>📧 البريد: info@safwancafe.com</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">ساعات العمل</h4>
              <p className="mb-2">السبت - الخميس: 8:00 ص - 12:00 م</p>
              <p>الجمعة: 2:00 م - 12:00 م</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">تابعنا</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-amber-300">Instagram</a>
                <a href="#" className="hover:text-amber-300">Facebook</a>
                <a href="#" className="hover:text-amber-300">TikTok</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-amber-800">
            <p>&copy; 2024 كافي فالهلا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
