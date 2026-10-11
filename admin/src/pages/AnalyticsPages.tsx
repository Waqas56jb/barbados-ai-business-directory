import { useQuery } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, Card, CardHeader, PageHeader, Select } from '@/components/ui/primitives'
import { usePermission } from '@/hooks/usePermission'
import { exportCsv, formatNumber } from '@/lib/formatters'
import { exportAnalytics, getPlatformAnalytics } from '@/services/analyticsService'
import { useToastStore } from '@/store/toastStore'

export function AnalyticsPage() {
  const canView = usePermission('analytics.view')
  const canExport = usePermission('analytics.export')
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  const push = useToastStore((s) => s.push)
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', range],
    queryFn: () => getPlatformAnalytics(range),
    enabled: canView,
  })

  if (!canView) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot view analytics.</Card>
  }

  const kpis = data?.kpis

  return (
    <div>
      <PageHeader
        title="Analytics & Reports"
        description="Demo analytics for operational monitoring. Values are fictional and labeled as demo data."
        breadcrumbs={[{ label: 'Platform Operations' }, { label: 'Analytics' }]}
        actions={
          <div className="flex gap-2">
            <Select value={range} onChange={(e) => setRange(e.target.value as typeof range)} className="w-auto">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
            {canExport ? (
              <Button
                variant="outline"
                onClick={async () => {
                  await exportAnalytics(range)
                  push({ title: 'Demo analytics CSV exported', tone: 'success' })
                }}
              >
                Export CSV
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['Published listings', kpis?.publishedListings],
          ['Pending submissions', kpis?.pendingSubmissions],
          ['Active business owners', kpis?.activeOwners],
          ['Directory searches', kpis?.directorySearches],
          ['Listing views', kpis?.listingViews],
          ['AI conversations', kpis?.aiConversations],
          ['Fallback rate', kpis ? `${kpis.fallbackRate}%` : undefined],
          ['Active campaigns', kpis?.activeCampaigns],
          ['Open reports', kpis?.openReports],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
            <p className="mt-3 font-display text-3xl text-ocean">
              {isLoading ? '—' : typeof value === 'number' ? formatNumber(value) : value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Listing growth & search trends" description="Accessible chart summary available for screen readers." />
          <div className="h-72 p-4" aria-label="Listing and search trends chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.series ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newListings" name="New listings" stroke="#103B46" />
                <Line type="monotone" dataKey="searches" name="Searches" stroke="#18A7A1" />
                <Line type="monotone" dataKey="listingViews" name="Views" stroke="#F07861" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card id="promotions">
          <CardHeader title="AI conversations & fallbacks" />
          <div className="h-72 p-4" aria-label="AI conversation volume chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.series ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="aiConversations" name="Conversations" fill="#18A7A1" />
                <Bar dataKey="fallbacks" name="Fallbacks" fill="#F07861" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Category distribution" />
          <ul className="max-h-72 space-y-2 overflow-y-auto px-5 pb-5 text-sm">
            {(data?.categoryDistribution ?? []).map((item) => (
              <li key={item.name} className="flex justify-between rounded-xl bg-sand/50 px-3 py-2">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Parish distribution" />
          <ul className="max-h-72 space-y-2 overflow-y-auto px-5 pb-5 text-sm">
            {(data?.parishDistribution ?? []).map((item) => (
              <li key={item.name} className="flex justify-between rounded-xl bg-sand/50 px-3 py-2">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Top listings (demo)" description="High-performing fictional listings based on mock analytics." />
        <ul className="divide-y divide-border">
          {(data?.topListings ?? []).map((listing) => (
            <li key={listing.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{listing.name}</p>
                <p className="text-muted">{listing.parish}</p>
              </div>
              <p>{formatNumber(listing.demoViews)} demo views</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export function ExportsPage() {
  const canExport = usePermission('analytics.export')
  const push = useToastStore((s) => s.push)
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  if (!canExport) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot export reports.</Card>
  }

  return (
    <div>
      <PageHeader
        title="Report exports"
        description="Export currently filtered demo analytics. Reports are clearly identified as demo data."
        breadcrumbs={[{ label: 'Analytics', href: '/analytics' }, { label: 'Exports' }]}
      />
      <Card className="max-w-xl p-5">
        <FieldLike label="Date range">
          <Select value={range} onChange={(e) => setRange(e.target.value as typeof range)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
        </FieldLike>
        <Button
          className="mt-4"
          onClick={async () => {
            const data = await exportAnalytics(range)
            exportCsv(`demo-kpis-${range}.csv`, [{ ...data.kpis, notice: 'demo data' }])
            push({ title: 'Demo export generated', tone: 'success' })
          }}
        >
          Export analytics CSV
        </Button>
      </Card>
    </div>
  )
}

function FieldLike({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ocean">{label}</span>
      {children}
    </label>
  )
}
