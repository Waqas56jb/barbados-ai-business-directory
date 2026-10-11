import type { AdminRole } from '@/config/site'

export type Permission =
  | 'dashboard.view'
  | 'owners.view'
  | 'owners.manage'
  | 'businesses.view'
  | 'businesses.edit'
  | 'approvals.view'
  | 'approvals.moderate'
  | 'categories.manage'
  | 'locations.manage'
  | 'reviews.moderate'
  | 'reports.manage'
  | 'ai.view'
  | 'ai.manage'
  | 'knowledge.manage'
  | 'advertising.view'
  | 'advertising.moderate'
  | 'analytics.view'
  | 'analytics.export'
  | 'visitors.view'
  | 'notifications.manage'
  | 'audit.view'
  | 'admins.manage'
  | 'roles.view'
  | 'settings.manage'

const allPermissions: Permission[] = [
  'dashboard.view',
  'owners.view',
  'owners.manage',
  'businesses.view',
  'businesses.edit',
  'approvals.view',
  'approvals.moderate',
  'categories.manage',
  'locations.manage',
  'reviews.moderate',
  'reports.manage',
  'ai.view',
  'ai.manage',
  'knowledge.manage',
  'advertising.view',
  'advertising.moderate',
  'analytics.view',
  'analytics.export',
  'visitors.view',
  'notifications.manage',
  'audit.view',
  'admins.manage',
  'roles.view',
  'settings.manage',
]

const rolePermissions: Record<AdminRole, Permission[]> = {
  super_admin: allPermissions,
  listing_moderator: [
    'dashboard.view',
    'owners.view',
    'businesses.view',
    'businesses.edit',
    'approvals.view',
    'approvals.moderate',
    'categories.manage',
    'locations.manage',
    'reviews.moderate',
    'reports.manage',
    'notifications.manage',
    'audit.view',
  ],
  advertising_manager: [
    'dashboard.view',
    'businesses.view',
    'advertising.view',
    'advertising.moderate',
    'analytics.view',
    'analytics.export',
    'notifications.manage',
    'audit.view',
  ],
  ai_manager: [
    'dashboard.view',
    'businesses.view',
    'ai.view',
    'ai.manage',
    'knowledge.manage',
    'analytics.view',
    'notifications.manage',
    'audit.view',
  ],
  support_agent: [
    'dashboard.view',
    'owners.view',
    'businesses.view',
    'reviews.moderate',
    'reports.manage',
    'notifications.manage',
    'visitors.view',
  ],
  analytics_viewer: [
    'dashboard.view',
    'analytics.view',
    'analytics.export',
    'businesses.view',
    'advertising.view',
    'ai.view',
  ],
}

export function getPermissionsForRole(role: AdminRole): Permission[] {
  return rolePermissions[role]
}

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

export function canAccessPath(role: AdminRole, path: string): boolean {
  const rules: Array<{ prefix: string; permission: Permission }> = [
    { prefix: '/dashboard', permission: 'dashboard.view' },
    { prefix: '/business-owners', permission: 'owners.view' },
    { prefix: '/businesses', permission: 'businesses.view' },
    { prefix: '/approvals', permission: 'approvals.view' },
    { prefix: '/categories', permission: 'categories.manage' },
    { prefix: '/locations', permission: 'locations.manage' },
    { prefix: '/reviews', permission: 'reviews.moderate' },
    { prefix: '/reports/exports', permission: 'analytics.export' },
    { prefix: '/reports', permission: 'reports.manage' },
    { prefix: '/ai', permission: 'ai.view' },
    { prefix: '/knowledge', permission: 'knowledge.manage' },
    { prefix: '/advertising', permission: 'advertising.view' },
    { prefix: '/analytics', permission: 'analytics.view' },
    { prefix: '/visitors', permission: 'visitors.view' },
    { prefix: '/notifications', permission: 'notifications.manage' },
    { prefix: '/audit-logs', permission: 'audit.view' },
    { prefix: '/administrators', permission: 'admins.manage' },
    { prefix: '/roles', permission: 'roles.view' },
    { prefix: '/settings', permission: 'settings.manage' },
  ]

  const match = rules.find((rule) => path === rule.prefix || path.startsWith(`${rule.prefix}/`))
  if (!match) return true
  return hasPermission(role, match.permission)
}
