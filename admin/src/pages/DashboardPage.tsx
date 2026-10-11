import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader, PageHeader, Select, StatusBadge } from '@/components/ui/primitives'
import { formatDateTime, formatNumber } from '@/lib/formatters'
import { getDashboardOverview } from '@/services/adminService'
import { useAdminStore } from '@/store/adminStore'

export function DashboardPage() {
  const admin = useAdminStore((s) => s.getActiveAdmin())
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: getDashboardOverview,
  })

  const chartData = useMemo(() => {
    const series = data?.analytics ?? []
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
    return series.slice(-days)
  }, [data, range])

  const kpis = [
    { label: 'Total Business Listings', value: data?.totalListings, href: '/businesses' },
    { label: 'Published Listings', value: data?.publishedListings, href: '/businesses?status=published' },
    { label: 'Pending Approvals', value: data?.pendingApprovals, href: '/approvals' },
    { label: 'Registered Business Owners', value: data?.registeredOwners, href: '/business-owners' },
    { label: 'Active Advertising Campaigns', value: data?.activeCampaigns, href: '/advertising?status=active' },
    { label: 'Total Directory Searches', value: data?.directorySearches, href: '/analytics' },
    { label: 'AI Chatbot Conversations', value: data?.aiConversations, href: '/ai/conversations' },
    { label: 'Open Reports', value: data?.openReports, href: '/reports?status=new' },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome, ${admin?.name?.split(' ')[0] ?? 'Administrator'}.`}
        description="Monitor marketplace activity, review business submissions, and maintain reliable AI-powered tourism discovery. Figures below are fictional demo metrics."
        breadcrumbs={[{ label: 'Overview' }, { label: 'Dashboard' }]}
        actions={
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean">Demo environment</span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.href} className="rounded-2xl border border-border bg-white p-5 shadow-card transition hover:border-turquoise">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{kpi.label}</p>
            <p className="mt-3 font-display text-3xl text-ocean">
              {isLoading ? '—' : formatNumber(kpi.value ?? 0)}
            </p>
            <p className="mt-2 text-xs text-turquoise">Open related queue</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Marketplace activity"
            description="Mock series for listings, views, searches, and owner registrations."
            action={
              <Select value={range} onChange={(e) => setRange(e.target.value as typeof range)} className="w-auto">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </Select>
            }
          />
          <div className="h-80 p-4" aria-label="Marketplace activity chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e0e3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="newListings" name="New listings" stroke="#103B46" fill="#103B4633" />
                <Area type="monotone" dataKey="listingViews" name="Listing views" stroke="#18A7A1" fill="#18A7A133" />
                <Area type="monotone" dataKey="searches" name="Search activity" stroke="#F07861" fill="#F0786133" />
                <Area type="monotone" dataKey="ownerRegistrations" name="Owner registrations" stroke="#66757A" fill="#66757A22" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="sr-only">
              Chart showing mock marketplace metrics for the selected date range.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Pending tasks" description="Actionable demo queues." />
            <ul className="divide-y divide-border px-2">
              {[
                { label: 'Business listings awaiting review', href: '/approvals?tab=new' },
                { label: 'Listings with requested changes', href: '/approvals?tab=changes' },
                { label: 'New promotion requests', href: '/advertising?status=pending_review' },
                { label: 'Reported listings', href: '/reports?status=new' },
                { label: 'Unanswered support inquiries', href: '/reports?status=under_review' },
                { label: 'AI quality issues flagged', href: '/ai/evaluation' },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="block px-3 py-3 text-sm hover:bg-sand/70">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Platform health" description="Simulated status cards — not live monitoring." />
            <ul className="space-y-2 px-5 pb-5">
              {data?.health.map((item) => (
                <li key={item.name} className="flex items-center justify-between rounded-xl bg-sand/50 px-3 py-2 text-sm">
                  <span>{item.name}</span>
                  <StatusBadge status={item.status === 'demo_ok' ? 'active' : item.status === 'not_connected' ? 'pending' : 'paused'} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader title="Recent activity" description="Fictional administrative events from the demo audit log." />
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {(data?.auditLogs ?? []).map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-5 py-3 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td className="px-5 py-3">{log.actorName}</td>
                  <td className="px-5 py-3">{log.action}</td>
                  <td className="px-5 py-3">{log.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {(data?.auditLogs ?? []).map((log) => (
            <div key={log.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-medium text-ocean">{log.summary}</p>
              <p className="mt-1 text-xs text-muted">
                {formatDateTime(log.createdAt)} · {log.actorName} · {log.action}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
