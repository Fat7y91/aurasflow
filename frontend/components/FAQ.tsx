'use client';

import { useState, useRef, useEffect } from 'react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const faqRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات على أكثر الأسئلة تكراراً',
      description: 'نجيب على جميع استفساراتك حول خدماتنا وعملية العمل',
      searchPlaceholder: 'ابحث في الأسئلة الشائعة...',
      contactSupport: 'لم تجد إجابة؟ تواصل معنا',
      contact: 'تواصل معنا',
      faqs: [
        {
          question: 'ما هي الخدمات التي تقدمونها؟',
          answer: 'نقدم مجموعة شاملة من الخدمات التقنية تشمل تطوير المواقع والتطبيقات، تصميم واجهات المستخدم، الاستشارات التقنية، وحلول البرمجيات المخصصة. نعمل مع الشركات من جميع الأحجام لتحويل أفكارهم إلى حلول رقمية فعالة.',
          category: 'عام'
        },
        {
          question: 'كم يستغرق تطوير موقع إلكتروني؟',
          answer: 'مدة تطوير الموقع تعتمد على تعقيد المشروع ومتطلباته. عادة، الموقع البسيط يستغرق 2-4 أسابيع، بينما المواقع المعقدة أو المنصات قد تستغرق 2-6 أشهر. نقدم جدولاً زمنياً مفصلاً بعد دراسة متطلبات مشروعك.',
          category: 'التطوير'
        },
        {
          question: 'ما هي تكلفة تطوير تطبيق جوال؟',
          answer: 'تكلفة تطوير التطبيق تختلف حسب المميزات المطلوبة، نوع التطبيق (أصلي أم هجين)، والمنصات المستهدفة. نقدم تقديراً مفصلاً مجانياً بعد مناقشة متطلباتك. أسعارنا تنافسية وتتناسب مع الجودة العالية التي نقدمها.',
          category: 'التطوير'
        },
        {
          question: 'هل تقدمون خدمات الصيانة والدعم؟',
          answer: 'نعم، نقدم خدمات صيانة ودعم شاملة تشمل التحديثات الأمنية، إصلاح الأخطاء، إضافة مميزات جديدة، والدعم التقني. نوفر خطط صيانة مختلفة تناسب احتياجاتك وميزانيتك، مع ضمان استمرارية عمل مشروعك بكفاءة عالية.',
          category: 'الدعم'
        },
        {
          question: 'ما هي التقنيات التي تستخدمونها؟',
          answer: 'نستخدم أحدث التقنيات والأدوات في السوق مثل React، Next.js، Node.js، Python، React Native، Flutter للتطبيقات، وقواعد بيانات متنوعة. نختار التقنية المناسبة حسب متطلبات كل مشروع لضمان أفضل النتائج.',
          category: 'التقنية'
        },
        {
          question: 'هل يمكنني رؤية أمثلة على أعمالكم السابقة؟',
          answer: 'بالطبع! لدينا مجموعة متنوعة من المشاريع الناجحة في مختلف القطاعات. يمكنك مراجعة معرض أعمالنا أو طلب أمثلة محددة تتعلق بمجال عملك. نحرص على حماية خصوصية عملائنا ونعرض فقط المشاريع المسموح بنشرها.',
          category: 'عام'
        },
        {
          question: 'كيف تضمنون جودة المشروع؟',
          answer: 'نتبع منهجية صارمة في ضمان الجودة تشمل التخطيط المفصل، المراجعة المستمرة، الاختبارات الشاملة، ومراجعة الكود. نستخدم أفضل الممارسات في البرمجة ونجري اختبارات متعددة المراحل قبل التسليم.',
          category: 'الجودة'
        },
        {
          question: 'ما هي طرق التواصل المتاحة؟',
          answer: 'يمكنك التواصل معنا عبر عدة قنوات: البريد الإلكتروني، الهاتف، WhatsApp، أو منصات إدارة المشاريع. نوفر تواصلاً مستمراً خلال ساعات العمل ودعماً طارئاً عند الحاجة. نضمن الرد السريع على جميع استفساراتك.',
          category: 'التواصل'
        },
        {
          question: 'هل تعملون مع العملاء خارج المنطقة؟',
          answer: 'نعم، نعمل مع عملاء من جميع أنحاء العالم. لدينا خبرة في التعامل مع فرق العمل عن بُعد ونستخدم أدوات التواصل والتعاون الحديثة لضمان سير العمل بسلاسة رغم اختلاف المناطق الزمنية.',
          category: 'عام'
        },
        {
          question: 'ما هي مراحل تنفيذ المشروع؟',
          answer: 'نتبع منهجية واضحة تتضمن: 1) التحليل والتخطيط 2) التصميم والنماذج الأولية 3) التطوير والبرمجة 4) الاختبار والمراجعة 5) التسليم والتدريب 6) الدعم والصيانة. نوفر تقارير دورية ونشركك في كل مرحلة.',
          category: 'التطوير'
        }
      ]
    }
  };

  const t = translations.ar;

  const filteredFAQs = t.faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(t.faqs.map(faq => faq.category))];

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

    const elements = faqRef.current?.querySelectorAll('.faq-item');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'عام': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'التطوير': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'الدعم': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      'التقنية': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      'الجودة': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'التواصل': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };

    return icons[category as keyof typeof icons] || icons['عام'];
  };

  return (
    <section ref={faqRef} className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 faq-item opacity-0">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            الأسئلة الشائعة
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

        {/* Search */}
        <div className="mb-12 faq-item opacity-0">
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
              placeholder={t.searchPlaceholder}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 faq-item opacity-0">
          {categories.map((category, index) => (
            <div key={index} className="inline-flex items-center px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-white/20 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer">
              <span className="mr-2 rtl:mr-0 rtl:ml-2 text-blue-600 dark:text-blue-400">
                {getCategoryIcon(category)}
              </span>
              {category}
            </div>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div key={index} className="faq-item opacity-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {getCategoryIcon(faq.category)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
                          openFAQ === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-8 pb-6 pt-2">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 faq-item opacity-0">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لم نجد نتائج مطابقة
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                جرب تعديل كلمات البحث أو تصفح الفئات المختلفة
              </p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 faq-item opacity-0">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="faq-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="1" fill="white" fillOpacity="0.1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#faq-pattern)"/>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                {t.contactSupport}
              </h3>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                فريق الدعم لدينا متاح دائماً لمساعدتك والإجابة على استفساراتك
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                  {t.contact}
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                  دردشة مباشرة
                </button>
              </div>
            </div>
          </div>
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

        .faq-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}
