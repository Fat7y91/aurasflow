// Theme tokens extracted from Canva design system
export const theme = {
  colors: {
    // Primary gradient colors from Canva design
    primary: {
      DEFAULT: '#667eea', // من الجريدينت الأساسي
      50: '#f0f4ff',
      100: '#e0e7ff', 
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#667eea',
      600: '#5a67d8',
      700: '#4c51bf',
      800: '#434190',
      900: '#3730a3',
    },
    secondary: {
      DEFAULT: '#764ba2', // اللون الثاني من الجريدينت
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#764ba2',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    // UI colors
    accent: '#60a5fa', // أزرار CTA
    surface: 'rgba(255, 255, 255, 0.1)', // خلفية الكروت
    card: 'rgba(255, 255, 255, 0.15)', // خلفية الكروت عند hover
    border: 'rgba(255, 255, 255, 0.2)', // حدود الكروت
    muted: 'rgba(255, 255, 255, 0.7)', // نصوص ثانوية
    overlay: 'rgba(0, 0, 0, 0.5)', // خلفية overlay
    // Success/Error colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  gradients: {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // الخلفية الأساسية
    button: 'linear-gradient(135deg, #60a5fa, #3b82f6)', // أزرار primary
    card: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.1))', // خلفية كروت
  },
  
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
  },
  
  shadow: {
    card: '0 10px 25px rgba(0, 0, 0, 0.2)',
    hover: '0 10px 25px rgba(96, 165, 250, 0.3)',
    button: '0 4px 15px rgba(96, 165, 250, 0.3)',
    modal: '0 20px 50px rgba(0, 0, 0, 0.3)',
  },
  
  fonts: {
    ar: ['Cairo', 'system-ui', 'sans-serif'], // الخط العربي من كانفا
    en: ['Inter', 'system-ui', 'sans-serif'], // خط إنجليزي
  },
  
  fontSize: {
    hero: '3.5rem', // حجم عنوان Hero
    'section-title': '2.5rem',
    'card-title': '1.5rem',
  },
  
  backdropBlur: {
    DEFAULT: '15px',
    strong: '20px',
  },
  
  animation: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// CSS Variables for global use
export const cssVars = {
  '--color-primary': theme.colors.primary.DEFAULT,
  '--color-secondary': theme.colors.secondary.DEFAULT,
  '--color-accent': theme.colors.accent,
  '--color-surface': theme.colors.surface,
  '--color-border': theme.colors.border,
  '--gradient-hero': theme.gradients.hero,
  '--gradient-button': theme.gradients.button,
  '--radius-lg': theme.radius.lg,
  '--radius-xl': theme.radius.xl,
  '--shadow-card': theme.shadow.card,
  '--backdrop-blur': theme.backdropBlur.DEFAULT,
};

// Tailwind theme extension
export const tailwindTheme = {
  extend: {
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      surface: theme.colors.surface,
      'card-bg': theme.colors.card,
      'border-glass': theme.colors.border,
      muted: theme.colors.muted,
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.info,
    },
    backgroundImage: {
      'gradient-hero': theme.gradients.hero,
      'gradient-button': theme.gradients.button,
      'gradient-card': theme.gradients.card,
    },
    borderRadius: {
      'glass': theme.radius.md,
      'card': theme.radius.lg,
      'hero': theme.radius.xl,
    },
    boxShadow: {
      'glass': theme.shadow.card,
      'glass-hover': theme.shadow.hover,
      'button': theme.shadow.button,
      'modal': theme.shadow.modal,
    },
    backdropBlur: {
      'glass': theme.backdropBlur.DEFAULT,
      'glass-strong': theme.backdropBlur.strong,
    },
    fontFamily: {
      'ar': theme.fonts.ar,
      'en': theme.fonts.en,
    },
    fontSize: {
      'hero': theme.fontSize.hero,
      'section-title': theme.fontSize['section-title'],
      'card-title': theme.fontSize['card-title'],
    },
    transitionDuration: {
      'fast': theme.animation.duration.fast.replace('s', ''),
      'normal': theme.animation.duration.normal.replace('s', ''),
      'slow': theme.animation.duration.slow.replace('s', ''),
    },
    transitionTimingFunction: {
      'smooth': theme.animation.easing.smooth,
      'bounce': theme.animation.easing.bounce,
    },
  },
};

export type Theme = typeof theme;
