import { useEffect } from 'react';

/**
 * Helper function to set meta tag content
 */
const updateMetaTag = (selector, attribute, value) => {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.includes('name=')) {
      const nameMatch = selector.match(/name="([^"]+)"/);
      if (nameMatch) element.setAttribute('name', nameMatch[1]);
    } else if (selector.includes('property=')) {
      const propMatch = selector.match(/property="([^"]+)"/);
      if (propMatch) element.setAttribute('property', propMatch[1]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

/**
 * Helper function to update link rel="canonical"
 */
const updateCanonicalLink = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!url) {
    if (link) link.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

/**
 * Helper function to manage JSON-LD structured data script
 */
const updateStructuredData = (data) => {
  let script = document.querySelector('script[type="application/ld+json"]#seo-structured-data');
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'seo-structured-data');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    // 1. Dynamic Title
    const baseTitle = 'TrendLife';
    const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | Premier Online Fashion App`;
    document.title = fullTitle;

    // 2. Meta Description
    const defaultDesc = 'Discover trendsetting fashion, ethnic wear, party dresses, and casual apparel on TrendLife with free express shipping across India.';
    const metaDesc = description || defaultDesc;
    updateMetaTag('meta[name="description"]', 'content', metaDesc);

    // 3. Meta Keywords
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // 4. Meta Robots (Noindex private pages / Index public pages)
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
    updateMetaTag('meta[name="robots"]', 'content', robotsContent);

    // 5. Canonical URL
    const canonicalUrl = canonical || window.location.href;
    updateCanonicalLink(canonicalUrl);

    // 6. Open Graph Metadata
    const defaultOgImage = `${window.location.origin}/favicon.png`;
    const imageToUse = ogImage || defaultOgImage;

    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'content', metaDesc);
    updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    updateMetaTag('meta[property="og:type"]', 'content', ogType);
    updateMetaTag('meta[property="og:image"]', 'content', imageToUse);
    updateMetaTag('meta[property="og:site_name"]', 'content', 'TrendLife');

    // 7. Twitter Cards Metadata
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', metaDesc);
    updateMetaTag('meta[name="twitter:image"]', 'content', imageToUse);

    // 8. Schema.org JSON-LD Structured Data
    updateStructuredData(structuredData);

    // Cleanup on unmount (optional default reset)
    return () => {
      // keep current metadata for smooth navigation
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredData]);

  return null;
};

export default SEO;
