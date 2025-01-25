/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_BC_API_HOST: string;
  readonly VITE_BC_DEFAULT_LANGUAGE: string;
  readonly VITE_BC_PAGE_SIZE: string;
  readonly VITE_BC_CARS_PAGE_SIZE: string;
  readonly VITE_BC_BOOKINGS_PAGE_SIZE: string;
  readonly VITE_BC_CDN_USERS: string;
  readonly VITE_BC_CDN_TEMP_USERS: string;
  readonly VITE_BC_CDN_CARS: string;
  readonly VITE_BC_CDN_TEMP_CARS: string;
  readonly VITE_BC_CDN_LOCATIONS: string;
  readonly VITE_BC_CDN_TEMP_LOCATIONS: string;
  readonly VITE_BC_CDN_CONTRACTS: string;
  readonly VITE_BC_CDN_TEMP_CONTRACTS: string;
  readonly VITE_BC_CDN_LICENSES: string;
  readonly VITE_BC_CDN_TEMP_LICENSES: string;
  readonly VITE_BC_SUPPLIER_IMAGE_WIDTH: string;
  readonly VITE_BC_SUPPLIER_IMAGE_HEIGHT: string;
  readonly VITE_BC_CAR_IMAGE_WIDTH: string;
  readonly VITE_BC_CAR_IMAGE_HEIGHT: string;
  readonly VITE_BC_MINIMUM_AGE: string;
  readonly VITE_BC_PAGINATION_MODE: string;
  readonly VITE_BC_CURRENCY: string;
  readonly VITE_BC_DEPOSIT_FILTER_VALUE_1: string;
  readonly VITE_BC_DEPOSIT_FILTER_VALUE_2: string;
  readonly VITE_BC_DEPOSIT_FILTER_VALUE_3: string;
  readonly VITE_BC_WEBSITE_NAME: string;
  readonly VITE_BC_BOOKINGS_MOBILE_PAGE_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
