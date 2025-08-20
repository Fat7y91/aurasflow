'use client';

import { useState, useRef, useEffect } from 'react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      title: 'خطط أسعار مرنة',
      subtitle: 'اختر الخطة التي تناسب احتياجاتك',
      description: 'نقدم حلولاً مرنة تتناسب مع جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبيرة',
      monthly: 'شهرياً',
      yearly: 'سنوياً',
      save: 'وفر 20%',
      popular: 'الأكثر شعبية',
      recommended: 'مُوصى به',
      getStarted: 'ابدأ الآن',
      contactUs: 'تواصل معنا',
      per: 'لكل',
      month: 'شهر',
      year: 'سنة',
      billed: 'يُدفع',
      monthlyBilling: 'شهرياً',
      yearlyBilling: 'سنوياً',
      currency: 'ريال',
      plans: [
        {
          id: 'starter',
          name: 'البداية',
          description: 'مثالي للشركات الناشئة والمشاريع الصغيرة',
          monthlyPrice: 299,
          yearlyPrice: 2390, // 20% discount
          features: [
            'موقع إلكتروني تفاعلي',
            'تصميم مخصص',
            'استضافة مجانية لسنة',
            'شهادة SSL',
            'تحسين محركات البحث الأساسي',
            'دعم فني لمدة 3 أشهر',
            'تدريب أساسي',
            'نماذج اتصال'
          ],
          limitations: [
            'حتى 10 صفحات',
            'دعم عبر البريد الإلكتروني فقط'
          ],
          cta: 'ابدأ الآن',
          popular: false,
          recommended: false
        },
        {
          id: 'professional',
          name: 'الاحترافي',
          description: 'الأفضل للشركات المتوسطة التي تريد نمواً سريعاً',
          monthlyPrice: 699,
          yearlyPrice: 5592, // 20% discount
          features: [
            'كل مميزات خطة البداية',
            'تطبيق جوال (iOS & Android)',
            'لوحة تحكم إدارية',
            'تكامل مع وسائل الدفع',
            'تحليلات متقدمة',
            'تحسين محركات البحث المتقدم',
            'دعم فني لمدة 6 أشهر',
            'تدريب شامل',
            'نسخ احتياطية تلقائية'
          ],
          limitations: [
            'حتى 50 صفحة',
            'حتى 1000 مستخدم'
          ],
          cta: 'ابدأ الآن',
          popular: true,
          recommended: true
        },
        {
          id: 'enterprise',
          name: 'المؤسسات',
          description: 'حلول مخصصة للمؤسسات الكبيرة والمتطلبات المعقدة',
          monthlyPrice: 1499,
          yearlyPrice: 11992, // 20% discount
          features: [
            'كل مميزات الخطة الاحترافية',
            'حلول مخصصة بالكامل',
            'تكامل مع الأنظمة الحالية',
            'أمان متقدم',
            'دعم فني مخصص 24/7',
            'مدير حساب مخصص',
            'تدريب متقدم للفريق',
            'استشارات تقنية',
            'ضمان وقت التشغيل 99.9%'
          ],
          limitations: [],
          cta: 'تواصل معنا',
          popular: false,
          recommended: false
        }
      ],
      addOns: {
        title: 'خدمات إضافية',
        items: [
          { name: 'تصميم هوية بصرية', price: 1500, unit: 'مرة واحدة' },
          { name: 'تحسين السرعة', price: 500, unit: 'مرة واحدة' },
          { name: 'تدريب متقدم', price: 200, unit: 'ساعة' },
          { name: 'استشارة تقنية', price: 300, unit: 'ساعة' }
        ]
      },
      faq: {
        title: 'أسئلة حول الأسعار',
        items: [
          {
            question: 'هل يمكنني تغيير الخطة لاحقاً؟',
            answer: 'نعم، يمكنك ترقية أو تغيير خطتك في أي وقت. سيتم احتساب الفرق في السعر.'
          },
          {
            question: 'هل تتضمن الأسعار جميع التكاليف؟',
            answer: 'الأسعار تشمل التطوير والتصميم. تكاليف الاستضافة والدومين منفصلة للخطط المتقدمة.'
          },
          {
            question: 'ما هي سياسة الاسترداد؟',
            answer: 'نوفر ضمان استرداد كامل خلال 30 يوماً من بدء المشروع إذا لم تكن راضياً.'
          }
        ]
      }
    }
  };

  const t = translations.ar;

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

    const elements = pricingRef.current?.querySelectorAll('.pricing-item');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getPrice = (plan: any) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const period = billingCycle === 'monthly' ? t.month : t.year;
    return { price, period };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section ref={pricingRef} className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 pricing-item opacity-0">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            الأسعار
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t.title}
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t.subtitle}
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16 pricing-item opacity-0">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
            <div className="flex items-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.yearly}
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {t.save}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {t.plans.map((plan, index) => {
            const { price, period } = getPrice(plan);
            
            return (
              <div
                key={plan.id}
                className={`pricing-item opacity-0 relative group ${
                  plan.popular ? 'lg:scale-105 lg:-mt-8' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      {t.popular}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-xl border transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl relative overflow-hidden ${
                    plan.popular
                      ? 'border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20'
                      : 'border-white/20 hover:border-blue-200 dark:hover:border-blue-800'
                  }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 p-8 lg:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(price)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 mr-2 rtl:mr-0 rtl:ml-2">
                          {t.currency}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {t.per} {period}
                      </p>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {t.billed} {t.yearlyBilling}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.limitations.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitIndex) => (
                              <li key={limitIndex} className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                <svg className="w-4 h-4 mt-0.5 mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="pricing-item opacity-0 mb-20">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t.addOns.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                خدمات إضافية لتعزيز مشروعك
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.addOns.items.map((addon, index) => (
                <div key={index} className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 group hover:scale-105">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {addon.name}
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {formatPrice(addon.price)} {t.currency}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {addon.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="pricing-item opacity-0">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t.faq.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {t.faq.items.map((item, index) => (
                <div key={index} className="group">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.question}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pricing-item opacity-0">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pricing-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="1" fill="white" fillOpacity="0.1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pricing-pattern)"/>
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                جاهز لبدء مشروعك؟
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                احصل على استشارة مجانية وتقدير مفصل لمشروعك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                  احصل على استشارة مجانية
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                  عرض الأعمال السابقة
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

        .pricing-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}
