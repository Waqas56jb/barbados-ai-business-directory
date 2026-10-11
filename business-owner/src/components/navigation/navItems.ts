import {
  BadgePercent,
  Building2,
  CircleHelp,
  ClipboardList,
  Gauge,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Settings,
  Sparkles,
  Star,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Overview', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Business Management',
    items: [
      { label: 'My Businesses', href: '/businesses', icon: Building2 },
      { label: 'Listings', href: '/listings', icon: ClipboardList },
      { label: 'Add a Listing', href: '/businesses/new', icon: PlusCircle },
      { label: 'Photos & Media', href: '/media', icon: ImageIcon },
      { label: 'Services & Amenities', href: '/services', icon: Wrench },
      { label: 'AI Knowledge Profile', href: '/ai-knowledge', icon: Sparkles },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Advertising & Promotions', href: '/advertising', icon: BadgePercent },
      { label: 'Performance Analytics', href: '/analytics', icon: Gauge },
      { label: 'Reviews & Questions', href: '/reviews', icon: Star },
      { label: 'Messages & Inquiries', href: '/inquiries', icon: MessageSquare },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Account Settings', href: '/settings', icon: Settings },
      { label: 'Help & Support', href: '/help', icon: CircleHelp },
    ],
  },
]
