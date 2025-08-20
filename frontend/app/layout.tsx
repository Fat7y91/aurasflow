import { Cairo, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cookies } from 'next/headers';
import Navbar from '../components/Navbar';
import '../src/app/globals.css';

// Load fonts
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read language from cookie on server side
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get('language')?.value || 'ar';
  const direction = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  const fontClass = savedLanguage === 'ar' ? cairo.className : inter.className;
  const fontVar = savedLanguage === 'ar' ? 'font-ar' : 'font-en';

  return (
    <html 
      lang={savedLanguage} 
      dir={direction} 
      className={`${cairo.variable} ${inter.variable} ${fontVar}`}
    >
      <body className={`${fontClass} ${fontVar} transition-all duration-300`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#374151',
            },
            success: {
              style: {
                borderLeft: '4px solid #10b981',
              },
            },
            error: {
              style: {
                borderLeft: '4px solid #ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
