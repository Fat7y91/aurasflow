import { Cairo, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ClientWrapper from '../components/ClientWrapper';
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html 
      lang="ar" 
      dir="rtl" 
      className={`${cairo.variable} ${inter.variable}`}
    >
            <body className={`transition-all duration-300`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
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
