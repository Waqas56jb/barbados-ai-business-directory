import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function AboutPage() {
  useDocumentMeta({
    title: 'About',
    description: 'Learn about the Barbados Explorer demo tourism directory and AI assistant.',
    canonicalPath: '/about',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      <SectionHeading
        title={`About ${siteConfig.brandName}`}
        description="A public visitor frontend for discovering Barbados tourism businesses and experiences."
      />
      <div className="prose-custom mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-ink/85">
        <p>
          {siteConfig.brandName} is a demonstration marketplace experience designed to help visitors and residents
          explore fictional tourism listings across Barbados — from tours and restaurants to stays, beaches, and
          transportation services.
        </p>
        <p>
          This website is the public-facing <strong>user</strong> frontend only. Business-owner tools, platform
          administration, and the production backend (including real RAG retrieval and OpenAI integration) are out of
          scope for this demo and will live in separate project folders later.
        </p>
        <p>
          All business names, ratings, contact details, and reviews shown here are illustrative sample data. They do
          not represent verified real-world businesses or an official tourism authority.
        </p>
      </div>
    </div>
  )
}
