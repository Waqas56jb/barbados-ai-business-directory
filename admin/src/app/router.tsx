import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AdvertisingDetailPage, AdvertisingListPage, PlacementsPage } from '@/pages/AdvertisingPages'
import { AdministratorsPage, IntegrationsPage, RolesPage, SettingsPage } from '@/pages/AdminSettingsPages'
import { AiConversationsPage, AiEvaluationPage, AiOverviewPage, AiSettingsPage } from '@/pages/AiPages'
import { AnalyticsPage, ExportsPage } from '@/pages/AnalyticsPages'
import { ApprovalDetailPage, ApprovalsListPage } from '@/pages/ApprovalsPages'
import { AccessDeniedPage, ForgotPasswordPage, LoginPage, ResetPasswordPage } from '@/pages/AuthPages'
import { BusinessDetailPage, BusinessesListPage } from '@/pages/BusinessesPages'
import { CategoriesPage, LocationsPage } from '@/pages/CategoriesLocationsPages'
import { DashboardPage } from '@/pages/DashboardPage'
import { KnowledgeDetailPage, KnowledgeListPage } from '@/pages/KnowledgePages'
import { AuditLogsPage, NotFoundPage, NotificationsPage, VisitorsPage } from '@/pages/OpsPages'
import { OwnerDetailPage, OwnersListPage } from '@/pages/OwnersPages'
import { ReportsPage, ReviewsPage } from '@/pages/ReviewsReportsPages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/business-owners" element={<OwnersListPage />} />
          <Route path="/business-owners/:id" element={<OwnerDetailPage />} />
          <Route path="/businesses" element={<BusinessesListPage />} />
          <Route path="/businesses/:id" element={<BusinessDetailPage />} />
          <Route path="/approvals" element={<ApprovalsListPage />} />
          <Route path="/approvals/:id" element={<ApprovalDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/exports" element={<ExportsPage />} />
          <Route path="/ai" element={<AiOverviewPage />} />
          <Route path="/ai/settings" element={<AiSettingsPage />} />
          <Route path="/ai/conversations" element={<AiConversationsPage />} />
          <Route path="/ai/evaluation" element={<AiEvaluationPage />} />
          <Route path="/knowledge" element={<KnowledgeListPage />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
          <Route path="/advertising" element={<AdvertisingListPage />} />
          <Route path="/advertising/placements" element={<PlacementsPage />} />
          <Route path="/advertising/:id" element={<AdvertisingDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/visitors" element={<VisitorsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/administrators" element={<AdministratorsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/integrations" element={<IntegrationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
