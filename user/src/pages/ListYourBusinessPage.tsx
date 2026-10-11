import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function ListYourBusinessPage() {
  useDocumentMeta({
    title: 'List Your Business',
    description: 'Future business-owner entry point for Barbados Explorer.',
    canonicalPath: '/list-your-business',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'List Your Business' }]} />
      <SectionHeading
        title="List your business"
        description="A future entry point for tourism businesses to manage listings and advertising."
      />
      <div className="mt-8 max-w-3xl space-y-4 rounded-[2rem] border border-ocean/10 bg-white p-8 shadow-card text-ink/85 leading-relaxed">
        <p>
          The business-owner dashboard is not part of this visitor frontend. This page is a placeholder navigation
          destination so public links remain intact while the separate <code>business-owner/</code> application is
          built later.
        </p>
        <p>
          In the meantime, explore the public directory and demo AI assistant to see how visitor discovery will work.
        </p>
        <Link to="/directory" className="inline-flex rounded-full bg-turquoise px-5 py-3 text-sm font-medium text-white">
          Explore the directory
        </Link>
      </div>
    </div>
  )
}
