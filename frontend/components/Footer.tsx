'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const translations = {
    ar: {
      company: {
        name: 'أوراس فلو',
        description: 'نحن شركة متخصصة في تطوير الحلول التقنية المبتكرة، نساعد الشركات على تحقيق أهدافها الرقمية من خلال منتجات عالية الجودة وخدمة عملاء متميزة.',
        tagline: 'نحول الأفكار إلى واقع رقمي'
      },
      newsletter: {
        title: 'اشترك في نشرتنا الإخبارية',
        description: 'احصل على آخر أخبار التطوير والتصميم',
        placeholder: 'أدخل بريدك الإلكتروني',
        subscribe: 'اشترك',
        success: 'تم الاشتراك بنجاح!'
      },
      links: {
        company: {
          title: 'الشركة',
          items: [
            { name: 'من نحن', href: '/about' },
            { name: 'فريق العمل', href: '/team' },
            { name: 'الوظائف', href: '/careers' },
            { name: 'أخبار الشركة', href: '/news' },
            { name: 'تواصل معنا', href: '/contact' }
          ]
        },
        services: {
          title: 'الخدمات',
          items: [
            { name: 'تطوير المواقع', href: '/services/web-development' },
            { name: 'تطوير التطبيقات', href: '/services/app-development' },
            { name: 'تصميم UI/UX', href: '/services/design' },
            { name: 'الاستشارات التقنية', href: '/services/consulting' },
            { name: 'الدعم والصيانة', href: '/services/support' }
          ]
        },
        resources: {
          title: 'المصادر',
          items: [
            { name: 'المدونة', href: '/blog' },
            { name: 'دراسات الحالة', href: '/case-studies' },
            { name: 'التوثيق', href: '/docs' },
            { name: 'مركز المساعدة', href: '/help' },
            { name: 'الأسئلة الشائعة', href: '/faq' }
          ]
        },
        legal: {
          title: 'قانوني',
          items: [
            { name: 'سياسة الخصوصية', href: '/privacy' },
            { name: 'شروط الاستخدام', href: '/terms' },
            { name: 'اتفاقية الترخيص', href: '/license' },
            { name: 'سياسة الاسترداد', href: '/refund' }
          ]
        }
      },
      contact: {
        title: 'معلومات التواصل',
        address: {
          title: 'العنوان',
          value: 'الرياض، المملكة العربية السعودية'
        },
        phone: {
          title: 'الهاتف',
          value: '+966 50 123 4567'
        },
        email: {
          title: 'البريد الإلكتروني',
          value: 'info@aurasflow.com'
        },
        hours: {
          title: 'ساعات العمل',
          value: 'الأحد - الخميس: 9:00 - 18:00'
        }
      },
      social: {
        title: 'تابعنا',
        platforms: [
          { name: 'تويتر', href: 'https://twitter.com/aurasflow', icon: 'twitter' },
          { name: 'لينكدين', href: 'https://linkedin.com/company/aurasflow', icon: 'linkedin' },
          { name: 'إنستقرام', href: 'https://instagram.com/aurasflow', icon: 'instagram' },
          { name: 'يوتيوب', href: 'https://youtube.com/@aurasflow', icon: 'youtube' },
          { name: 'جيت هاب', href: 'https://github.com/aurasflow', icon: 'github' }
        ]
      },
      copyright: '© 2024 أوراس فلو. جميع الحقوق محفوظة.',
      madeWith: 'صُنع بـ',
      love: 'حب',
      in: 'في',
      location: 'الرياض'
    }
  };

  const t = translations.ar;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email);
      setEmail('');
      // Show success message
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons = {
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.016 6.756.072 5.526.127 4.736.332 4.064.63c-.689.3-1.276.703-1.86 1.287C1.62 2.501 1.218 3.088.918 3.777c-.298.672-.503 1.462-.558 2.692C.304 7.702.288 8.109.288 11.73s.016 4.028.072 5.261c.055 1.23.26 2.02.558 2.692.3.689.703 1.276 1.287 1.86.584.584 1.171.987 1.86 1.287.672.298 1.462.503 2.692.558 1.233.056 1.64.072 5.261.072s4.028-.016 5.261-.072c1.23-.055 2.02-.26 2.692-.558.689-.3 1.276-.703 1.86-1.287.584-.584.987-1.171 1.287-1.86.298-.672.503-1.462.558-2.692.056-1.233.072-1.64.072-5.261s-.016-4.028-.072-5.261c-.055-1.23-.26-2.02-.558-2.692-.3-.689-.703-1.276-1.287-1.86C18.851.92 18.264.517 17.575.217c-.672-.298-1.462-.503-2.692-.558C13.65.016 13.243 0 9.622 0h2.395zm-.045 2.184c3.555 0 3.975.016 5.381.072 1.298.058 2.004.274 2.475.456.621.242 1.066.531 1.532.997.466.466.755.911.997 1.532.182.471.398 1.177.456 2.475.056 1.406.072 1.826.072 5.381s-.016 3.975-.072 5.381c-.058 1.298-.274 2.004-.456 2.475-.242.621-.531 1.066-.997 1.532-.466.466-.911.755-1.532.997-.471.182-1.177.398-2.475.456-1.406.056-1.826.072-5.381.072s-3.975-.016-5.381-.072c-1.298-.058-2.004-.274-2.475-.456-.621-.242-1.066-.531-1.532-.997-.466-.466-.755-.911-.997-1.532-.182-.471-.398-1.177-.456-2.475-.056-1.406-.072-1.826-.072-5.381s.016-3.975.072-5.381c.058-1.298.274-2.004.456-2.475.242-.621.531-1.066.997-1.532.466-.466.911-.755 1.532-.997.471-.182 1.177-.398 2.475-.456 1.406-.056 1.826-.072 5.381-.072z"/>
          <path d="M12.017 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12.017 16a4 4 0 110-8 4 4 0 010 8z"/>
          <circle cx="18.406" cy="5.594" r="1.44"/>
        </svg>
      ),
      youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    };

    return icons[platform as keyof typeof icons] || icons.twitter;
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <Link href="/" className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">{t.company.name}</span>
                </Link>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t.company.description}
              </p>
              
              <div className="mb-8">
                <p className="text-blue-400 font-medium italic">
                  "{t.company.tagline}"
                </p>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-lg font-semibold mb-4">{t.newsletter.title}</h4>
                <p className="text-gray-300 text-sm mb-4">{t.newsletter.description}</p>
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletter.placeholder}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    {t.newsletter.subscribe}
                  </button>
                </form>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">{t.links.company.title}</h4>
                  <ul className="space-y-3">
                    {t.links.company.items.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">{t.links.services.title}</h4>
                  <ul className="space-y-3">
                    {t.links.services.items.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">{t.links.resources.title}</h4>
                  <ul className="space-y-3">
                    {t.links.resources.items.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href}
                          className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact & Legal */}
                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">{t.contact.title}</h4>
                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t.contact.address.title}</p>
                      <p className="text-gray-300 text-sm">{t.contact.address.value}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t.contact.phone.title}</p>
                      <a href={`tel:${t.contact.phone.value}`} className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm">
                        {t.contact.phone.value}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t.contact.email.title}</p>
                      <a href={`mailto:${t.contact.email.value}`} className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm">
                        {t.contact.email.value}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t.contact.hours.title}</p>
                      <p className="text-gray-300 text-sm">{t.contact.hours.value}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold mb-3 text-white">{t.links.legal.title}</h5>
                    <ul className="space-y-2">
                      {t.links.legal.items.map((item, index) => (
                        <li key={index}>
                          <Link 
                            href={item.href}
                            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-xs"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Social Media */}
              <div className="mb-6 md:mb-0">
                <p className="text-gray-400 text-sm mb-4 md:mb-2">{t.social.title}</p>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {t.social.platforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                      aria-label={platform.name}
                    >
                      {getSocialIcon(platform.icon)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm mb-2">
                  {t.copyright}
                </p>
                <p className="text-gray-500 text-xs">
                  {t.madeWith} <span className="text-red-400">♥</span> {t.love} {t.in} {t.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
