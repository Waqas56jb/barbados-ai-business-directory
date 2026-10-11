import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { getSetupChecklist } from '@/lib/completion'
import { formatDate, formatNumber, percentChange } from '@/lib/formatters'
import { getBusinessAnalytics } from '@/services/analyticsService'
import { useDemoStore } from '@/store/demoStore'
import { useQuery } from '@tanstack/react-query'

export function DashboardPage() {
  const owner = useDemoStore((state) => state.owner)
  const businesses = useDemoStore((state) => state.businesses)
  const promotions = useDemoStore((state) => state.promotions)
  const inquiries = useDemoStore((state) => state.inquiries)
  const activity = useDemoStore((state) => state.activity)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const activeBusiness = businesses.find((item) => item.id === activeBusinessId) ?? businesses[0]
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  const analyticsQuery = useQuery({
    queryKey: ['dashboard-analytics', activeBusiness?.id, range],
    queryFn: () => getBusinessAnalytics(activeBusiness!.id, range),
    enabled: Boolean(activeBusiness),
  })

  const summary = analyticsQuery.data
  const checklist = activeBusiness ? getSetupChecklist(activeBusiness) : []
  const activePromos = promotions.filter((item) => item.status === 'active').length

  const kpis = useMemo(() => {
    if (!summary || !activeBusiness) return []
    return [
      {
        label: 'Total Listing Views',
        value: summary.views,
        trend: percentChange(summary.views, summary.previous.views),
      },
      {
        label: 'Search Appearances',
        value: summary.searchAppearances,
        trend: null,
      },
      {
        label: 'Listing Clicks',
        value: summary.clicks,
        trend: percentChange(summary.clicks, summary.previous.clicks),
      },
      {
        label: 'Website Clicks',
        value: summary.websiteClicks,
        trend: null,
      },
      {
        label: 'Inquiries Received',
        value: summary.inquiries,
        trend: percentChange(summary.inquiries, summary.previous.inquiries),
      },
      {
        label: 'Favorites',
        value: summary.favorites,
        trend: null,
      },
      {
        label: 'Active Promotions',
        value: activePromos,
        trend: null,
      },
      {
        label: 'Listing Completion',
        value: activeBusiness.completionPercentage,
        suffix: '%',
        trend: null,
      },
    ]
  }, [summary, activeBusiness, activePromos])

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${owner.name.split(' ')[0]}.`}
        description="Here’s how your Barbados tourism business is performing. Metrics below are fictional demo analytics."
        actions={
          <>
            <Link to="/businesses/new"><Button>Add New Listing</Button></Link>
            {activeBusiness ? (
              <Link to={`/businesses/${activeBusiness.id}/edit`}><Button variant="outline">Edit Business Profile</Button></Link>
            ) : null}
            <Link to="/media"><Button variant="outline">Upload Photos</Button></Link>
            <Link to="/advertising/new"><Button variant="outline">Create Promotion</Button></Link>
            {activeBusiness ? (
              <Link to={`/businesses/${activeBusiness.id}`}><Button variant="ghost">Preview Public Listing</Button></Link>
            ) : null}
          </>
        }
      />

      <div className="mb-4 rounded-2xl border border-turquoise/30 bg-turquoise/10 px-4 py-3 text-sm text-ocean">
        Demo data notice: KPIs, charts, and activity events are illustrative and not real visitor traffic.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{kpi.label}</p>
            <p className="mt-3 font-display text-3xl text-ocean">
              {formatNumber(kpi.value)}
              {'suffix' in kpi && kpi.suffix ? kpi.suffix : ''}
            </p>
            {kpi.trend !== null && kpi.trend !== undefined ? (
              <p className={`mt-2 text-xs ${kpi.trend >= 0 ? 'text-emerald-700' : 'text-coral'}`}>
                {kpi.trend >= 0 ? '+' : ''}
                {kpi.trend}% vs prior period
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted">Demo metric</p>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader
            title="Listing views"
            description="Selectable demo time series for the active business."
            action={
              <div className="flex gap-1">
                {(['7d', '30d', '90d'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-lg px-2.5 py-1 text-xs ${
                      range === item ? 'bg-turquoise text-white' : 'bg-sand text-ocean'
                    }`}
                    onClick={() => setRange(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          />
          <div className="h-72 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.points ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e0e3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#18A7A1" fill="#18A7A133" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Setup checklist" description="Updates as local demo profile fields change." />
          <ul className="divide-y divide-border">
            {checklist.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-sand/40">
                  <span className={item.done ? 'text-muted line-through' : 'text-ink'}>{item.label}</span>
                  <span className={`text-xs font-semibold ${item.done ? 'text-emerald-700' : 'text-coral'}`}>
                    {item.done ? 'Done' : 'To do'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Listing performance" description="Click a business to open its details." />
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3">Business</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Views</th>
                  <th className="px-3 py-3">Clicks</th>
                  <th className="px-3 py-3">Inquiries</th>
                  <th className="px-3 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => {
                  const bizInquiries = inquiries.filter((item) => item.businessId === business.id).length
                  return (
                    <tr key={business.id} className="border-t border-border">
                      <td className="px-5 py-3">
                        <Link to={`/businesses/${business.id}`} className="font-medium text-ocean hover:text-turquoise">
                          {business.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={business.status} /></td>
                      <td className="px-3 py-3">{business.id === activeBusiness?.id ? formatNumber(summary?.views ?? 0) : '—'}</td>
                      <td className="px-3 py-3">{business.id === activeBusiness?.id ? formatNumber(summary?.clicks ?? 0) : '—'}</td>
                      <td className="px-3 py-3">{bizInquiries}</td>
                      <td className="px-3 py-3 text-muted">{formatDate(business.updatedAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent activity" description="Mock activity timeline for this demo account." />
          <ul className="divide-y divide-border">
            {activity.slice(0, 6).map((item) => (
              <li key={item.id} className="px-5 py-3">
                <p className="text-sm font-medium text-ocean">{item.title}</p>
                <p className="mt-1 text-xs text-muted">{item.description}</p>
                <p className="mt-1 text-[11px] text-muted">{formatDate(item.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
