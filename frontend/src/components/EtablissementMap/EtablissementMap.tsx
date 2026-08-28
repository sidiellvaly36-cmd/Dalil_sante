import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Button, Typography } from 'antd'
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import styles from './EtablissementMap.module.scss'

const { Text } = Typography

// Correctif standard : Leaflet calcule le chemin de ses icônes par défaut via
// des URL relatives qui ne survivent pas au bundling Vite - on les réimporte
// explicitement en tant qu'assets.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
})

const userIcon = L.divIcon({
  className: styles.userMarker,
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// Marqueur distinct (vert Dalil Santé) pour l'établissement le plus proche -
// simple pin SVG en Data URI, aucun asset supplémentaire nécessaire.
const nearestPinSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="43" viewBox="0 0 27 43">' +
  '<path d="M13.5 0C6 0 0 6 0 13.5 0 23.6 13.5 43 13.5 43S27 23.6 27 13.5C27 6 21 0 13.5 0z" fill="#16a34a" stroke="#0b5c22" stroke-width="1"/>' +
  '<circle cx="13.5" cy="13.5" r="6" fill="#ffffff"/>' +
  '</svg>'

const nearestIcon = L.icon({
  iconUrl: `data:image/svg+xml,${encodeURIComponent(nearestPinSvg)}`,
  iconSize: [27, 43],
  iconAnchor: [13, 43],
  popupAnchor: [0, -38],
  shadowUrl: markerShadowUrl,
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

// react-leaflet ne tolère pas icon={undefined} sur <Marker> (setIcon plante) -
// on fournit toujours une icône explicite, y compris pour le cas "par défaut".
const defaultIcon = new L.Icon.Default()

export interface EtablissementMapMarker {
  id: number
  nom: string
  typeNom: string
  adresse: string
  ville: string
  quartier: string
  telephone: string
  latitude: number
  longitude: number
  distanceKm?: number
}

interface EtablissementMapProps {
  markers: EtablissementMapMarker[]
  userCoords?: { latitude: number; longitude: number } | null
  focusedId?: number | null
  nearestId?: number | null
  onMarkerSelect?: (id: number) => void
  heightClassName?: string
}

const NOUAKCHOTT_CENTER: [number, number] = [18.0858, -15.9785]

function googleMapsDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

/** Recentre/zoome la carte et ouvre le popup du marqueur ciblé quand focusedId change. */
function FlyToFocused({
  focusedId,
  markers,
  markerRefs,
}: {
  focusedId?: number | null
  markers: EtablissementMapMarker[]
  markerRefs: RefObject<Map<number, L.Marker>>
}) {
  const map = useMap()

  useEffect(() => {
    if (focusedId === null || focusedId === undefined) return
    const target = markers.find((m) => m.id === focusedId)
    if (!target) return

    map.flyTo([target.latitude, target.longitude], 15, { duration: 0.8 })
    const marker = markerRefs.current.get(focusedId)
    marker?.openPopup()
  }, [focusedId, markers, map, markerRefs])

  return null
}

/**
 * Carte des établissements de santé (Leaflet + tuiles OpenStreetMap, sans clé
 * d'API - Google Maps JS nécessite une clé d'API que nous n'avons pas et qu'il
 * serait dangereux d'inventer). Le bouton "Itinéraire" ouvre bien Google Maps
 * (simple URL publique, sans clé requise) pour la navigation réelle.
 * Chaque marqueur représente un établissement de santé réel (jamais un
 * "médecin" - aucune entité de ce type n'existe côté Backend).
 */
function EtablissementMap({
  markers,
  userCoords,
  focusedId,
  nearestId,
  onMarkerSelect,
  heightClassName,
}: EtablissementMapProps) {
  const markerRefs = useRef<Map<number, L.Marker>>(new Map())

  const center = useMemo<[number, number]>(() => {
    if (userCoords) return [userCoords.latitude, userCoords.longitude]
    if (markers.length > 0) return [markers[0].latitude, markers[0].longitude]
    return NOUAKCHOTT_CENTER
  }, [userCoords, markers])

  return (
    <div className={`${styles.mapWrapper} ${heightClassName ?? ''}`}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userCoords && (
          <Marker position={[userCoords.latitude, userCoords.longitude]} icon={userIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={marker.id === nearestId ? nearestIcon : defaultIcon}
            zIndexOffset={marker.id === nearestId ? 1000 : 0}
            ref={(instance) => {
              if (instance) markerRefs.current.set(marker.id, instance)
              else markerRefs.current.delete(marker.id)
            }}
            eventHandlers={{ click: () => onMarkerSelect?.(marker.id) }}
          >
            <Popup>
              <div className={styles.popupContent}>
                {marker.id === nearestId && <span className={styles.nearestBadge}>Le plus proche</span>}
                <Text strong>{marker.nom}</Text>
                <Text type="secondary" className={styles.popupLine}>
                  {marker.typeNom}
                </Text>
                <div className={styles.popupLine}>
                  <EnvironmentOutlined /> {marker.adresse ? `${marker.adresse}, ` : ''}
                  {marker.ville}
                  {marker.quartier ? `, ${marker.quartier}` : ''}
                </div>
                {marker.telephone && (
                  <div className={styles.popupLine}>
                    <PhoneOutlined /> {marker.telephone}
                  </div>
                )}
                {marker.distanceKm !== undefined && (
                  <div className={styles.popupLine}>À {marker.distanceKm.toFixed(1)} km de vous</div>
                )}
                <Button
                  type="primary"
                  size="small"
                  className={styles.popupButton}
                  href={googleMapsDirectionsUrl(marker.latitude, marker.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Itinéraire (Google Maps)
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        <FlyToFocused focusedId={focusedId} markers={markers} markerRefs={markerRefs} />
      </MapContainer>
    </div>
  )
}

export default EtablissementMap