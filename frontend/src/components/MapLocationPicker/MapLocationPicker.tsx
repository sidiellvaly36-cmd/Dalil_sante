import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import styles from './MapLocationPicker.module.scss'

// Même correctif que EtablissementMap (composant indépendant, Vite ne résout
// pas les URL d'icônes par défaut de Leaflet sans cet import explicite).
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
})

const NOUAKCHOTT_CENTER: [number, number] = [18.0858, -15.9785]

interface MapLocationPickerProps {
  latitude: number | null
  longitude: number | null
  onPick: (lat: number, lng: number) => void
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/**
 * Sélecteur de position sur carte - composant UI générique et réutilisable
 * (Leaflet + OpenStreetMap, identique au moteur déjà utilisé par
 * EtablissementMap). Ne contient aucune logique métier "Localisation" : il se
 * contente de renvoyer un couple latitude/longitude via onPick lorsque l'ADMIN
 * clique sur la carte ou fait glisser le repère. C'est la page appelante
 * (Etablissements.tsx) qui décide quoi faire de ces coordonnées en utilisant
 * les hooks useCreateLocalisation/useUpdateLocalisation déjà existants.
 */
function MapLocationPicker({ latitude, longitude, onPick }: MapLocationPickerProps) {
  const hasPosition = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined
  const center: [number, number] = hasPosition ? [latitude, longitude] : NOUAKCHOTT_CENTER

  return (
    <div className={styles.wrapper}>
      <MapContainer center={center} zoom={hasPosition ? 15 : 12} scrollWheelZoom className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onPick={onPick} />

        {hasPosition && (
          <Marker
            position={[latitude, longitude]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target as L.Marker
                const { lat, lng } = marker.getLatLng()
                onPick(lat, lng)
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default MapLocationPicker