/**
 * أنواع Orientation كما تُرجعها الـ DTOs الفعلية في الـ Backend
 * (dto/OrientationQuestionResponse.java, OrientationOptionResponse.java,
 * OrientationResultResponse.java, OrientationRuleResponse.java) - وليس
 * الـ Entities الخام. كل العلاقات المتداخلة (question/option/result/utilisateur
 * الكاملة) استُبدلت عمدًا بمعرّفات مسطّحة (questionId/optionId/resultId) لتفادي
 * أي recursion، ولا يوجد حقل utilisateur على الإطلاق في OrientationResultResponse.
 */

/** كيان "OrientationQuestion" */
export interface OrientationQuestion {
  id: number
  questionText: string
  questionOrder: number
  active: boolean
}

/** جسم الطلب لإنشاء/تعديل سؤال (POST/PUT /api/orientation/questions) */
export interface OrientationQuestionPayload {
  questionText: string
  questionOrder: number
  active: boolean
}

/** كيان "OrientationOption" - questionId مسطّح، questionId يُمرَّر في الـ URL عند الإنشاء */
export interface OrientationOption {
  id: number
  optionText: string
  optionOrder: number
  active: boolean
  questionId: number
}

/** جسم الطلب لإنشاء/تعديل خيار - questionId يُمرَّر في الـ URL عند الإنشاء فقط */
export interface OrientationOptionPayload {
  optionText: string
  optionOrder: number
  active: boolean
}

/** كيان "OrientationResult" - لا يحتوي أي حقل utilisateur (مُستبعَد عمدًا من DTO الـ Backend) */
export interface OrientationResult {
  id: number
  title: string
  description: string
  urgencyLevel: string
  recommendedSpecialty: string | null
  recommendedEstablishmentType: string | null
  active: boolean
}

/** جسم الطلب لإنشاء/تعديل نتيجة توجيه (POST/PUT /api/orientation/results) */
export interface OrientationResultPayload {
  title: string
  description: string
  urgencyLevel: string
  recommendedSpecialty: string | null
  recommendedEstablishmentType: string | null
  active: boolean
}

/** كيان "OrientationRule" - optionId و resultId مسطّحان */
export interface OrientationRule {
  id: number
  priority: number
  active: boolean
  optionId: number
  resultId: number
}

/** جسم الطلب لإنشاء/تعديل قاعدة - optionId و resultId يُمرَّران كـ Query Params (POST فقط) */
export interface OrientationRulePayload {
  priority: number
  active: boolean
}
