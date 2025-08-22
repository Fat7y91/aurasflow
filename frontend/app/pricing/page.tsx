'use client';

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from '../../lib/i18n';
import PlanCard from '../../components/PlanCard';
import CompareTable from '../../components/CompareTable';

export default function PricingPage() {
  const { t, dir } = useTranslations();
  
  const heroData = t('pricingPage.hero');
  const highlightsData = t('pricingPage.highlights');
  const faqData = t('pricingPage.faq');
  const ctaData = t('pricingPage.cta');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A19] via-[#1a1a2e] to-[#16213e]" dir={dir}>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              {heroData.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {heroData.cta_primary}
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 hover:transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {heroData.cta_secondary}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('pricingPage.plans.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <PlanCard planId="starter" delay={0.1} />
            <PlanCard planId="professional" featured={true} delay={0.2} />
            <PlanCard planId="business" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {highlightsData.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlightsData.items.map((highlight: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/90 font-medium">{highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CompareTable />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {faqData.title}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqData.items.map((faq: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-white font-semibold text-lg mb-3">{faq.q}</h3>
                <p className="text-white/80">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#7B5CE6]/20 to-[#F28AC0]/20 backdrop-blur-md rounded-2xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {ctaData.title}
            </h2>
            <Link
              href="/contact"
              className="inline-flex bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {ctaData.button}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
