export interface ProjectMetrics {
  plannedPosts: number;
  publishedPosts: number;
  remainingPosts: number;
  completionPct: number;
  reach: number;
  engagementRate: number;
  ctr: number;
  cpa: number;
  followersGained: number;
  avgPostPerformance: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'post' | 'plan' | 'kpi' | 'edit';
  description: string;
}

export interface Post {
  id: string;
  title: string;
  channel: 'instagram' | 'tiktok' | 'facebook';
  status: 'draft' | 'planned' | 'scheduled' | 'published';
  scheduledAt?: string;
  publishedAt?: string;
  caption: string;
}

export interface ProjectPlan {
  period: {
    start: string;
    end: string;
  };
  summary: string;
  analysis: string;
  goal: string;
}

export interface ProjectDetails {
  id: string;
  name: string;
  location?: string;
  website?: string;
  socials?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  brandJson?: {
    primaryColor?: string;
  };
  metrics: ProjectMetrics;
  plan: ProjectPlan;
  posts: Post[];
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}
