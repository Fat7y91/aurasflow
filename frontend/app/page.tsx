'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [mounted, setMounted] = useState(false);

  // Load saved language preference
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLang);
  }, []);

  // Translations
  const translations = {
    ar: {
      hero: {
        title: 'مرحباً بك في أوراس فلو',
        subtitle: 'منصة شاملة لإدارة المشاريع والتعاون',
        description: 'نقدم حلولاً مبتكرة لإدارة مشاريعك بكفاءة عالية مع فريق عمل متخصص',
        cta: 'ابدأ الآن',
        learnMore: 'اعرف المزيد'
      },
      features: {
        title: 'لماذا أوراس فلو؟',
        subtitle: 'مميزات تجعلنا الخيار الأفضل لمشروعك',
        items: [
          {
            title: 'إدارة متقدمة',
            description: 'أدوات متطورة لتتبع وإدارة جميع جوانب مشروعك',
            icon: 'management'
          },
          {
            title: 'تعاون فعال',
            description: 'منصة موحدة للتواصل والتعاون بين أعضاء الفريق',
            icon: 'collaboration'
          },
          {
            title: 'تقارير ذكية',
            description: 'تحليلات وتقارير مفصلة لمتابعة الأداء والتقدم',
            icon: 'analytics'
          },
          {
            title: 'أمان عالي',
            description: 'حماية متقدمة لبياناتك مع نسخ احتياطية آمنة',
            icon: 'security'
          }
        ]
      },
      stats: {
        title: 'أرقام تتحدث عن نفسها',
        items: [
          { number: '500+', label: 'مشروع مكتمل' },
          { number: '100+', label: 'عميل راضٍ' },
          { number: '24/7', label: 'دعم فني' },
          { number: '99%', label: 'معدل الرضا' }
        ]
      },
      cta: {
        title: 'جاهز لبدء مشروعك؟',
        subtitle: 'انضم إلى مئات العملاء الذين اختاروا أوراس فلو',
        button: 'ابدأ مجاناً'
      }
    },
    en: {
      hero: {
        title: 'Welcome to AurasFlow',
        subtitle: 'Complete platform for project management and collaboration',
        description: 'We provide innovative solutions to manage your projects efficiently with a specialized team',
        cta: 'Get Started',
        learnMore: 'Learn More'
      },
      features: {
        title: 'Why AurasFlow?',
        subtitle: 'Features that make us the best choice for your project',
        items: [
          {
            title: 'Advanced Management',
            description: 'Sophisticated tools to track and manage all aspects of your project',
            icon: 'management'
          },
          {
            title: 'Effective Collaboration',
            description: 'Unified platform for communication and collaboration between team members',
            icon: 'collaboration'
          },
          {
            title: 'Smart Reports',
            description: 'Detailed analytics and reports to monitor performance and progress',
            icon: 'analytics'
          },
          {
            title: 'High Security',
            description: 'Advanced protection for your data with secure backups',
            icon: 'security'
          }
        ]
      },
      stats: {
        title: 'Numbers speak for themselves',
        items: [
          { number: '500+', label: 'Completed Projects' },
          { number: '100+', label: 'Satisfied Clients' },
          { number: '24/7', label: 'Technical Support' },
          { number: '99%', label: 'Satisfaction Rate' }
        ]
      },
      cta: {
        title: 'Ready to start your project?',
        subtitle: 'Join hundreds of clients who chose AurasFlow',
        button: 'Start Free'
      }
    }
  };

  const t = translations[language];

  // Feature icons
  const getFeatureIcon = (iconType: string) => {
    const icons = {
      management: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      collaboration: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      analytics: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      security: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    };
    return icons[iconType as keyof typeof icons] || icons.management;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              {t.hero.title}
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto"
            >
              {t.hero.subtitle}
            </motion.p>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/80 mb-12 max-w-2xl mx-auto"
            >
              {t.hero.description}
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/register"
                className="bg-gradient-button text-white font-semibold px-8 py-4 rounded-glass text-lg hover:shadow-button hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                {t.hero.cta}
              </Link>
              <button className="bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-glass text-lg hover:bg-white/20 transition-all duration-300">
                {t.hero.learnMore}
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {t.features.items.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6 text-center hover:bg-white/20 hover:transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-button rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                  {getFeatureIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.stats.title}
            </h2>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {t.stats.items.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-glass">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.cta.title}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t.cta.subtitle}
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-button text-white font-semibold px-10 py-4 rounded-glass text-lg hover:shadow-button hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              {t.cta.button}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            © 2024 {language === 'ar' ? 'أوراس فلو' : 'AurasFlow'}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
