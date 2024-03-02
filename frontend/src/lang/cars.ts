import LocalizedStrings from 'react-localization'
import * as langHelper from '../common/langHelper'
import { strings as commonStrings } from '../lang/common'

const strings = new LocalizedStrings({
  fr: {
    NEW_CAR: 'Nouvelle voiture',
    DELETE_CAR: 'Êtes-vous sûr de vouloir supprimer cette voiture ?',
    CAR_CURRENCY: ` ${commonStrings.CURRENCY}/jour`,
    FUEL_POLICY: 'Politique carburant',
    DIESEL: 'Diesel',
    GASOLINE: 'Essence',
    DIESEL_SHORT: 'D',
    GASOLINE_SHORT: 'E',
    GEARBOX_MANUAL: 'Manuelle',
    GEARBOX_AUTOMATIC: 'Automatique',
    GEARBOX_MANUAL_SHORT: 'M',
    GEARBOX_AUTOMATIC_SHORT: 'A',
    FUEL_POLICY_LIKE_FOR_LIKE: 'Plein/Plein',
    FUEL_POLICY_FREE_TANK: 'Plein inclus',
    DIESEL_TOOLTIP: 'Cette voiture a un moteur diesel',
    GASOLINE_TOOLTIP: 'Cette voiture a un moteur essence',
    GEARBOX_MANUAL_TOOLTIP: 'Cette voiture a une transmission manuelle',
    GEARBOX_AUTOMATIC_TOOLTIP: 'Cette voiture a une transmission automatique',
    SEATS_TOOLTIP_1: 'Cette voiture a ',
    SEATS_TOOLTIP_2: 'sièges',
    DOORS_TOOLTIP_1: 'Cette voiture a ',
    DOORS_TOOLTIP_2: 'portes',
    AIRCON_TOOLTIP: 'Cette voiture a de la climatisation',
    FUEL_POLICY_LIKE_FOR_LIKE_TOOLTIP: 'Cette voiture est fournie avec du carburant dans le réservoir et doit être rendu avec la même quantité de carburant.',
    FUEL_POLICY_FREE_TANK_TOOLTIP: 'Le prix inclut un plein de carburant',
    MILEAGE: 'Kilométrage',
    MILEAGE_UNIT: 'KM/jour',
    UNLIMITED: 'Illimité',
    LIMITED: 'Limité',
    CANCELLATION: 'Annulation',
    CANCELLATION_TOOLTIP: 'La réservation peut être annulée avant la date de commencement de la location.',
    AMENDMENTS: 'Modifications',
    AMENDMENTS_TOOLTIP: 'La réservation peut être modifiée avant la date de commencement de la location.',
    THEFT_PROTECTION: 'Protection contre le vol',
    THEFT_PROTECTION_TOOLTIP: 'La location peut inclure une protection contre le vol.',
    COLLISION_DAMAGE_WAVER: 'Couverture en cas de collision',
    COLLISION_DAMAGE_WAVER_TOOLTIP: 'La location peut inclure une couverture en cas de collision.',
    FULL_INSURANCE: 'Assurance Tous Risques',
    FULL_INSURANCE_TOOLTIP: 'La location peut inclure une couverture en cas de collision, de dommages et vol du véhicule.',
    ADDITIONAL_DRIVER: 'Conducteur supplémentaire',
    INCLUDED: 'Inclus',
    UNAVAILABLE: 'Indisponible',
    CAR_AVAILABLE: 'Disponible à la location',
    CAR_AVAILABLE_TOOLTIP: 'Cette voiture est disponible pour la location.',
    CAR_UNAVAILABLE: 'Indisponible pour la location',
    CAR_UNAVAILABLE_TOOLTIP: "Cette voiture n'est pas disponible pour la location.",
    VIEW_CAR: 'Voir cette voiture',
    EMPTY_LIST: 'Pas de voitures.',
    BOOK: 'Réserver',
    PRICE_DAYS_PART_1: 'Prix pour',
    PRICE_DAYS_PART_2: 'jour',
    PRICE_PER_DAY: 'Prix par jour :',
    GEARBOX: 'Transmission',
    ENGINE: 'Moteur',
    DEPOSIT: 'Dépôt de garantie',
    LESS_THAN_2500: 'Moins de 2500 DH',
    LESS_THAN_5000: 'Moins de 5000 DH',
    LESS_THAN_7500: 'Moins de 7500 DH',
  },
  en: {
    NEW_CAR: 'New car',
    DELETE_CAR: 'Are you sure you want to delete this car?',
    CAR_CURRENCY: ` ${commonStrings.CURRENCY}/day`,
    FUEL_POLICY: 'Fuel policy',
    DIESEL: 'Diesel',
    GASOLINE: 'Gasoline',
    DIESEL_SHORT: 'D',
    GASOLINE_SHORT: 'G',
    GEARBOX_MANUAL: 'Manual',
    GEARBOX_AUTOMATIC: 'Automatic',
    GEARBOX_MANUAL_SHORT: 'M',
    GEARBOX_AUTOMATIC_SHORT: 'A',
    FUEL_POLICY_LIKE_FOR_LIKE: 'Like for Like',
    FUEL_POLICY_FREE_TANK: 'Free tank',
    DIESEL_TOOLTIP: 'This car has a diesel engine',
    GASOLINE_TOOLTIP: 'This car has a gasoline engine',
    GEARBOX_MANUAL_TOOLTIP: 'This car has a manual gearbox',
    GEARBOX_AUTOMATIC_TOOLTIP: 'This car has an automatic gearbox',
    SEATS_TOOLTIP_1: 'This car has ',
    SEATS_TOOLTIP_2: 'seats',
    DOORS_TOOLTIP_1: 'This car has ',
    DOORS_TOOLTIP_2: 'doors',
    AIRCON_TOOLTIP: 'This car has aircon',
    FUEL_POLICY_LIKE_FOR_LIKE_TOOLTIP: 'This car is supplied with fuel and must be returned with the same amount of fuel.',
    FUEL_POLICY_FREE_TANK_TOOLTIP: 'The price includes a full tank of fuel.',
    MILEAGE: 'Mileage',
    MILEAGE_UNIT: 'KM/day',
    UNLIMITED: 'Unlimited',
    LIMITED: 'Limited',
    CANCELLATION: 'Cancellation',
    CANCELLATION_TOOLTIP: 'The booking can be canceled before the start date of the rental.',
    AMENDMENTS: 'Amendments',
    AMENDMENTS_TOOLTIP: 'The booking can be modified before the start date of the rental.',
    THEFT_PROTECTION: 'Theft protection',
    THEFT_PROTECTION_TOOLTIP: 'Rental may include theft protection.',
    COLLISION_DAMAGE_WAVER: 'Collision damage waiver',
    COLLISION_DAMAGE_WAVER_TOOLTIP: 'Rental may include collision damage waiver.',
    FULL_INSURANCE: 'Full insurance',
    FULL_INSURANCE_TOOLTIP: 'The rental may include collision damage waiver and theft protection of the vehicle.',
    ADDITIONAL_DRIVER: 'Additional driver',
    INCLUDED: 'Included',
    UNAVAILABLE: 'Unavailable',
    CAR_AVAILABLE: 'Available for rental',
    CAR_AVAILABLE_TOOLTIP: 'This car is available for rental.',
    CAR_UNAVAILABLE: 'Unavailable for rental',
    CAR_UNAVAILABLE_TOOLTIP: 'This car is unavailable for rental.',
    VIEW_CAR: 'View this car',
    EMPTY_LIST: 'No cars.',
    BOOK: 'Choose this car',
    PRICE_DAYS_PART_1: 'Price for',
    PRICE_DAYS_PART_2: 'day',
    PRICE_PER_DAY: 'Price per day:',
    GEARBOX: 'Gearbox',
    ENGINE: 'Engine',
    DEPOSIT: 'Deposit at pick-up',
    LESS_THAN_2500: 'Less than 2500 DH',
    LESS_THAN_5000: 'Less than 5000 DH',
    LESS_THAN_7500: 'Less than 7500 DH',
  },
})

langHelper.setLanguage(strings)
export { strings }
