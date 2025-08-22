'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { ProjectPlan } from '../../types/project';

interface PlanCardProps {
  plan: ProjectPlan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const { t } = useTranslations();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{t('projectDashboard.plan.title')}</h3>
        <button className="text-[#7B5CE6] hover:text-[#F28AC0] transition-colors duration-200 text-sm font-medium">
          {t('projectDashboard.plan.open')}
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">{t('projectDashboard.plan.period')}</p>
          <p className="text-white font-medium">
            {formatDate(plan.period.start)} → {formatDate(plan.period.end)}
          </p>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2">{t('projectDashboard.plan.summary')}</p>
          <p className="text-white/90 text-sm leading-relaxed">{plan.summary}</p>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2">{t('projectDashboard.plan.analysis')}</p>
          <p className="text-white/90 text-sm leading-relaxed">{plan.analysis}</p>
        </div>

        <div>
          <p className="text-white/70 text-sm mb-2">{t('projectDashboard.plan.goal')}</p>
          <p className="text-white/90 text-sm leading-relaxed">{plan.goal}</p>
        </div>
      </div>
    </motion.div>
  );
}
