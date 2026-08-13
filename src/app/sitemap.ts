import { MetadataRoute } from 'next'
import { TOOLS } from '@/lib/tools-registry'
 
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abarjun.online'
  
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolRoutes,
  ]
}
