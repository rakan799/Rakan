# كافي فالهلا - نظام إدارة المقهى

موقع إلكتروني شامل لإدارة مقهى فالهلا مع نظام الطاولات والطلبات والحجوزات.

## الميزات

### 🏠 الصفحة الرئيسية
- ترحيب بالعملاء مع وصف المقهى
- روابط للصفحات المختلفة
- معلومات التواصل والموقع
- تصميم عربي أنيق ومتجاوب

### 🍽️ صفحة الطاولات
- عرض 50 طاولة مع حالة كل طاولة
- إدارة الطلبات لكل طاولة
- قائمة المشروبات الساخنة والباردة والأراكيل
- أزرار: اطلب الآن، دفع، مسح الطلب (برمز سري)
- حفظ البيانات في قاعدة البيانات

### 🛠️ صفحة الإدارة
- دخول محمي برمز سري (Safwan123@@@)
- إدارة القوائم والأسعار
- إضافة/تعديل/حذف عناصر القائمة
- إحصائيات مباشرة:
  - الناتج اليومي
  - عدد الطلبات
  - الطاولات النشطة
  - عناصر القائمة

### 📅 نظام الحجز
- نموذج حجز الطاولات
- اختيار التاريخ والوقت وعدد الأشخاص
- التواصل عبر البريد أو الهاتف
- رسالة تأكيد تلقائية

## التقنيات المستخدمة

- **Frontend**: Next.js 14 مع TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **التوجيه**: Next.js App Router

## إعداد المشروع

### 1. متطلبات النظام
```bash
Node.js 18+ 
npm أو yarn
```

### 2. تثبيت المشروع
```bash
# استنساخ المشروع
git clone <repository-url>
cd safwan-cafe

# تثبيت التبعيات
npm install
```

### 3. إعداد قاعدة البيانات (Supabase)

1. انتقل إلى [Supabase](https://supabase.com)
2. أنشئ مشروع جديد باسم "Safwan Cafe"
3. في SQL Editor، انسخ والصق محتويات ملف `supabase-setup.sql`
4. نفذ الاستعلام لإنشاء الجداول

### 4. إعداد متغيرات البيئة

أنشئ ملف `.env.local` وأضف:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

يمكنك العثور على هذه القيم في:
- Supabase Dashboard > Settings > API

### 5. تشغيل المشروع

```bash
# تشغيل الخادم المحلي
npm run dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

## كلمات المرور والأرقام السرية

- **صفحة الإدارة**: `Safwan123@@@`
- **مسح الطلبات**: `@@@`

## هيكل المشروع

```
safwan-cafe/
├── src/
│   ├── app/
│   │   ├── page.tsx              # الصفحة الرئيسية
│   │   ├── tables/
│   │   │   └── page.tsx          # صفحة الطاولات
│   │   ├── admin/
│   │   │   └── page.tsx          # صفحة الإدارة
│   │   └── reservation/
│   │       └── page.tsx          # صفحة الحجز
│   └── lib/
│       └── supabase.ts           # إعداد Supabase
├── supabase-setup.sql            # إعداد قاعدة البيانات
└── README.md
```

## الاستخدام

### للعملاء:
1. زيارة الصفحة الرئيسية
2. حجز طاولة من صفحة الحجز
3. الاستمتاع بالخدمة

### للموظفين:
1. استخدام صفحة الطاولات لإدارة الطلبات
2. اختيار الطاولة وإضافة الطلبات
3. استخدام أزرار الدفع أو مسح الطلب

### للإدارة:
1. الدخول لصفحة الإدارة بكلمة المرور
2. مراقبة الإحصائيات اليومية
3. إدارة القوائم والأسعار
4. إضافة أو تعديل عناصر القائمة

## قاعدة البيانات

### الجداول:
- **menu_items**: قائمة المشروبات والأراكيل
- **table_orders**: طلبات الطاولات
- **reservations**: حجوزات العملاء

### العلاقات:
- كل طلب مرتبط برقم طاولة
- كل عنصر في الطلب مرتبط بعنصر من القائمة
- الحجوزات مستقلة ومرتبطة بالتاريخ والوقت

## الأسعار

جميع الأسعار بالدينار العراقي:
- **المشروبات الساخنة**: 2,500 - 5,000 د.ع
- **المشروبات الباردة**: 4,000 - 7,000 د.ع  
- **الأراكيل**: 15,000 - 20,000 د.ع

## الدعم والصيانة

للدعم الفني أو التطوير:
- البريد الإلكتروني: info@safwancafe.com
- يمكن تخصيص الأسعار والقوائم من صفحة الإدارة
- النسخ الاحتياطي التلقائي عبر Supabase

## الترخيص

هذا المشروع مخصص لمقهى فالهلا - جميع الحقوق محفوظة © 2024
