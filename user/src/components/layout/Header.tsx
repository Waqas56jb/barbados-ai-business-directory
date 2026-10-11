import { Menu, Search, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { navigation, siteConfig } from '@/config/site'
import { useChatStore } from '@/store/chatStore'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openChat = useChatStore((state) => state.openChat)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all ${
          scrolled ? 'border-b border-ocean/10 bg-ivory/95 shadow-sm backdrop-blur' : 'bg-ivory/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-shell section-padding flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link to="/" className="shrink-0 font-display text-xl font-semibold text-ocean sm:text-2xl">
            {siteConfig.brandName}
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-sand text-ocean' : 'text-muted hover:bg-sand/70 hover:text-ocean'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open directory search"
              className="hidden rounded-full p-2 text-ocean hover:bg-sand sm:inline-flex"
              onClick={() => navigate('/directory')}
            >
              <Search className="h-5 w-5" />
            </button>
            <Button
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => openChat()}
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </Button>
            <Link
              to="/list-your-business"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-ocean hover:bg-sand lg:inline-flex"
            >
              List Your Business
            </Link>
            <button
              type="button"
              className="inline-flex rounded-full p-2 text-ocean hover:bg-sand xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
