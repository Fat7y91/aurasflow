'use client';
import { useEffect, useState } from 'react';
import { me } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    me(token)
      .then(setData)
      .catch(() => {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        router.replace('/login');
      });
  }, [router]);

  if (!data && !error) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {data && (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
      )}
      <button
        className="border px-4 py-2 rounded"
        onClick={() => { localStorage.removeItem('token'); router.replace('/login'); }}
      >
        Log out
      </button>
    </div>
  );
}
