import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { placementTypes } from '@/config/site'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'

export function AdvertisingPage() {
  const promotions = useDemoStore((state) => state.promotions)
  const businesses = useDemoStore((state) => state.businesses)

  return (
    <div>
      <PageHeader
        title="Advertising & Promotions"
        description="Request promotional placements for your listings. Approvals and payments are future backend features."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Advertising' }]}
        actions={<Link to="/advertising/new"><Button>Create promotion</Button></Link>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {placementTypes.map((placement) => (
          <Card key={placement.id} className="p-5">
            <h2 className="font-display text-xl text-ocean">{placement.name}</h2>
            <p className="mt-2 text-sm text-muted">{placement.description}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-turquoise">
              Suggested duration {placement.durationHint}
            </p>
            <p className="mt-2 text-xs text-muted">Does not promise actual impressions or traffic.</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Promotion requests" description="Demo campaign statuses only." />
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-3 py-3">Business</th>
                <th className="px-3 py-3">Placement</th>
                <th className="px-3 py-3">Dates</th>
                <th className="px-3 py-3">Budget</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Demo stats</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <Link to={`/advertising/${promo.id}`} className="font-medium text-ocean hover:text-turquoise">
                      {promo.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    {businesses.find((item) => item.id === promo.businessId)?.name ?? '—'}
                  </td>
                  <td className="px-3 py-3">{placementTypes.find((item) => item.id === promo.placement)?.name ?? promo.placement}</td>
                  <td className="px-3 py-3">{formatDate(promo.startDate)} – {formatDate(promo.endDate)}</td>
                  <td className="px-3 py-3">{formatCurrency(promo.budget)}</td>
                  <td className="px-3 py-3"><StatusBadge status={promo.status} /></td>
                  <td className="px-3 py-3 text-muted">
                    {promo.demoImpressions != null
                      ? `${promo.demoImpressions} impr · ${promo.demoClicks ?? 0} clicks`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-3 md:hidden">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              to={`/advertising/${promo.id}`}
              className="block rounded-xl border border-border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-ocean">{promo.name}</p>
                <StatusBadge status={promo.status} />
              </div>
              <p className="mt-1 text-xs text-muted">
                {businesses.find((item) => item.id === promo.businessId)?.name ?? '—'} ·{' '}
                {placementTypes.find((item) => item.id === promo.placement)?.name ?? promo.placement}
              </p>
              <p className="mt-1 text-xs text-muted">
                {formatDate(promo.startDate)} – {formatDate(promo.endDate)} · {formatCurrency(promo.budget)}
              </p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
