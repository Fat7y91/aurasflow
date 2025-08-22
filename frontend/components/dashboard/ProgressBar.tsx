'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';

interface ProgressBarProps {
  percentage: number;
  title?: string;
}

export default function ProgressBar({ percentage, title }: ProgressBarProps) {
  const { t } = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        {title || t('projectDashboard.progress.title')}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Completion</span>
          <span className="text-white font-bold">{percentage}%</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
