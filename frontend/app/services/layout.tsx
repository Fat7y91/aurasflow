import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AurasFlow Services | Marketing Automation & Growth Systems',
  description: 'Services that turn strategy into a repeatable growth system—automation, publishing, analytics, and training.',
  keywords: ['marketing automation', 'content marketing', 'social media management', 'SEO services', 'digital marketing'],
  openGraph: {
    title: 'AurasFlow Services',
    description: 'Services that turn strategy into a repeatable growth system—automation, publishing, analytics, and training.',
    type: 'website',
  }
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
