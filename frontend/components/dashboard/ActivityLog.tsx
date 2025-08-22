'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { ActivityLogEntry } from '../../types/project';

interface ActivityLogProps {
  activities: ActivityLogEntry[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const { t } = useTranslations();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'plan': return '📅';
      case 'kpi': return '📊';
      case 'edit': return '✏️';
      default: return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post': return 'text-blue-400 bg-blue-400/20';
      case 'plan': return 'text-green-400 bg-green-400/20';
      case 'kpi': return 'text-purple-400 bg-purple-400/20';
      case 'edit': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-bold text-white mb-6">
        {t('projectDashboard.activity.title')}
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">
                {activity.description}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>

            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
              {activity.type}
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <div className="text-white/50 text-lg mb-2">No activity yet</div>
            <div className="text-white/30 text-sm">Start working on your project to see activity</div>
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <button className="w-full py-2 text-[#7B5CE6] hover:text-[#7B5CE6]/80 transition-colors text-sm font-medium">
            View All Activity
          </button>
        </div>
      )}
    </motion.div>
  );
}
