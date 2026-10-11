import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function AccessibilityPage() {
  useDocumentMeta({
    title: 'Accessibility',
    description: 'Accessibility statement for the Barbados Explorer demo frontend.',
    canonicalPath: '/accessibility',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Accessibility' }]} />
      <SectionHeading
        title="Accessibility statement"
        description="We aim to keep this demo usable with keyboard navigation, clear labels, and readable contrast."
      />
      <div className="mt-8 max-w-3xl space-y-4 text-ink/85 leading-relaxed">
        <p>
          This frontend strives to follow practical WCAG-inspired patterns including semantic landmarks, visible focus
          states, labeled form controls, and keyboard-operable dialogs for navigation and chat.
        </p>
        <p>
          If you encounter an accessibility barrier in the demo, use the contact form to describe the issue. Feedback
          submitted in this prototype is validated locally only.
        </p>
      </div>
    </div>
  )
}
