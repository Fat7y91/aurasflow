'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { ProjectMetrics } from '../../types/project';

interface KPIStatsProps {
  metrics: ProjectMetrics;
}

export default function KPIStats({ metrics }: KPIStatsProps) {
  const { t } = useTranslations();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const kpiCards = [
    { key: 'planned', value: metrics.plannedPosts, icon: '📝', color: 'from-blue-500 to-blue-600' },
    { key: 'published', value: metrics.publishedPosts, icon: '✅', color: 'from-green-500 to-green-600' },
    { key: 'remaining', value: metrics.remainingPosts, icon: '⏳', color: 'from-orange-500 to-orange-600' },
    { key: 'completion', value: metrics.completionPct, suffix: '%', icon: '🎯', color: 'from-purple-500 to-purple-600', isCircular: true },
    { key: 'reach', value: formatNumber(metrics.reach), icon: '👥', color: 'from-pink-500 to-pink-600' },
    { key: 'engagement', value: metrics.engagementRate, suffix: '%', icon: '❤️', color: 'from-red-500 to-red-600' },
    { key: 'ctr', value: metrics.ctr, suffix: '%', icon: '👆', color: 'from-indigo-500 to-indigo-600' },
    { key: 'cpa', value: metrics.cpa, prefix: '$', icon: '💰', color: 'from-emerald-500 to-emerald-600' },
    { key: 'followers', value: formatNumber(metrics.followersGained), icon: '📈', color: 'from-cyan-500 to-cyan-600' },
    { key: 'avgPerformance', value: metrics.avgPostPerformance, suffix: '/10', icon: '⭐', color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpiCards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-glass rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-lg`}>
              {card.icon}
            </div>
            {card.isCircular && (
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray={`${card.value}, 100`}
                  />
                </svg>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7B5CE6" />
                    <stop offset="100%" stopColor="#F28AC0" />
                  </linearGradient>
                </defs>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">
              {card.prefix}{card.value}{card.suffix}
            </p>
            <p className="text-white/70 text-sm">{t(`projectDashboard.kpis.${card.key}`)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
