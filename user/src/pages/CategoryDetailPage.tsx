import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { DirectorySkeleton } from '@/components/common/LoadingSkeleton'
import { SafeImage } from '@/components/common/SafeImage'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { getBusinessesByCategory, getCategory } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'

export function CategoryDetailPage() {
  const { slug = '' } = useParams()
  const overrides = useBusinessStore((state) => state.overrides)

  const categoryQuery = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategory(slug),
  })

  const businessesQuery = useQuery({
    queryKey: ['category-businesses', slug, overrides],
    queryFn: () => getBusinessesByCategory(slug),
    enabled: Boolean(categoryQuery.data),
  })

  const category = categoryQuery.data

  useDocumentMeta({
    title: category?.name ?? 'Category',
    description: category?.shortDescription,
    canonicalPath: slug ? `/categories/${slug}` : undefined,
  })

  if (categoryQuery.isLoading) {
    return (
      <div className="container-shell section-padding py-14">
        <DirectorySkeleton count={3} />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container-shell section-padding py-16 text-center">
        <h1 className="font-display text-4xl text-ocean">Category not found</h1>
        <Link to="/categories" className="mt-6 inline-flex text-turquoise">
          Back to categories
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative min-h-[320px] overflow-hidden">
        <SafeImage src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-ocean/60" />
        <div className="container-shell section-padding relative flex min-h-[320px] flex-col justify-end pb-10 text-white">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' },
              { label: category.name },
            ]}
          />
          <h1 className="font-display text-4xl sm:text-5xl">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-sand/90">{category.description}</p>
        </div>
      </div>

      <div className="container-shell section-padding py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{businessesQuery.data?.length ?? 0} listings in this category</p>
          <Link to={`/directory?category=${category.slug}`} className="text-sm font-semibold text-turquoise">
            Open in directory
          </Link>
        </div>
        {businessesQuery.isLoading ? <DirectorySkeleton /> : null}
        {businessesQuery.data?.length === 0 ? (
          <EmptyState title="No businesses found for your search." description="Try another category or browse the full directory." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {businessesQuery.data?.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
