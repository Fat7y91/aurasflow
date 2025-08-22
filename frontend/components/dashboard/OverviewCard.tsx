'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { ProjectDetails } from '../../types/project';

interface OverviewCardProps {
  project: ProjectDetails;
}

export default function OverviewCard({ project }: OverviewCardProps) {
  const { t } = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
          <div className="space-y-1 text-white/70">
            {project.location && (
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </p>
            )}
            {project.website && (
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {project.website}
              </p>
            )}
          </div>
        </div>
        <button className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white px-4 py-2 rounded-xl hover:shadow-lg hover:transform hover:-translate-y-0.5 transition-all duration-200">
          {t('projectDashboard.overview.edit')}
        </button>
      </div>

      {project.socials && (
        <div className="flex gap-4">
          {project.socials.instagram && (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.48.204 4.955.388a5.42 5.42 0 0 0-1.958 1.274A5.42 5.42 0 0 0 .723 3.62C.539 4.145.417 4.759.383 5.706.348 6.654.335 7.062.335 10.683c0 3.621.013 4.029.048 4.976.034.947.156 1.561.34 2.086a5.42 5.42 0 0 0 1.274 1.958 5.42 5.42 0 0 0 1.958 1.274c.525.184 1.139.306 2.086.34.947.035 1.355.048 4.976.048 3.621 0 4.029-.013 4.976-.048.947-.034 1.561-.156 2.086-.34a5.42 5.42 0 0 0 1.958-1.274 5.42 5.42 0 0 0 1.274-1.958c.184-.525.306-1.139.34-2.086.035-.947.048-1.355.048-4.976 0-3.621-.013-4.029-.048-4.976-.034-.947-.156-1.561-.34-2.086a5.42 5.42 0 0 0-1.274-1.958A5.42 5.42 0 0 0 16.991.388C16.466.204 15.852.082 14.905.048 13.957.013 13.549 0 9.928 0h2.089z"/>
              </svg>
              <span className="text-white/90 text-sm">{project.socials.instagram}</span>
            </div>
          )}
          {project.socials.tiktok && (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="text-white/90 text-sm">{project.socials.tiktok}</span>
            </div>
          )}
          {project.socials.facebook && (
            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-white/90 text-sm">{project.socials.facebook}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
