import { ProjectDetails } from '../../types/project';

export const getSampleProject = (id: string): ProjectDetails => ({
  id,
  name: 'AurasFlow Brand Campaign',
  location: 'Dubai, UAE',
  website: 'https://aurasflow.com',
  socials: {
    instagram: '@aurasflow',
    tiktok: '@aurasflow_official',
    facebook: 'AurasFlow'
  },
  brandJson: {
    primaryColor: '#7B5CE6'
  },
  metrics: {
    plannedPosts: 45,
    publishedPosts: 32,
    remainingPosts: 13,
    completionPct: 71,
    reach: 125000,
    engagementRate: 4.2,
    ctr: 2.8,
    cpa: 15.50,
    followersGained: 1245,
    avgPostPerformance: 8.3
  },
  plan: {
    period: {
      start: '2025-08-01',
      end: '2025-08-31'
    },
    summary: 'Brand awareness campaign focusing on AI-powered marketing automation with emphasis on bilingual content creation.',
    analysis: 'Strong performance in video content (8.9/10 avg), need to improve static post engagement. Instagram Stories showing 15% higher CTR than feed posts.',
    goal: 'Achieve 150K reach, 5% engagement rate, and 1500 new qualified followers by month end.'
  },
  posts: [
    {
      id: 'post-1',
      title: 'AI Marketing Revolution',
      channel: 'instagram',
      status: 'published',
      publishedAt: '2025-08-20T10:00:00Z',
      caption: 'Discover how AI is transforming marketing automation 🚀 #AIMarketing #AurasFlow'
    },
    {
      id: 'post-2', 
      title: 'Behind the Scenes: Content Creation',
      channel: 'tiktok',
      status: 'scheduled',
      scheduledAt: '2025-08-23T14:30:00Z',
      caption: 'See how we create viral content with AI ✨ #ContentCreation #AI'
    },
    {
      id: 'post-3',
      title: 'Customer Success Story',
      channel: 'facebook',
      status: 'planned',
      caption: 'How one client achieved 300% growth with AurasFlow 📈 #Success #Growth'
    },
    {
      id: 'post-4',
      title: 'Weekly Marketing Tips',
      channel: 'instagram',
      status: 'draft',
      caption: 'Top 5 marketing automation tips for 2025 💡 #MarketingTips'
    }
  ],
  activityLog: [
    {
      id: 'log-1',
      timestamp: '2025-08-22T09:15:00Z',
      type: 'post',
      description: 'Published "AI Marketing Revolution" on Instagram'
    },
    {
      id: 'log-2',
      timestamp: '2025-08-21T16:45:00Z',
      type: 'kpi',
      description: 'Reached 125K total reach milestone - 25% ahead of target'
    },
    {
      id: 'log-3',
      timestamp: '2025-08-21T11:30:00Z',
      type: 'plan',
      description: 'Updated content strategy to focus more on video content'
    },
    {
      id: 'log-4',
      timestamp: '2025-08-20T14:20:00Z',
      type: 'edit',
      description: 'Modified posting schedule for TikTok content'
    },
    {
      id: 'log-5',
      timestamp: '2025-08-19T13:10:00Z',
      type: 'post',
      description: 'Scheduled "Behind the Scenes" video for TikTok'
    },
    {
      id: 'log-6',
      timestamp: '2025-08-18T10:05:00Z',
      type: 'kpi',
      description: 'Engagement rate improved to 4.2% (+0.3% from last week)'
    }
  ],
  createdAt: '2025-08-01T00:00:00Z',
  updatedAt: '2025-08-22T09:15:00Z'
});
