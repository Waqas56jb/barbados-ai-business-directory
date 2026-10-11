import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input, Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/formatters'
import { getBusinessAnalytics, type AnalyticsRange } from '@/services/analyticsService'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

export function AnalyticsPage() {
  const businesses = useDemoStore((state) => state.businesses)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const setActiveBusiness = useDemoStore((state) => state.setActiveBusiness)
  const pushToast = useToastStore((state) => state.push)
  const [range, setRange] = useState<AnalyticsRange>('30d')
  const [customStart, setCustomStart] = useState('2026-09-01')
  const [customEnd, setCustomEnd] = useState('2026-10-10')

  const query = useQuery({
    queryKey: ['analytics', activeBusinessId, range, customStart, customEnd],
    queryFn: () =>
      getBusinessAnalytics(
        activeBusinessId,
        range,
        range === 'custom' ? customStart : undefined,
        range === 'custom' ? customEnd : undefined,
      ),
    enabled: Boolean(activeBusinessId),
  })

  const cards = useMemo(() => {
    const data = query.data
    if (!data) return []
    return [
      ['Listing views', data.views],
      ['Search appearances', data.searchAppearances],
      ['Detail-page visits / clicks', data.clicks],
      ['Website clicks', data.websiteClicks],
      ['Contact clicks', data.contactClicks],
      ['Favorites', data.favorites],
      ['Inquiries', data.inquiries],
      ['Promotion impressions', data.promoImpressions],
      ['Promotion clicks', data.promoClicks],
    ] as const
  }, [query.data])

  const exportCsv = () => {
    if (!query.data?.points.length) return
    const header = [
      'date',
      'views',
      'searchAppearances',
      'clicks',
      'websiteClicks',
      'contactClicks',
      'favorites',
      'inquiries',
      'promoImpressions',
      'promoClicks',
    ]
    const lines = query.data.points.map((point) =>
      [
        point.date,
        point.views,
        point.searchAppearances,
        point.clicks,
        point.websiteClicks,
        point.contactClicks,
        point.favorites,
        point.inquiries,
        point.promoImpressions ?? 0,
        point.promoClicks ?? 0,
      ].join(','),
    )
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `demo-analytics-${activeBusinessId}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    pushToast({ title: 'CSV exported from demo analytics', tone: 'success' })
  }

  return (
    <div>
      <PageHeader
        title="Performance Analytics"
        description="Fictional analytics for planning conversations. These are not real visitor statistics."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
        actions={<Button variant="outline" onClick={exportCsv}>Export CSV</Button>}
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <Select value={activeBusinessId} onChange={(e) => setActiveBusiness(e.target.value)}>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>{business.name}</option>
          ))}
        </Select>
        <Select value={range} onChange={(e) => setRange(e.target.value as AnalyticsRange)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="custom">Custom range</option>
        </Select>
        {range === 'custom' ? (
          <>
            <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </>
        ) : null}
      </div>

      {!query.data?.points.length ? (
        <EmptyState title="No activity in this range" description="Try another date range or business." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(([label, value]) => (
              <Card key={label} className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-3 font-display text-3xl text-ocean">{formatNumber(value)}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader title="Views over time" />
              <div className="h-72 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={query.data.points}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8e0e3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#18A7A1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="searchAppearances" stroke="#103B46" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader title="Engagement breakdown" />
              <div className="h-72 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={query.data.points.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d8e0e3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" fill="#18A7A1" />
                    <Bar dataKey="inquiries" fill="#F07861" />
                    <Bar dataKey="favorites" fill="#103B46" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
