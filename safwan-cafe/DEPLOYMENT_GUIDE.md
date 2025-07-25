# 🚀 دليل نشر موقع كافي فالهلا

## طرق النشر المتاحة

### 1. النشر على Vercel (مجاني - الأفضل) ⭐

#### الخطوة 1: إنشاء حساب Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط "Sign Up" 
3. سجل باستخدام GitHub أو Google أو البريد الإلكتروني

#### الخطوة 2: النشر من المتصفح (الطريقة السهلة)

**أ. رفع المشروع إلى GitHub:**
1. اذهب إلى [github.com](https://github.com)
2. أنشئ repository جديد باسم "safwan-cafe"
3. ارفع ملفات المشروع

**ب. ربط مع Vercel:**
1. في Vercel Dashboard، اضغط "New Project"
2. اختر "Import Git Repository"
3. اختر مشروع "safwan-cafe"
4. أضف متغيرات البيئة:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL مشروع Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: المفتاح العام من Supabase
5. اضغط "Deploy"

#### الخطوة 3: النشر من Command Line
```bash
# تسجيل الدخول
vercel login

# النشر
vercel --prod

# اتبع التعليمات على الشاشة
```

---

### 2. النشر على Netlify (مجاني)

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول جديد

#### الخطوة 2: النشر
1. اضغط "New site from Git"
2. اختر GitHub وربط المشروع
3. إعدادات البناء:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. أضف متغيرات البيئة في Site Settings > Environment Variables

---

### 3. النشر على Railway (مجاني)

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [railway.app](https://railway.app)
2. سجل باستخدام GitHub

#### الخطوة 2: النشر
1. اضغط "New Project"
2. اختر "Deploy from GitHub repo"
3. اختر مشروع safwan-cafe
4. أضف متغيرات البيئة في Variables tab

---

## 🔧 إعداد متغيرات البيئة للنشر

**يجب إضافة هذه المتغيرات في منصة النشر:**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### كيفية الحصول على القيم:
1. اذهب إلى مشروع Supabase
2. Settings > API
3. انسخ Project URL و anon public key

---

## 📋 قائمة التحقق قبل النشر

- ✅ تم إعداد قاعدة البيانات Supabase
- ✅ تم تنفيذ ملف `supabase-setup.sql`
- ✅ تم اختبار الموقع محلياً
- ✅ تم إعداد متغيرات البيئة
- ✅ تم رفع الكود إلى GitHub

---

## 🌐 بعد النشر

### 1. اختبار الموقع المنشور
- اختبر جميع الصفحات
- تأكد من عمل قاعدة البيانات
- اختبر أزرار الطلبات والدفع

### 2. إعداد النطاق المخصص (اختياري)
- في Vercel: Settings > Domains
- أضف النطاق المخصص (مثل: safwancafe.com)

### 3. مراقبة الأداء
- تحقق من سرعة الموقع
- راقب الأخطاء في Dashboard

---

## 🛠️ تحديث الموقع بعد النشر

### التحديث التلقائي (GitHub + Vercel):
1. قم بتعديل الكود محلياً
2. ارفع التغييرات إلى GitHub
3. سيتم التحديث تلقائياً في Vercel

### التحديث اليدوي:
```bash
vercel --prod
```

---

## 🔗 روابط مفيدة

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

---

## ⚠️ مشاكل شائعة وحلولها

### المشكلة: "Build failed"
**الحل**: 
- تأكد من أن `npm run build` يعمل محلياً
- تحقق من متغيرات البيئة

### المشكلة: "Database connection failed"
**الحل**:
- تأكد من صحة Supabase URL و API Key
- تأكد من تنفيذ ملف SQL

### المشكلة: "404 Not Found"
**الحل**:
- تأكد من رفع جميع الملفات
- تحقق من إعدادات النشر

---

## 📞 للدعم

إذا واجهت مشاكل في النشر:
1. تأكد من اتباع الخطوات بالترتيب
2. راجع logs النشر للأخطاء
3. تأكد من عمل الموقع محلياً أولاً

---

**🎉 بعد النشر الناجح، سيكون موقع كافي فالهلا متاحاً على الإنترنت 24/7!**