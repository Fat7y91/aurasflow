'use client';

import { useTranslations } from '../lib/i18n';

export default function CompareTable() {
  const { t } = useTranslations();
  
  const title = t('pricingPage.compare.title');
  const rows = t('pricingPage.compare.rows');
  const values = t('pricingPage.compare.values');

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">{title}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white font-semibold">Features</th>
                <th className="text-center py-4 px-4 text-white font-semibold">Starter</th>
                <th className="text-center py-4 px-4 text-white font-semibold">Professional</th>
                <th className="text-center py-4 px-4 text-white font-semibold">Business</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: string, index: number) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-4 px-4 text-white/90">{row}</td>
                  <td className="py-4 px-4 text-center text-white/80">
                    {getValueForRow(index, 0, values)}
                  </td>
                  <td className="py-4 px-4 text-center text-white/80">
                    {getValueForRow(index, 1, values)}
                  </td>
                  <td className="py-4 px-4 text-center text-white/80">
                    {getValueForRow(index, 2, values)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getValueForRow(rowIndex: number, planIndex: number, values: any) {
  const keys = ['brands', 'posts', 'videos', 'articles', 'autoschedule', 'kpi', 'insights', 'score', 'priority', 'manager'];
  const key = keys[rowIndex];
  return values[key]?.[planIndex] || '—';
}
