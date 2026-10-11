import type { LucideIcon } from 'lucide-react'
import {
  BadgePercent,
  Bot,
  Building2,
  ClipboardCheck,
  FileBarChart2,
  HelpCircle,
  LayoutDashboard,
  MapPinned,
  MessageSquareText,
  MessagesSquare,
  Newspaper,
  ScrollText,
  Settings2,
  Shield,
  Sparkles,
  Store,
  Tags,
  Users,
  UsersRound,
  Megaphone,
  Plug,
  BarChart3,
  Bell,
  BookOpen,
  Flag,
} from 'lucide-react'
import type { Permission } from '@/lib/permissions'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  permission?: Permission
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export const navigationGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard.view' }],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    items: [
      { label: 'Business Owners', href: '/business-owners', icon: Users, permission: 'owners.view' },
      { label: 'Business Directory', href: '/businesses', icon: Store, permission: 'businesses.view' },
      { label: 'Listing Approvals', href: '/approvals', icon: ClipboardCheck, permission: 'approvals.view' },
      { label: 'Categories', href: '/categories', icon: Tags, permission: 'categories.manage' },
      { label: 'Locations', href: '/locations', icon: MapPinned, permission: 'locations.manage' },
      { label: 'Reviews & Questions', href: '/reviews', icon: MessageSquareText, permission: 'reviews.moderate' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Management',
    items: [
      { label: 'AI Chatbot', href: '/ai', icon: Bot, permission: 'ai.view' },
      { label: 'Knowledge Base', href: '/knowledge', icon: BookOpen, permission: 'knowledge.manage' },
      { label: 'FAQ Management', href: '/knowledge?type=business_faq', icon: HelpCircle, permission: 'knowledge.manage' },
      { label: 'Chatbot Conversations', href: '/ai/conversations', icon: MessagesSquare, permission: 'ai.view' },
      { label: 'AI Quality & Evaluation', href: '/ai/evaluation', icon: Sparkles, permission: 'ai.manage' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { label: 'Advertising & Promotions', href: '/advertising', icon: Megaphone, permission: 'advertising.view' },
      { label: 'Sponsored Listings', href: '/advertising?status=active', icon: BadgePercent, permission: 'advertising.view' },
      { label: 'Campaign Performance', href: '/analytics#promotions', icon: BarChart3, permission: 'analytics.view' },
    ],
  },
  {
    id: 'operations',
    label: 'Platform Operations',
    items: [
      { label: 'Visitors & Accounts', href: '/visitors', icon: UsersRound, permission: 'visitors.view' },
      { label: 'Inquiries & Reports', href: '/reports', icon: Flag, permission: 'reports.manage' },
      { label: 'Notifications', href: '/notifications', icon: Bell, permission: 'notifications.manage' },
      { label: 'Analytics & Reports', href: '/analytics', icon: FileBarChart2, permission: 'analytics.view' },
      { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText, permission: 'audit.view' },
    ],
  },
  {
    id: 'configuration',
    label: 'Configuration',
    items: [
      { label: 'General Settings', href: '/settings', icon: Settings2, permission: 'settings.manage' },
      { label: 'API Integration Settings', href: '/settings/integrations', icon: Plug, permission: 'settings.manage' },
      { label: 'Moderation Rules', href: '/settings#moderation', icon: Newspaper, permission: 'settings.manage' },
      { label: 'Administrator Accounts', href: '/administrators', icon: Building2, permission: 'admins.manage' },
      { label: 'Roles & Permissions', href: '/roles', icon: Shield, permission: 'roles.view' },
    ],
  },
]
