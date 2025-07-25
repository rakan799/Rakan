// ملف اختبار الاتصال بـ Supabase
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('🔍 اختبار الاتصال بـ Supabase...\n');

  // فحص متغيرات البيئة
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 متغيرات البيئة:');
  console.log('URL:', supabaseUrl ? '✅ موجود' : '❌ مفقود');
  console.log('API Key:', supabaseAnonKey ? '✅ موجود' : '❌ مفقود');
  console.log('');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ خطأ: متغيرات البيئة مفقودة!');
    console.log('');
    console.log('الحل:');
    console.log('1. تأكد من وجود ملف .env.local');
    console.log('2. أضف المتغيرات التالية:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('3. احصل على القيم من Supabase Dashboard > Settings > API');
    return;
  }

  try {
    // إنشاء client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ تم إنشاء Supabase client بنجاح');

    // اختبار الاتصال
    console.log('🔄 اختبار الاتصال...');
    const { data, error } = await supabase
      .from('menu_items')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ خطأ في الاتصال:', error.message);
      console.log('');
      console.log('الأسباب المحتملة:');
      console.log('1. لم يتم تنفيذ ملف supabase-setup.sql');
      console.log('2. مشكلة في صلاحيات قاعدة البيانات');
      console.log('3. خطأ في URL أو API Key');
    } else {
      console.log('✅ الاتصال بقاعدة البيانات ناجح!');
      console.log('📊 جدول menu_items موجود ويعمل');
    }

    // اختبار الجداول الأخرى
    console.log('🔄 اختبار الجداول الأخرى...');
    
    const tables = ['table_orders', 'reservations'];
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.log(`❌ جدول ${table}: ${tableError.message}`);
      } else {
        console.log(`✅ جدول ${table}: يعمل بشكل صحيح`);
      }
    }

    console.log('');
    console.log('🎉 اختبار الاتصال مكتمل!');
    
  } catch (err) {
    console.log('❌ خطأ عام:', err.message);
  }
}

testConnection();