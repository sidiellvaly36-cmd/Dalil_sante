import { useState } from 'react'

interface GeolocationCoords {
  latitude: number
  longitude: number
}

interface UseGeolocationResult {
  coords: GeolocationCoords | null
  isLocating: boolean
  error: string | null
  requestLocation: () => void
}

/**
 * يطلب موقع المستخدم الجغرافي الحقيقي عبر واجهة المتصفح (Geolocation API) عند
 * الطلب فقط (لا يُستدعى تلقائيًا) - الإحداثيات المُستلَمة حقيقية من الجهاز،
 * تُستخدم بعدها لحساب المسافة الحقيقية إلى كل Localisation قادمة من الـ Backend.
 */
export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function requestLocation() {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setIsLocating(false)
      },
      () => {
        setError("Impossible d'accéder à votre position. Vérifiez les autorisations de localisation.")
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return { coords, isLocating, error, requestLocation }
}