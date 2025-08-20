'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  step1: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  step2: {
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
    subscribeNewsletter: boolean;
  };
  step3: {
    company: string;
    position: string;
    teamSize: string;
    industry: string;
  };
}

export default function RegisterWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    step1: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    step2: {
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      subscribeNewsletter: true
    },
    step3: {
      company: '',
      position: '',
      teamSize: '',
      industry: ''
    }
  });

  const translations = {
    ar: {
      title: 'إنشاء حساب جديد',
      subtitle: 'انضم إلينا وابدأ رحلتك نحو النجاح',
      step: 'خطوة',
      of: 'من',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إنشاء الحساب',
      // Step 1
      personalInfo: 'المعلومات الشخصية',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      // Step 2
      security: 'الحماية والأمان',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      passwordStrength: 'قوة كلمة المرور',
      weak: 'ضعيفة',
      medium: 'متوسطة',
      strong: 'قوية',
      agreeToTerms: 'أوافق على الشروط والأحكام',
      subscribeNewsletter: 'أرغب في تلقي النشرة الإخبارية',
      // Step 3
      companyInfo: 'معلومات الشركة',
      company: 'اسم الشركة',
      position: 'المنصب',
      teamSize: 'حجم الفريق',
      industry: 'القطاع',
      optional: '(اختياري)',
      // Options
      teamSizes: {
        '1': 'فرد واحد',
        '2-10': '2-10 أشخاص',
        '11-50': '11-50 شخص',
        '51-200': '51-200 شخص',
        '200+': 'أكثر من 200 شخص'
      },
      industries: {
        tech: 'التكنولوجيا',
        finance: 'المالية',
        healthcare: 'الرعاية الصحية',
        education: 'التعليم',
        retail: 'التجارة',
        manufacturing: 'التصنيع',
        other: 'أخرى'
      },
      // Validation
      required: 'هذا الحقل مطلوب',
      emailInvalid: 'البريد الإلكتروني غير صحيح',
      phoneInvalid: 'رقم الهاتف غير صحيح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      termsRequired: 'يجب الموافقة على الشروط والأحكام',
      // Success
      accountCreated: 'تم إنشاء الحساب بنجاح!',
      loginPrompt: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول'
    }
  };

  const t = translations.ar;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', text: t.weak, color: 'bg-red-500' };
    if (strength <= 4) return { level: 'medium', text: t.medium, color: 'bg-yellow-500' };
    return { level: 'strong', text: t.strong, color: 'bg-green-500' };
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.step1.firstName) newErrors.firstName = t.required;
      if (!formData.step1.lastName) newErrors.lastName = t.required;
      if (!formData.step1.email) {
        newErrors.email = t.required;
      } else if (!/\S+@\S+\.\S+/.test(formData.step1.email)) {
        newErrors.email = t.emailInvalid;
      }
      if (!formData.step1.phone) {
        newErrors.phone = t.required;
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.step1.phone.replace(/\s/g, ''))) {
        newErrors.phone = t.phoneInvalid;
      }
    }

    if (step === 2) {
      if (!formData.step2.password) newErrors.password = t.required;
      if (!formData.step2.confirmPassword) newErrors.confirmPassword = t.required;
      if (formData.step2.password !== formData.step2.confirmPassword) {
        newErrors.confirmPassword = t.passwordMismatch;
      }
      if (!formData.step2.agreeToTerms) newErrors.agreeToTerms = t.termsRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', formData);
      // Handle successful registration
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إنشاء الحساب' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (step: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.personalInfo}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.firstName}
          </label>
          <input
            type="text"
            value={formData.step1.firstName}
            onChange={(e) => handleChange('step1', 'firstName', e.target.value)}
            className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
            placeholder="أحمد"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.lastName}
          </label>
          <input
            type="text"
            value={formData.step1.lastName}
            onChange={(e) => handleChange('step1', 'lastName', e.target.value)}
            className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
            placeholder="محمد"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.email}
        </label>
        <input
          type="email"
          value={formData.step1.email}
          onChange={(e) => handleChange('step1', 'email', e.target.value)}
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
          placeholder="ahmed@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.phone}
        </label>
        <input
          type="tel"
          value={formData.step1.phone}
          onChange={(e) => handleChange('step1', 'phone', e.target.value)}
          className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
          placeholder="+966 50 123 4567"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const passwordStrength = getPasswordStrength(formData.step2.password);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.security}</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.password}
          </label>
          <input
            type="password"
            value={formData.step2.password}
            onChange={(e) => handleChange('step2', 'password', e.target.value)}
            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
            placeholder="••••••••"
          />
          {formData.step2.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{t.passwordStrength}</span>
                <span className={`font-medium ${
                  passwordStrength.level === 'weak' ? 'text-red-600' :
                  passwordStrength.level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{passwordStrength.text}</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                  style={{ 
                    width: passwordStrength.level === 'weak' ? '33%' : 
                           passwordStrength.level === 'medium' ? '66%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
          )}
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.confirmPassword}
          </label>
          <input
            type="password"
            value={formData.step2.confirmPassword}
            onChange={(e) => handleChange('step2', 'confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.step2.agreeToTerms}
              onChange={(e) => handleChange('step2', 'agreeToTerms', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="agreeToTerms" className="mr-3 rtl:mr-0 rtl:ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t.agreeToTerms}{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                الشروط والأحكام
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="subscribeNewsletter"
              checked={formData.step2.subscribeNewsletter}
              onChange={(e) => handleChange('step2', 'subscribeNewsletter', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="subscribeNewsletter" className="mr-3 rtl:mr-0 rtl:ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t.subscribeNewsletter}
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.companyInfo}</h3>
        <p className="text-sm text-gray-500 mt-2">{t.optional}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.company}
        </label>
        <input
          type="text"
          value={formData.step3.company}
          onChange={(e) => handleChange('step3', 'company', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
          placeholder="شركة التقنية المتقدمة"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.position}
        </label>
        <input
          type="text"
          value={formData.step3.position}
          onChange={(e) => handleChange('step3', 'position', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
          placeholder="مطور برمجيات"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.teamSize}
          </label>
          <select
            value={formData.step3.teamSize}
            onChange={(e) => handleChange('step3', 'teamSize', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">اختر حجم الفريق</option>
            {Object.entries(t.teamSizes).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.industry}
          </label>
          <select
            value={formData.step3.industry}
            onChange={(e) => handleChange('step3', 'industry', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">اختر القطاع</option>
            {Object.entries(t.industries).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t.subtitle}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t.step} {currentStep} {t.of} 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 slide-in-right">
          {errors.general && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t.previous}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                {t.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'جاري الإنشاء...' : t.submit}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t.loginPrompt}{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
