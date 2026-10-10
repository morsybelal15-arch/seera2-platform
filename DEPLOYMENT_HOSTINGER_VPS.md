# دليل النشر الشامل على سيرفر Hostinger VPS مع الدومين وشهادة SSL
## موقع مركز سيرا الطبي لجراحة السمنة والتغذية العلاجية

تم تجهيز هذا الدليل بالكامل لمساعدتك خطوة بخطوة في رفع وتشغيل موقع **مركز سيرا (Cerrah)** على سيرفر **Hostinger VPS** (نظام Ubuntu 22.04 أو 24.04 LTS) مع ربط الدومين وتفعيل شهادة الأمان المجانية SSL وضمان استقرار مجسمات الـ 3D والماسنجر الداخلي.

---

### جدول محتويات الدليل:
1. [الخطوة 1: توجيه الدومين (DNS Records) إلى السيرفر](#1-توجيه-الدومين-dns-records)
2. [الخطوة 2: الدخول للسيرفر وتثبيت المتطلبات الأساسية (Node.js, Nginx, PM2, Git)](#2-تثبيت-المتطلبات-الأساسية-على-السيرفر)
3. [الخطوة 3: تثبيت قاعدة بيانات PostgreSQL (اختياري / أو استخدام كلاود)](#3-تثبيت-وقاعدة-بيانات-postgresql)
4. [الخطوة 4: سحب المشروع وتثبيت الحزم وبناء النسخة النهائية](#4-سحب-المشروع-وتثبيت-الحزم)
5. [الخطوة 5: تشغيل الموقع عبر PM2 بنظام التوزيع التلقائي (Cluster Mode)](#5-تشغيل-الموقع-عبر-pm2)
6. [الخطوة 6: إعداد Nginx Reverse Proxy مع تسريع مجسمات 3D](#6-إعداد-سيرفر-nginx-المعكوس)
7. [الخطوة 7: استخراج وتفعيل شهادة SSL المجانية (Certbot Let's Encrypt)](#7-تفعيل-شهادة-الأمان-ssl)
8. [الخطوة 8: أوامر الصيانة والتحديث التلقائي المستقبلي](#8-أوامر-الصيانة-والتحديث)

---

### 1. توجيه الدومين (DNS Records)
من لوحة تحكم Hostinger (أو موقع حجز الدومين مثل Cloudflare / Namecheap):
1. ادخل إلى **DNS Zone Management** الخاص بدومينك.
2. أضف / عدل السجلين التاليين بربطهما بعنوان الـ IP الخاص بسيرفر الـ VPS:
   - **نوع A:** 
     - الاسم: `@`
     - القيمة: `IP_الخاص_بالـ_VPS` (مثال: `185.190.140.25`)
     - TTL: `300` أو `Auto`
   - **نوع A أو CNAME:**
     - الاسم: `www`
     - القيمة: `IP_الخاص_بالـ_VPS` (أو CNAME إلى اسم الدومين الرئيسي)
3. انتظر بضع دقائق حتى ينتشر التوجيه.

---

### 2. تثبيت المتطلبات الأساسية على السيرفر
اتصل بالسيرفر عبر Terminal أو PuTTY:
```bash
ssh root@IP_الخاص_بالـ_VPS
```

قم بتحديث الحزم وتثبيت Node.js v20 LTS و Git و Nginx و PM2:
```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت أدوات المساعدة و Git
sudo apt install -y curl wget git ufw

# 3. تثبيت Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# التحقق من الإصدار
node -v   # يجب أن يظهر v20.x.x
npm -v

# 4. تثبيت مدير العمليات PM2 عالمياً
sudo npm install -g pm2

# 5. تثبيت Nginx و Certbot للـ SSL
sudo apt install -y nginx certbot python3-certbot-nginx

# 6. تفعيل الجدار الناري بالسيرفر لفتح منافذ الويب والـ SSH
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

### 3. تثبيت وقاعدة بيانات PostgreSQL
إذا كنت تستخدم قاعدة بيانات محلية على السيرفر:
```bash
sudo apt install -y postgresql postgresql-contrib

# الدخول إلى postgres وإنشاء القاعدة والمستخدم
sudo -u postgres psql
```
داخل موجه PostgreSQL:
```sql
CREATE DATABASE cerrah_db;
CREATE USER cerrah_user WITH ENCRYPTED PASSWORD 'StrongPasswordHere_2026';
GRANT ALL PRIVILEGES ON DATABASE cerrah_db TO cerrah_user;
\q
```

---

### 4. سحب المشروع وتثبيت الحزم
داخل مجلد الويب بالسيرفر:
```bash
# إنشاء مسار المشروع
mkdir -p /var/www/cerrah-website
cd /var/www/cerrah-website

# سحب الكود من GitHub أو رفعه عبر SCP / SFTP
git clone https://github.com/USERNAME/REPO_NAME.git .

# أو في حالة الرفع المباشر تأكد أنك بداخل مجلد المشروع
cd /var/www/cerrah-website

# تثبيت الحزم
npm install

# إنشاء ملف البيئة الإنتاجي
cp .env.production.example .env.production
nano .env.production
# (قم بتعديل كلمات السر وبيانات قاعدة البيانات و API Gemini ثم اضغط Ctrl+O ثم Enter ثم Ctrl+X للحفظ)

# بناء المشروع الإنتاجي (Production Build)
npm run build
```

---

### 5. تشغيل الموقع عبر PM2
المشروع مجهز مسبقاً بملف `ecosystem.config.js` لتشغيل Next.js بكامل قدرة المعالج وإعادة التشغيل تلقائياً إذا أعيد تشغيل السيرفر:

```bash
# تشغيل التطبيق عبر PM2
pm2 start ecosystem.config.js

# حفظ إعدادات التشغيل التلقائي مع إقلاع السيرفر
pm2 save
pm2 startup
# (انسخ الأمر الذي سيظهره لك في الشاشة وشغله إذا طلب ذلك)

# التحقق من حالة السيرفر
pm2 status
pm2 logs cerrah-website --lines 30
```

---

### 6. إعداد سيرفر Nginx المعكوس
تم تجهيز ملف إعداد Nginx في المستودع باسم `nginx.cerrah.conf`.
انسخه إلى مسار Nginx:
```bash
# نسخ الملف
sudo cp nginx.cerrah.conf /etc/nginx/sites-available/cerrah

# فتح الملف واستبدال your-domain.com باسم دومينك الفعلي
sudo nano /etc/nginx/sites-available/cerrah
```
*(استبدل كل ظهور لـ `your-domain.com` باسم دومينك مثل `cerrah-clinic.com`)*

ثم فعّل الإعداد:
```bash
# تفعيل الموقع وحذف الموقع الافتراضي القديم
sudo ln -s /etc/nginx/sites-available/cerrah /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# فحص صحة إعدادات Nginx
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

---

### 7. تفعيل شهادة الأمان SSL
بضغطة واحدة من خلال Certbot:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
- أدخل بريدك الإلكتروني للطوارئ.
- وافق على الشروط بكتابة `Y`.
- سيقوم Certbot تلقائياً بتركيب الشهادة وتجديدها ذاتياً كل 90 يوماً.

---

### 8. أوامر الصيانة والتحديث
عندما تقوم بعمل تحديثات وتعديلات مستقبلية، فقط ادخل السيرفر ونفذ:
```bash
cd /var/www/cerrah-website
git pull
npm install
npm run build
pm2 reload cerrah-website --update-env
```

---

### المميزات المفعلة في هذه النسخة الإنتاجية:
1. **تصفير البيانات التجريبية:** مسح كافة المرضى والمحادثات والتقييمات الوهمية لتصبح المنظومة نظيفة وجاهزة للمرضى الحقيقيين.
2. **سكيوريتي الأدوار والتحقق:** 
   - حماية مسارات الطبيب `/doctor` ومسارات الاستقبال `/staff` من أي وصول غير مصرح.
   - منع المستخدمين العاديين من ترفيع صلاحياتهم إلى طبيب.
   - الحساب الطبي الوحيد المعتمد هو: `morsybelal15@gmail.com` (د. بلال مرسي).
3. **تسريع مجسمات 3D:** تخزين مؤقت (Cache-Control 30 Days) لملفات `.glb` عبر Nginx لمنع إعادة تحميل المجسمات وتسريع استجابة الصفحة.
4. **دعم الـ WebSockets:** جاهزية Nginx لتمرير اتصالات الماسنجر الداخلي والشات فوراً بدون تقطيع.
