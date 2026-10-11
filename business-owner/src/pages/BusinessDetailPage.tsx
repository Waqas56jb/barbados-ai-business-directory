import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

export function BusinessDetailPage() {
  const { id = '' } = useParams()
  const business = useDemoStore((state) => state.businesses.find((item) => item.id === id))
  const setBusinessStatus = useDemoStore((state) => state.setBusinessStatus)
  const pushToast = useToastStore((state) => state.push)

  if (!business) {
    return (
      <EmptyState
        title="Business not found"
        description="This demo business id does not exist."
        action={<Link to="/businesses"><Button>Back to businesses</Button></Link>}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={business.name}
        description="Public-style listing preview using current local demo data."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Businesses', href: '/businesses' },
          { label: business.name },
        ]}
        actions={
          <>
            <Link to={`/businesses/${business.id}/edit`}><Button>Edit</Button></Link>
            <Button
              variant="outline"
              onClick={() => {
                setBusinessStatus(business.id, 'pending_review')
                pushToast({ title: 'Submitted for review (demo)', tone: 'success' })
              }}
            >
              Submit for Review
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <img src={business.coverImage} alt={business.name} className="aspect-[16/9] w-full object-cover" />
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={business.status} />
              <span className="rounded-full bg-sand px-2.5 py-1 text-xs text-ocean">{business.category}</span>
            </div>
            <p className="text-muted">{business.locationLabel}, {business.parish}</p>
            <p className="text-lg text-ink">{business.shortDescription}</p>
            <p className="leading-relaxed text-ink/85">{business.description}</p>
            <div>
              <h2 className="font-display text-xl text-ocean">Services</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {business.services.map((service) => (
                  <li key={service.id}>
                    <strong>{service.name}</strong> — {service.description}
                    {service.priceLabel ? ` (${service.priceLabel})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="space-y-3 p-5 text-sm">
            <p><span className="text-muted">Email:</span> {business.email ?? 'Not listed'}</p>
            <p><span className="text-muted">Phone:</span> {business.phone ?? 'Not listed'}</p>
            <p><span className="text-muted">Website:</span> {business.website ?? 'Not listed'}</p>
            <p><span className="text-muted">Completion:</span> {business.completionPercentage}%</p>
            <p><span className="text-muted">Updated:</span> {formatDate(business.updatedAt)}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-xl text-ocean">Gallery</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {business.gallery.map((image) => (
                <img key={image.id} src={image.url} alt={image.alt} className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
