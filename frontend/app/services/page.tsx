'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from '../../lib/i18n';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

// Components
function ServiceCard({ service, index }: { service: any; index: number }) {
  const { dir } = useTranslations();
  
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
      <ul className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        {service.bullets.map((bullet: string, i: number) => (
          <li key={i} className="text-white/80 flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0"></span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ProcessStep({ step, index }: { step: any; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
        {index + 1}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
      <p className="text-white/80">{step.desc}</p>
    </motion.div>
  );
}

function PackageCard({ pkg, period, cta }: { pkg: any; period: string; cta: string }) {
  const { dir } = useTranslations();
  
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:transform hover:-translate-y-1"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
        <p className="text-white/80 mb-4">{pkg.desc}</p>
        <div className="text-white">
          <span className="text-4xl font-bold">${pkg.price}</span>
          <span className="text-white/60">{period}</span>
        </div>
      </div>
      
      <ul className={`space-y-3 mb-8 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        {pkg.features.map((feature: string, i: number) => (
          <li key={i} className="text-white/80 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link
        href="mailto:sales@aurasflow.com"
        className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-xl text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:transform hover:-translate-y-0.5"
      >
        {cta}
      </Link>
    </motion.div>
  );
}

function CaseCard({ caseStudy }: { caseStudy: any }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
    >
      <h3 className="text-xl font-bold text-white mb-2">{caseStudy.title}</h3>
      <div className="text-2xl font-bold text-purple-300 mb-2">{caseStudy.result}</div>
      <p className="text-white/80">{caseStudy.desc}</p>
    </motion.div>
  );
}

function FAQItem({ item, isOpen, onToggle }: { item: any; isOpen: boolean; onToggle: () => void }) {
  const { dir } = useTranslations();
  
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className={`w-full p-6 text-left hover:bg-white/5 transition-colors ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-white pr-4">{item.q}</span>
          <svg
            className={`w-5 h-5 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-white/80">{item.a}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function ServicesPage() {
  const { t, dir, locale } = useTranslations();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const services = t('services.categories.items');
  const processSteps = t('services.process.steps');
  const packages = t('services.packages.items');
  const cases = t('services.cases.items');
  const faqs = t('services.faq.items');

  return (
    <div className={`min-h-screen ${dir === 'rtl' ? 'font-ar' : 'font-en'}`} dir={dir}>
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('services.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('services.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:sales@aurasflow.com"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                {t('services.hero.cta_primary')}
              </Link>
              <Link
                href="#packages"
                className="border border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                {t('services.hero.cta_secondary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t('services.categories.title')}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service: any, index: number) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How We Work */}
      <section id="process" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t('services.process.title')}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {processSteps.map((step: any, index: number) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Packages */}
      <section id="packages" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t('services.packages.title')}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {packages.map((pkg: any, index: number) => (
              <PackageCard 
                key={index} 
                pkg={pkg} 
                period={t('services.packages.period')}
                cta={t('services.packages.cta')}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t('services.cases.title')}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {cases.map((caseStudy: any, index: number) => (
              <CaseCard key={index} caseStudy={caseStudy} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t('services.faq.title')}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((item: any, index: number) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('services.cta.title')}
            </h2>
            <Link
              href="mailto:sales@aurasflow.com"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              {t('services.cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
