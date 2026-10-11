import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

interface DocumentMeta {
  title: string
  description?: string
  canonicalPath?: string
}

export function useDocumentMeta({ title, description, canonicalPath }: DocumentMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.brandName}`
    document.title = fullTitle

    const ensureMeta = (selector: string, attr: string, value: string) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.match(/property="(.+?)"/)?.[1] ?? '')
        } else {
          element.setAttribute('name', selector.match(/name="(.+?)"/)?.[1] ?? '')
        }
        document.head.appendChild(element)
      }
      element.setAttribute(attr, value)
    }

    if (description) {
      ensureMeta('meta[name="description"]', 'content', description)
      ensureMeta('meta[property="og:description"]', 'content', description)
    }

    ensureMeta('meta[property="og:title"]', 'content', fullTitle)
    ensureMeta('meta[property="og:type"]', 'content', 'website')

    const canonicalHref = `${siteConfig.url}${canonicalPath ?? window.location.pathname}`
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalHref
  }, [title, description, canonicalPath])
}
