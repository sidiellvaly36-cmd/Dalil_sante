import { QueryClient } from '@tanstack/react-query'

/**
 * نسخة وحيدة من QueryClient تُستخدم في كامل التطبيق.
 * الإعدادات هنا محافظة (Conservative) ومناسبة للوحات التحكم الإدارية:
 * - لا إعادة جلب تلقائية عند التركيز على النافذة (تفاديًا لإزعاج المستخدم).
 * - إعادة محاولة واحدة فقط عند فشل الطلب.
 * - staleTime معقول لتقليل عدد الطلبات المتكررة نحو الـ Backend.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // دقيقة واحدة
      gcTime: 5 * 60 * 1000, // 5 دقائق
    },
    mutations: {
      retry: 0,
    },
  },
})
