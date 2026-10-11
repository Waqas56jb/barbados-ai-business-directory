import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { siteConfig } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function PrivacyPage() {
  useDocumentMeta({
    title: 'Privacy Policy',
    description: 'Privacy information for the Barbados Explorer frontend demo.',
    canonicalPath: '/privacy',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <SectionHeading title="Privacy Policy" description="How this demo handles visitor interactions." />
      <div className="mt-8 max-w-3xl space-y-4 text-ink/85 leading-relaxed">
        <p>
          {siteConfig.brandName} currently runs as a frontend demonstration with fictional business listings and a
          mock AI assistant. There is no production backend submission implemented for contact forms, newsletter
          signups, or chat messages.
        </p>
        <p>
          The demo may store non-sensitive convenience data in your browser locally, such as favorite listing IDs,
          recently viewed listings, announcement dismissal state, and optional demo listing overrides.
        </p>
        <p>
          Do not enter real secrets, payment details, or sensitive personal information into this demo. Future
          production privacy practices will be defined when the separate server and authentication systems are
          implemented.
        </p>
      </div>
    </div>
  )
}
