import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  Field,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { usePermission } from '@/hooks/usePermission'
import { slugify } from '@/lib/formatters'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { Category, LocationRecord } from '@/types'

export function CategoriesPage() {
  const canManage = usePermission('categories.manage')
  const categories = useAdminStore((s) => s.categories)
  const businesses = useAdminStore((s) => s.businesses)
  const upsertCategory = useAdminStore((s) => s.upsertCategory)
  const push = useToastStore((s) => s.push)
  const [editing, setEditing] = useState<Category | null>(null)
  const [warnId, setWarnId] = useState<string | null>(null)

  const counts = useMemo(() => {
    return Object.fromEntries(
      categories.map((category) => [
        category.id,
        businesses.filter((business) => business.categoryId === category.id).length,
      ]),
    )
  }, [categories, businesses])

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage categories.</Card>
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage tourism category taxonomy for the demo marketplace."
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Categories' }]}
        actions={
          <Button
            onClick={() =>
              setEditing({
                id: `cat-${crypto.randomUUID().slice(0, 6)}`,
                name: '',
                slug: '',
                description: '',
                icon: 'Compass',
                coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                active: true,
                displayOrder: categories.length + 1,
              })
            }
          >
            Create category
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <img src={category.coverImage} alt="" className="h-36 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-xl text-ocean">{category.name}</h2>
                    <p className="text-xs text-muted">{category.slug}</p>
                  </div>
                  <StatusBadge status={category.active ? 'active' : 'archived'} />
                </div>
                <p className="mt-2 text-sm text-muted">{category.description}</p>
                <p className="mt-3 text-sm">{counts[category.id] ?? 0} associated listings</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(category)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (category.active && (counts[category.id] ?? 0) > 0) {
                        setWarnId(category.id)
                      } else {
                        upsertCategory({ ...category, active: !category.active })
                        push({ title: 'Category status updated (demo)', tone: 'success' })
                      }
                    }}
                  >
                    {category.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {editing ? (
        <Card className="mt-6 p-5">
          <h2 className="font-display text-2xl text-ocean">{categories.some((c) => c.id === editing.id) ? 'Edit' : 'Create'} category</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Display name">
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                    slug: slugify(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Slug" hint="Must be unique">
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Icon key">
              <Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                value={editing.displayOrder}
                onChange={(e) => setEditing({ ...editing, displayOrder: Number(e.target.value) })}
              />
            </Field>
            <Field label="Cover image URL">
              <Input value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => {
                if (!editing.name.trim() || !editing.slug.trim()) {
                  push({ title: 'Name and slug are required', tone: 'error' })
                  return
                }
                const duplicate = categories.some((c) => c.slug === editing.slug && c.id !== editing.id)
                if (duplicate) {
                  push({ title: 'Slug must be unique', tone: 'error' })
                  return
                }
                upsertCategory(editing)
                push({ title: 'Category saved in demo state', tone: 'success' })
                setEditing(null)
              }}
            >
              Save category
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      ) : null}

      <ConfirmDialog
        open={Boolean(warnId)}
        title="Deactivate category with listings?"
        message="This category has associated demo listings. Deactivating will not delete related businesses."
        confirmLabel="Deactivate anyway"
        danger
        onClose={() => setWarnId(null)}
        onConfirm={() => {
          const category = categories.find((item) => item.id === warnId)
          if (!category) return
          upsertCategory({ ...category, active: false })
          push({ title: 'Category deactivated (demo)', tone: 'success' })
        }}
      />
    </div>
  )
}

export function LocationsPage() {
  const canManage = usePermission('locations.manage')
  const locations = useAdminStore((s) => s.locations)
  const businesses = useAdminStore((s) => s.businesses)
  const upsertLocation = useAdminStore((s) => s.upsertLocation)
  const push = useToastStore((s) => s.push)
  const [editing, setEditing] = useState<LocationRecord | null>(null)

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage locations.</Card>
  }

  return (
    <div>
      <PageHeader
        title="Locations"
        description="Manage parish and location metadata for Barbados. Descriptions are fictional demo content. GPS coordinates are intentionally omitted."
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Locations' }]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((location) => {
            const count = businesses.filter((business) => business.parish === location.name).length
            return (
              <Card key={location.id} className="overflow-hidden">
                <img src={location.image} alt="" className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-xl text-ocean">{location.name}</h2>
                    <StatusBadge status={location.active ? 'active' : 'archived'} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{location.description}</p>
                  <p className="mt-3 text-sm">{count} listings</p>
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => setEditing(location)}>
                    Edit
                  </Button>
                </div>
              </Card>
            )
          })}
      </div>

      {editing ? (
        <Card className="mt-6 p-5">
          <CardHeader title={`Edit ${editing.name}`} description="Fictional descriptive content for demo previews." />
          <div className="grid gap-3 px-5 pb-5 md:grid-cols-2">
            <Field label="Description">
              <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Image URL">
              <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                value={editing.displayOrder}
                onChange={(e) => setEditing({ ...editing, displayOrder: Number(e.target.value) })}
              />
            </Field>
            <Field label="Active">
              <Select
                value={editing.active ? 'yes' : 'no'}
                onChange={(e) => setEditing({ ...editing, active: e.target.value === 'yes' })}
              >
                <option value="yes">Active</option>
                <option value="no">Inactive</option>
              </Select>
            </Field>
          </div>
          <div className="flex gap-2 px-5 pb-5">
            <Button
              onClick={() => {
                upsertLocation(editing)
                push({ title: 'Location updated (demo)', tone: 'success' })
                setEditing(null)
              }}
            >
              Save location
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
