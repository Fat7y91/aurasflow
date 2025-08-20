'use client';

import { useState, useEffect, useRef } from 'react';

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      title: 'ماذا يقول عملاؤنا',
      subtitle: 'قصص نجاح حقيقية من شركائنا',
      description: 'نفخر بالثقة التي يمنحها لنا عملاؤنا ونسعى دائماً لتجاوز توقعاتهم',
      testimonials: [
        {
          name: 'أحمد المالكي',
          position: 'المدير التنفيذي',
          company: 'شركة التقنية المتقدمة',
          image: '/api/placeholder/60/60',
          rating: 5,
          text: 'تجربة رائعة مع الفريق! تم تسليم المشروع في الوقت المحدد بجودة عالية جداً. النتائج فاقت توقعاتنا بكثير.',
          project: 'منصة إدارة المشاريع',
          results: [
            'زيادة الإنتاجية بنسبة 40%',
            'توفير 60% من الوقت',
            'تحسين التواصل بين الفرق'
          ]
        },
        {
          name: 'فاطمة الزهراني',
          position: 'مديرة التطوير',
          company: 'مجموعة الابتكار',
          image: '/api/placeholder/60/60',
          rating: 5,
          text: 'فريق محترف ومتخصص. الدعم ممتاز والتواصل واضح. أنصح بشدة بالتعامل معهم لأي مشروع تقني.',
          project: 'تطبيق التجارة الإلكترونية',
          results: [
            'زيادة المبيعات بنسبة 75%',
            'تحسين تجربة المستخدم',
            'نمو قاعدة العملاء'
          ]
        },
        {
          name: 'محمد العتيبي',
          position: 'مؤسس ومدير عام',
          company: 'ستارت أب تك',
          image: '/api/placeholder/60/60',
          rating: 5,
          text: 'ساعدونا في تحويل فكرتنا إلى منتج ناجح. الخبرة والاحترافية واضحة في كل تفصيل من تفاصيل العمل.',
          project: 'منصة التعلم الرقمي',
          results: [
            'إطلاق ناجح للمنصة',
            'رضا عالي من المستخدمين',
            'نمو سريع في التسجيلات'
          ]
        },
        {
          name: 'نورا السعد',
          position: 'مديرة التسويق الرقمي',
          company: 'وكالة الإبداع',
          image: '/api/placeholder/60/60',
          rating: 5,
          text: 'تعاملنا معهم في عدة مشاريع وفي كل مرة يبهروننا بالنتائج. فريق يستحق الثقة والتوصية.',
          project: 'نظام إدارة المحتوى',
          results: [
            'تبسيط عملية النشر',
            'زيادة كفاءة الفريق',
            'تحسين جودة المحتوى'
          ]
        },
        {
          name: 'خالد الراشد',
          position: 'مدير تقنية المعلومات',
          company: 'الشركة الوطنية',
          image: '/api/placeholder/60/60',
          rating: 5,
          text: 'حلول مبتكرة وتنفيذ ممتاز. استطاعوا فهم احتياجاتنا بدقة وتقديم حلول تناسب طبيعة عملنا.',
          project: 'نظام إدارة الموارد البشرية',
          results: [
            'أتمتة العمليات الإدارية',
            'تقليل الأخطاء البشرية',
            'توفير التكاليف التشغيلية'
          ]
        }
      ],
      stats: [
        { number: '50+', label: 'مشروع مكتمل' },
        { number: '95%', label: 'رضا العملاء' },
        { number: '24/7', label: 'دعم مستمر' },
        { number: '3+', label: 'سنوات خبرة' }
      ],
      viewAll: 'عرض جميع التقييمات',
      nextTestimonial: 'التقييم التالي',
      previousTestimonial: 'التقييم السابق'
    }
  };

  const t = translations.ar;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => 
        prev === t.testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, t.testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = testimonialsRef.current?.querySelectorAll('.testimonial-item');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === t.testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const previousTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? t.testimonials.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section ref={testimonialsRef} className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 testimonial-item opacity-0">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            آراء العملاء
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.title}
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            {t.subtitle}
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 testimonial-item opacity-0">
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="testimonial-item opacity-0 mb-16">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content */}
              <div className="p-12 lg:p-16">
                <div className="flex items-center mb-6">
                  {renderStars(t.testimonials[activeTestimonial].rating)}
                </div>

                <blockquote className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white leading-relaxed mb-8">
                  "{t.testimonials[activeTestimonial].text}"
                </blockquote>

                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 rtl:mr-0 rtl:ml-4">
                    {t.testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {t.testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {t.testimonials[activeTestimonial].position}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                      {t.testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {t.testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? 'bg-blue-600 w-8'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={previousTestimonial}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                      aria-label={t.previousTestimonial}
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                      aria-label={t.nextTestimonial}
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Results */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-12 lg:p-16 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10">
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="testimonial-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <circle cx="30" cy="30" r="1" fill="white" fillOpacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#testimonial-pattern)"/>
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">
                    {t.testimonials[activeTestimonial].project}
                  </h3>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-100 mb-4">
                      النتائج المحققة:
                    </h4>
                    {t.testimonials[activeTestimonial].results.map((result, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-blue-100">{result}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">مدة المشروع</span>
                      <span className="font-semibold">3-6 أشهر</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 testimonial-item opacity-0">
          {t.testimonials.slice(1, 4).map((testimonial, index) => (
            <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 rtl:mr-0 rtl:ml-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 testimonial-item opacity-0">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            {t.viewAll}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .testimonial-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}
