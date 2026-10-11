import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function TermsPage() {
  useDocumentMeta({
    title: 'Terms of Use',
    description: 'Demonstration terms for the Barbados Explorer visitor frontend.',
    canonicalPath: '/terms',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} />
      <SectionHeading title="Terms of Use" description="Concise demonstration terms for this prototype." />
      <div className="mt-8 max-w-3xl space-y-4 text-ink/85 leading-relaxed">
        <p>
          This website is a demonstration of {siteConfig.brandName}. Content, business listings, ratings, and chatbot
          answers are fictional unless otherwise stated and are provided for product demonstration only.
        </p>
        <p>
          You may explore the interface, search mock listings, and interact with the demo AI assistant. You may not
          present the sample listings as verified real-world businesses.
        </p>
        <p>
          Future production terms will cover accounts, advertising, listing ownership, and API usage once the
          business-owner, admin, and server applications are available.
        </p>
      </div>
    </div>
  )
}
