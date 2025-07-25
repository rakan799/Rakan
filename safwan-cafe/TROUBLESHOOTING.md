# 🔧 دليل إصلاح الأخطاء - كافي فالهلا

## أشهر الأخطاء وحلولها

### 1. خطأ: "Supabase connection failed" أو "Database error"

**السبب**: مشكلة في الاتصال بقاعدة البيانات

**الحل**:
```bash
# تأكد من أن ملف .env.local موجود ويحتوي على:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# استبدل القيم بالقيم الحقيقية من Supabase Dashboard > Settings > API
```

### 2. خطأ: "Build failed" أو "Compilation error"

**الحل**:
```bash
# امسح cache وأعد التثبيت
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### 3. خطأ: "Module not found" أو "Cannot resolve module"

**الحل**:
```bash
# تأكد من تثبيت جميع التبعيات
npm install @supabase/supabase-js lucide-react react-hot-toast
```

### 4. خطأ: "Invalid hook call" أو "React hooks error"

**السبب**: استخدام hooks خارج مكونات React

**الحل**: تأكد من أن جميع الملفات التي تستخدم hooks تبدأ بـ `'use client'`

### 5. خطأ: "Hydration mismatch" أو "Text content did not match"

**الحل**:
```tsx
// أضف هذا الكود في بداية المكون المتأثر
import { useState, useEffect } from 'react'

const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return null // أو مكون loading
}
```

### 6. خطأ: "Environment variables not defined"

**الحل**:
```bash
# تأكد من وجود ملف .env.local في جذر المشروع
# وأن المتغيرات تبدأ بـ NEXT_PUBLIC_
```

### 7. خطأ: "CORS error" أو "Network error"

**الحل**:
```bash
# في Supabase Dashboard:
# 1. اذهب إلى Authentication > Settings
# 2. أضف domain الموقع في Site URL
# 3. أضف domain في Additional URLs
```

### 8. خطأ: "Table does not exist" أو "SQL error"

**الحل**:
```sql
-- تأكد من تنفيذ ملف supabase-setup.sql في Supabase SQL Editor
-- أو نفذ هذه الاستعلامات:

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    emoji VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ... باقي الجداول
```

### 9. خطأ: "Permission denied" أو "RLS policy"

**الحل**:
```sql
-- في Supabase SQL Editor، نفذ:
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on menu_items" ON menu_items FOR ALL USING (true);

-- كرر للجداول الأخرى
```

### 10. خطأ: "Cannot access before initialization"

**الحل**:
```tsx
// تأكد من أن Supabase client يتم إنشاؤه بشكل صحيح
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🛠️ أدوات التشخيص

### فحص البناء:
```bash
npm run build
```

### فحص ESLint:
```bash
npm run lint
```

### فحص TypeScript:
```bash
npx tsc --noEmit
```

### تشغيل محلي:
```bash
npm run dev
```

## 📞 إذا استمر الخطأ

1. **تأكد من إصدارات Node.js**:
   ```bash
   node --version  # يجب أن يكون 18+
   npm --version
   ```

2. **امسح جميع الملفات المؤقتة**:
   ```bash
   rm -rf .next
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **تحقق من logs المفصلة**:
   ```bash
   npm run dev --verbose
   ```

4. **تحقق من Supabase Dashboard**:
   - تأكد من أن المشروع يعمل
   - تحقق من الجداول والبيانات
   - راجع logs الأخطاء

## 🔍 تشخيص سريع

```bash
# اختبار سريع للتأكد من سلامة المشروع
echo "Testing project..."
npm run build && echo "✅ Build successful" || echo "❌ Build failed"
npm run lint && echo "✅ Lint passed" || echo "❌ Lint failed"
npx tsc --noEmit && echo "✅ TypeScript passed" || echo "❌ TypeScript failed"
```

---

**إذا كان لديك خطأ محدد، يرجى نسخ رسالة الخطأ كاملة وسأساعدك في إصلاحه!** 🔧