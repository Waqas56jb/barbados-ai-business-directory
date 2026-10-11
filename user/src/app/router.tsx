import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })))
const DirectoryPage = lazy(() =>
  import('@/pages/DirectoryPage').then((module) => ({ default: module.DirectoryPage })),
)
const BusinessDetailPage = lazy(() =>
  import('@/pages/BusinessDetailPage').then((module) => ({ default: module.BusinessDetailPage })),
)
const CategoriesPage = lazy(() =>
  import('@/pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })),
)
const CategoryDetailPage = lazy(() =>
  import('@/pages/CategoryDetailPage').then((module) => ({ default: module.CategoryDetailPage })),
)
const LocationsPage = lazy(() =>
  import('@/pages/LocationsPage').then((module) => ({ default: module.LocationsPage })),
)
const LocationDetailPage = lazy(() =>
  import('@/pages/LocationDetailPage').then((module) => ({ default: module.LocationDetailPage })),
)
const ThingsToDoPage = lazy(() =>
  import('@/pages/ThingsToDoPage').then((module) => ({ default: module.ThingsToDoPage })),
)
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage').then((module) => ({ default: module.FavoritesPage })),
)
const AboutPage = lazy(() => import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)
const PrivacyPage = lazy(() =>
  import('@/pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
)
const TermsPage = lazy(() => import('@/pages/TermsPage').then((module) => ({ default: module.TermsPage })))
const AccessibilityPage = lazy(() =>
  import('@/pages/AccessibilityPage').then((module) => ({ default: module.AccessibilityPage })),
)
const ListYourBusinessPage = lazy(() =>
  import('@/pages/ListYourBusinessPage').then((module) => ({ default: module.ListYourBusinessPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

function withSuspense(element: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="container-shell section-padding py-20 text-center text-muted" role="status">
          Loading page…
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'directory', element: withSuspense(<DirectoryPage />) },
      { path: 'business/:slug', element: withSuspense(<BusinessDetailPage />) },
      { path: 'categories', element: withSuspense(<CategoriesPage />) },
      { path: 'categories/:slug', element: withSuspense(<CategoryDetailPage />) },
      { path: 'locations', element: withSuspense(<LocationsPage />) },
      { path: 'locations/:slug', element: withSuspense(<LocationDetailPage />) },
      { path: 'things-to-do', element: withSuspense(<ThingsToDoPage />) },
      { path: 'favorites', element: withSuspense(<FavoritesPage />) },
      { path: 'about', element: withSuspense(<AboutPage />) },
      { path: 'contact', element: withSuspense(<ContactPage />) },
      { path: 'privacy', element: withSuspense(<PrivacyPage />) },
      { path: 'terms', element: withSuspense(<TermsPage />) },
      { path: 'accessibility', element: withSuspense(<AccessibilityPage />) },
      { path: 'list-your-business', element: withSuspense(<ListYourBusinessPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
])
