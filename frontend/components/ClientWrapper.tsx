'use client';

import { I18nProvider } from '../lib/i18n';
import Navbar from './Navbar';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </I18nProvider>
  );
}
