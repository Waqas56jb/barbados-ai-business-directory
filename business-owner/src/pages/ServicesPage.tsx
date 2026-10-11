import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { BusinessService } from '@/types'

const emptyService = (businessId: string): BusinessService => ({
  id: `svc-${crypto.randomUUID().slice(0, 8)}`,
  name: '',
  description: '',
  businessIds: [businessId],
})

export function ServicesPage() {
  const businesses = useDemoStore((state) => state.businesses)
  const services = useDemoStore((state) => state.services)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const upsertService = useDemoStore((state) => state.upsertService)
  const deleteService = useDemoStore((state) => state.deleteService)
  const reorderServices = useDemoStore((state) => state.reorderServices)
  const pushToast = useToastStore((state) => state.push)
  const [editing, setEditing] = useState<BusinessService | null>(null)

  const ordered = services.filter((service) => service.businessIds.includes(activeBusinessId) || service.businessIds.length === 0)

  return (
    <div>
      <PageHeader
        title="Services & Amenities"
        description="Reusable services stay aligned with business profile editors across the dashboard."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Services' }]}
        actions={
          <Button
            onClick={() => setEditing(emptyService(activeBusinessId))}
          >
            Add a service
          </Button>
        }
      />

      {ordered.length === 0 ? (
        <EmptyState title="No services yet" description="Add your first experience or service offering." />
      ) : (
        <div className="space-y-3">
          {ordered.map((service, index) => (
            <Card key={service.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-xl text-ocean">{service.name}</h2>
                  <p className="mt-1 text-sm text-muted">{service.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    {service.priceLabel ? `Price ${service.priceLabel}` : 'No price set'}
                    {service.duration ? ` · ${service.duration}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Linked businesses:{' '}
                    {service.businessIds
                      .map((id) => businesses.find((item) => item.id === id)?.name ?? id)
                      .join(', ')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(service)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (index === 0) return
                      const ids = ordered.map((item) => item.id)
                      ;[ids[index - 1], ids[index]] = [ids[index], ids[index - 1]]
                      reorderServices(ids)
                    }}
                  >
                    Move up
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      deleteService(service.id)
                      pushToast({ title: 'Service deleted', tone: 'info' })
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ocean/40 p-4">
          <Card className="w-full max-w-xl p-5">
            <h2 className="font-display text-2xl text-ocean">{editing.name ? 'Edit service' : 'Add service'}</h2>
            <div className="mt-4 space-y-3">
              <Field label="Service name">
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Price label">
                  <Input value={editing.priceLabel ?? ''} onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value || undefined })} />
                </Field>
                <Field label="Duration">
                  <Input value={editing.duration ?? ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value || undefined })} />
                </Field>
              </div>
              <Field label="Associate with businesses">
                <Select
                  value={editing.businessIds[0] ?? ''}
                  onChange={(e) => setEditing({ ...editing, businessIds: e.target.value ? [e.target.value] : [] })}
                >
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>{business.name}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!editing.name.trim() || !editing.description.trim()) {
                    pushToast({ title: 'Name and description are required', tone: 'error' })
                    return
                  }
                  upsertService(editing)
                  pushToast({ title: 'Service saved', tone: 'success' })
                  setEditing(null)
                }}
              >
                Save service
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
