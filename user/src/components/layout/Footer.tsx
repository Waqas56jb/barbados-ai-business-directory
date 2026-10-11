import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'
import { locations } from '@/data/locations'
import { footerDiscoverLinks, legalLinks, siteConfig } from '@/config/site'

const COPYRIGHT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ocean/10 bg-ocean text-sand">
      <div className="container-shell section-padding grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl text-white">{siteConfig.brandName}</p>
          <p className="mt-4 text-sm leading-relaxed text-sand/80">
            A premium demo directory for discovering fictional Barbados tourism businesses, experiences, and island places.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <a href={siteConfig.social.instagram} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <Globe className="h-3.5 w-3.5" />
              Instagram
            </a>
            <a href={siteConfig.social.facebook} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <Globe className="h-3.5 w-3.5" />
              Facebook
            </a>
            <a href={siteConfig.social.youtube} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <Globe className="h-3.5 w-3.5" />
              YouTube
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Discover</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {footerDiscoverLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/list-your-business" className="hover:text-white">
                List Your Business
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Categories</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link to={`/categories/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Locations</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {locations.slice(0, 6).map((location) => (
              <li key={location.id}>
                <Link to={`/locations/${location.slug}`} className="hover:text-white">
                  {location.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/locations" className="hover:text-white">
                All parishes
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell section-padding flex flex-col gap-4 py-6 text-sm text-sand/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {siteConfig.brandName}. Demo frontend with fictional listings.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
