import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ToastViewport } from '@/components/ui/ToastViewport'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const OnboardingPage = lazy(() =>
  import('@/pages/auth/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
)
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const BusinessesPage = lazy(() => import('@/pages/BusinessesPage').then((m) => ({ default: m.BusinessesPage })))
const BusinessNewPage = lazy(() => import('@/pages/BusinessNewPage').then((m) => ({ default: m.BusinessNewPage })))
const BusinessDetailPage = lazy(() =>
  import('@/pages/BusinessDetailPage').then((m) => ({ default: m.BusinessDetailPage })),
)
const BusinessEditPage = lazy(() =>
  import('@/pages/BusinessEditPage').then((m) => ({ default: m.BusinessEditPage })),
)
const ListingsPage = lazy(() => import('@/pages/ListingsPage').then((m) => ({ default: m.ListingsPage })))
const MediaPage = lazy(() => import('@/pages/MediaPage').then((m) => ({ default: m.MediaPage })))
const ServicesPage = lazy(() => import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const AiKnowledgePage = lazy(() =>
  import('@/pages/AiKnowledgePage').then((m) => ({ default: m.AiKnowledgePage })),
)
const AdvertisingPage = lazy(() =>
  import('@/pages/AdvertisingPage').then((m) => ({ default: m.AdvertisingPage })),
)
const AdvertisingNewPage = lazy(() =>
  import('@/pages/AdvertisingFormPage').then((m) => ({ default: m.AdvertisingNewPage })),
)
const AdvertisingDetailPage = lazy(() =>
  import('@/pages/AdvertisingFormPage').then((m) => ({ default: m.AdvertisingDetailPage })),
)
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage })))
const InquiriesPage = lazy(() => import('@/pages/InquiriesPage').then((m) => ({ default: m.InquiriesPage })))
const HelpPage = lazy(() => import('@/pages/HelpPage').then((m) => ({ default: m.HelpPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const SettingsLayout = lazy(() =>
  import('@/pages/settings/SettingsPages').then((m) => ({ default: m.SettingsLayout })),
)
const SettingsProfilePage = lazy(() =>
  import('@/pages/settings/SettingsPages').then((m) => ({ default: m.SettingsProfilePage })),
)
const SettingsSecurityPage = lazy(() =>
  import('@/pages/settings/SettingsPages').then((m) => ({ default: m.SettingsSecurityPage })),
)
const SettingsNotificationsPage = lazy(() =>
  import('@/pages/settings/SettingsPages').then((m) => ({ default: m.SettingsNotificationsPage })),
)
const SettingsPreferencesPage = lazy(() =>
  import('@/pages/settings/SettingsPages').then((m) => ({ default: m.SettingsPreferencesPage })),
)

function withSuspense(element: ReactNode) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading…</div>}>{element}</Suspense>
  )
}

function OnboardingShell() {
  return (
    <>
      {withSuspense(<OnboardingPage />)}
      <ToastViewport />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
      { path: '/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: '/reset-password', element: withSuspense(<ResetPasswordPage />) },
    ],
  },
  { path: '/onboarding', element: <OnboardingShell /> },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: withSuspense(<DashboardPage />) },
      { path: '/businesses', element: withSuspense(<BusinessesPage />) },
      { path: '/businesses/new', element: withSuspense(<BusinessNewPage />) },
      { path: '/businesses/:id', element: withSuspense(<BusinessDetailPage />) },
      { path: '/businesses/:id/edit', element: withSuspense(<BusinessEditPage />) },
      { path: '/listings', element: withSuspense(<ListingsPage />) },
      { path: '/media', element: withSuspense(<MediaPage />) },
      { path: '/services', element: withSuspense(<ServicesPage />) },
      { path: '/ai-knowledge', element: withSuspense(<AiKnowledgePage />) },
      { path: '/advertising', element: withSuspense(<AdvertisingPage />) },
      { path: '/advertising/new', element: withSuspense(<AdvertisingNewPage />) },
      { path: '/advertising/:id', element: withSuspense(<AdvertisingDetailPage />) },
      { path: '/analytics', element: withSuspense(<AnalyticsPage />) },
      { path: '/reviews', element: withSuspense(<ReviewsPage />) },
      { path: '/inquiries', element: withSuspense(<InquiriesPage />) },
      { path: '/help', element: withSuspense(<HelpPage />) },
      {
        path: '/settings',
        element: withSuspense(<SettingsLayout />),
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile', element: withSuspense(<SettingsProfilePage />) },
          { path: 'security', element: withSuspense(<SettingsSecurityPage />) },
          { path: 'notifications', element: withSuspense(<SettingsNotificationsPage />) },
          { path: 'preferences', element: withSuspense(<SettingsPreferencesPage />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
])
