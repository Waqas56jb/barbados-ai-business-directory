import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SafeImage } from '@/components/common/SafeImage'
import { SectionHeading } from '@/components/common/SectionHeading'
import { categories } from '@/data/categories'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function CategoriesPage() {
  useDocumentMeta({
    title: 'Categories',
    description: 'Browse Barbados tourism categories in the Barbados Explorer demo directory.',
    canonicalPath: '/categories',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Categories' }]} />
      <SectionHeading
        title="Tourism categories"
        description="Explore demo listings across beaches, tours, dining, stays, water sports, and more."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="overflow-hidden rounded-[1.75rem] border border-ocean/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
          >
            <SafeImage src={category.image} alt={category.name} className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <h2 className="font-display text-2xl text-ocean">{category.name}</h2>
              <p className="mt-2 text-sm text-muted">{category.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
