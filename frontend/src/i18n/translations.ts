export type Language = 'fr' | 'ar'

export const translations = {
  fr: {
    common: {
      save: 'Enregistrer', create: 'Creer', add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer',
      cancel: 'Annuler', search: 'Rechercher', loading: 'Chargement...', errorLoading: 'Erreur de chargement',
      noData: 'Aucune donnee disponible', active: 'Statut actif', close: 'Fermer', all: 'Tous',
    },
    language: { label: 'Langue', french: 'Francais', arabic: 'العربية' },
    navigation: {
      dashboard: 'Tableau de bord', users: 'Utilisateurs', administrators: 'Administrateurs',
      establishments: 'Etablissements de sante', locations: 'Localisations', services: 'Services medicaux',
      specialties: 'Specialites medicales', schedules: 'Horaires', emergency: "Numeros d'urgence",
      orientation: 'Orientation medicale', advice: 'Conseils de sante', home: 'Accueil', profile: 'Mon profil',
      logout: 'Se deconnecter', askQuestion: 'Poser une question', menu: 'Menu',
    },
    legacy: {
      'Chargement de la session...': 'Chargement de la session...',
      'Cette action est irreversible.': 'Cette action est irreversible.',
      'Cette action est irreversibile.': 'Cette action est irreversibile.',
      'Erreur de chargement': 'Erreur de chargement',
      'Aucun resultat trouve.': 'Aucun resultat trouve.',
      'Aucun service medical trouve.': 'Aucun service medical trouve.',
      'Aucun etablissement disponible': 'Aucun etablissement disponible',
      'Aucun etablissement trouve': 'Aucun etablissement trouve',
      'Aucune description disponible.': 'Aucune description disponible.',
      'Modifier': 'Modifier', 'Supprimer': 'Supprimer', 'Annuler': 'Annuler', 'Enregistrer': 'Enregistrer',
      'Creer': 'Creer', 'Ajouter': 'Ajouter', 'Rechercher...': 'Rechercher...',
    },
  },
  ar: {
    common: {
      save: 'حفظ', create: 'إنشاء', add: 'إضافة', edit: 'تعديل', delete: 'حذف', cancel: 'إلغاء',
      search: 'بحث', loading: 'جارٍ التحميل...', errorLoading: 'خطأ في التحميل',
      noData: 'لا توجد بيانات', active: 'الحالة مفعلة', close: 'إغلاق', all: 'الكل',
    },
    language: { label: 'اللغة', french: 'Français', arabic: 'العربية' },
    navigation: {
      dashboard: 'لوحة التحكم', users: 'المستخدمون', administrators: 'المسؤولون',
      establishments: 'المؤسسات الصحية', locations: 'المواقع', services: 'الخدمات الطبية',
      specialties: 'التخصصات الطبية', schedules: 'المواعيد', emergency: 'أرقام الطوارئ',
      orientation: 'التوجيه الطبي', advice: 'النصائح الصحية', home: 'الرئيسية', profile: 'ملفي الشخصي',
      logout: 'تسجيل الخروج', askQuestion: 'اطرح سؤالاً', menu: 'القائمة',
    },
    legacy: {
      'Chargement de la session...': 'جارٍ تحميل الجلسة...',
      'Cette action est irreversible.': 'لا يمكن التراجع عن هذا الإجراء.',
      'Cette action est irreversibile.': 'لا يمكن التراجع عن هذا الإجراء.',
      'Erreur de chargement': 'خطأ في التحميل',
      'Aucun resultat trouve.': 'لم يتم العثور على أي نتيجة.',
      'Aucun service medical trouve.': 'لم يتم العثور على أي خدمة طبية.',
      'Aucun etablissement disponible': 'لا توجد مؤسسة صحية متاحة.',
      'Aucun etablissement trouve': 'لم يتم العثور على أي مؤسسة.',
      'Aucune description disponible.': 'لا يوجد وصف متاح.',
      'Modifier': 'تعديل', 'Supprimer': 'حذف', 'Annuler': 'إلغاء', 'Enregistrer': 'حفظ',
      'Creer': 'إنشاء', 'Ajouter': 'إضافة', 'Rechercher...': 'بحث...',
    },
  },
} as const

export type TranslationKey = string
