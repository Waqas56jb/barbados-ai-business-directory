import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation, siteConfig } from '@/config/site'
import { useChatStore } from '@/store/chatStore'
import { Button } from '@/components/common/Button'

interface MobileNavigationProps {
  open: boolean
  onClose: () => void
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const openChat = useChatStore((state) => state.openChat)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <button type="button" className="absolute inset-0 bg-ocean/50" aria-label="Close menu overlay" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[min(24rem,100vw)] flex-col bg-ivory pb-[env(safe-area-inset-bottom)] shadow-soft">
        <div className="flex items-center justify-between border-b border-ocean/10 px-5 py-4">
          <p className="font-display text-xl text-ocean">{siteConfig.brandName}</p>
          <button type="button" aria-label="Close menu" onClick={onClose} className="rounded-full p-2 hover:bg-sand">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-base font-medium ${isActive ? 'bg-sand text-ocean' : 'text-ink hover:bg-sand/70'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/directory"
            onClick={onClose}
            className="block rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-sand/70"
          >
            Search Directory
          </NavLink>
          <NavLink
            to="/list-your-business"
            onClick={onClose}
            className="block rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-sand/70"
          >
            List Your Business
          </NavLink>
        </nav>
        <div className="border-t border-ocean/10 p-4">
          <Button
            className="w-full"
            onClick={() => {
              onClose()
              openChat()
            }}
          >
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  )
}
