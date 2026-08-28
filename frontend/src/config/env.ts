/**
 * إعدادات البيئة (Environment Configuration)
 * -------------------------------------------
 * نقطة مركزية وحيدة لقراءة متغيرات البيئة (.env) في المشروع.
 * لا تقم أبدًا بقراءة import.meta.env مباشرة في أي ملف آخر،
 * استورد القيم من هنا فقط لتسهيل الصيانة لاحقًا.
 */

export const env = {
  /** الرابط الأساسي لكل طلبات الـ API نحو الـ Backend (Spring Boot) */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  /** اسم التطبيق المعروض في الواجهة (العنوان، الشعار، إلخ) */
  appName: import.meta.env.VITE_APP_NAME,

  /** هل التطبيق يعمل في وضع التطوير؟ */
  isDev: import.meta.env.DEV,

  /** هل التطبيق يعمل في وضع الإنتاج؟ */
  isProd: import.meta.env.PROD,
} as const
