import { hasPermission, type Permission } from '@/lib/permissions'
import { useAdminStore } from '@/store/adminStore'

export function usePermission(permission: Permission) {
  const role = useAdminStore((state) => state.activeRole)
  return hasPermission(role, permission)
}

export function useActiveRole() {
  return useAdminStore((state) => state.activeRole)
}
