import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = '/main.png',
  url,
  type = 'website',
  noindex = false
}: SEOProps) {
  const siteTitle = title 
    ? `${title} | MediBot - AI-Powered Health Assistant`
    : 'MediBot - AI-Powered Health Assistant & Medication Management'
  
  const siteDescription = description || 
    'Transform your healthcare with MediBot - Your AI-powered health companion for medication management, prescription analysis, and personalized health insights.'
  
  const siteUrl = url ? `https://medibot.vercel.app${url}` : 'https://medibot.vercel.app'
  const imageUrl = image.startsWith('http') ? image : `https://medibot.vercel.app${image}`
  
  const allKeywords = [
    'medication reminder',
    'health app',
    'AI health assistant',
    'prescription tracker',
    'medication management',
    'healthcare app',
    'pill reminder',
    'health chatbot',
    'medical AI',
    'prescription analysis',
    ...keywords
  ].join(', ')

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={allKeywords} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || 'MediBot - AI Health Assistant'} />
      <meta property="og:site_name" content="MediBot" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@medibot" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
      
      {/* Additional meta tags */}
      <meta name="author" content="Sujay Babu Thota" />
      <meta name="publisher" content="Asvix" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": siteTitle,
            "description": siteDescription,
            "url": siteUrl,
            "image": imageUrl,
            "author": {
              "@type": "Person",
              "name": "Sujay Babu Thota"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Asvix",
              "logo": {
                "@type": "ImageObject",
                "url": "https://medibot.vercel.app/logo.png"
              }
            },
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "MediBot",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web, Android, iOS"
            }
          })
        }}
      />
    </Head>
  )
}
