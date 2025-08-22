'use client';

import { motion } from 'framer-motion';
import { useTranslations } from '../lib/i18n';
import { PLANS, Plan } from '../config/pricing';

interface PlanCardProps {
  planId: 'starter' | 'professional' | 'business';
  featured?: boolean;
  delay?: number;
}

export default function PlanCard({ planId, featured = false, delay = 0 }: PlanCardProps) {
  const { t } = useTranslations();
  const plan = PLANS.find((p: Plan) => p.id === planId);
  
  if (!plan) return null;

  const planData = t(`pricingPage.plans.${planId}` as any);
  const period = t('pricingPage.plans.period');
  const cta = t('pricingPage.plans.cta');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`relative ${
        featured 
          ? 'bg-gradient-to-br from-[#7B5CE6] to-[#F28AC0] p-0.5'
          : 'bg-white/10 border border-white/20'
      } rounded-2xl`}
    >
      <div className={`${
        featured ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' : 'bg-white/5'
      } backdrop-blur-md rounded-2xl p-8 h-full`}>
        {featured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{planData.name}</h3>
          <p className="text-white/70 text-sm mb-6">{planData.desc}</p>
          
          <div className="mb-6">
            <span className="text-5xl font-bold text-white">${plan.priceUsd}</span>
            <span className="text-white/60 ml-2">{period}</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {planData.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <button className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
          featured
            ? 'bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white hover:shadow-lg hover:shadow-purple-500/25 hover:transform hover:-translate-y-0.5'
            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:transform hover:-translate-y-0.5'
        }`}>
          {cta}
        </button>
      </div>
    </motion.div>
  );
}
