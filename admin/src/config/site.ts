export const siteConfig = {
  brandName: 'Barbados Explorer Admin',
  shortName: 'Barbados Explorer',
  tagline: 'Operate the tourism marketplace with clarity and control.',
  url: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5175',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  demoEmail: 'admin@barbadosexplorer.demo',
  environmentLabel: 'Demo environment',
} as const

export const parishes = [
  'Christ Church',
  'St. Andrew',
  'St. George',
  'St. James',
  'St. John',
  'St. Joseph',
  'St. Lucy',
  'St. Michael',
  'St. Peter',
  'St. Philip',
  'St. Thomas',
] as const

export const adminRoles = [
  'super_admin',
  'listing_moderator',
  'advertising_manager',
  'ai_manager',
  'support_agent',
  'analytics_viewer',
] as const

export type AdminRole = (typeof adminRoles)[number]

export const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  listing_moderator: 'Listing Moderator',
  advertising_manager: 'Advertising Manager',
  ai_manager: 'AI Manager',
  support_agent: 'Support Agent',
  analytics_viewer: 'Analytics Viewer',
}
