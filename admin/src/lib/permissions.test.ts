import { describe, expect, it } from 'vitest'
import { canAccessPath, getPermissionsForRole, hasPermission } from '@/lib/permissions'

describe('admin permissions', () => {
  it('gives super admin full access', () => {
    expect(hasPermission('super_admin', 'admins.manage')).toBe(true)
    expect(canAccessPath('super_admin', '/settings/integrations')).toBe(true)
  })

  it('limits listing moderator advertising access', () => {
    expect(hasPermission('listing_moderator', 'advertising.moderate')).toBe(false)
    expect(canAccessPath('listing_moderator', '/advertising')).toBe(false)
    expect(canAccessPath('listing_moderator', '/approvals/biz-001')).toBe(true)
  })

  it('limits analytics viewer to read-focused paths', () => {
    expect(hasPermission('analytics_viewer', 'approvals.moderate')).toBe(false)
    expect(canAccessPath('analytics_viewer', '/analytics')).toBe(true)
    expect(canAccessPath('analytics_viewer', '/administrators')).toBe(false)
  })

  it('exposes a non-empty permission set for every role', () => {
    expect(getPermissionsForRole('support_agent').length).toBeGreaterThan(0)
    expect(getPermissionsForRole('ai_manager')).toContain('knowledge.manage')
  })
})
