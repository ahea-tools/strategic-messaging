'use client';

import { useEffect, useState } from 'react';

const KEY = 'ahea_access_code';

export function AccessGate({ requiredCode, children }: { requiredCode?: string; children: React.ReactNode }) {
  const [value, setValue] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!requiredCode) {
      setOk(true);
      return;
    }
    setOk(sessionStorage.getItem(KEY) === requiredCode);
  }, [requiredCode]);

  if (!requiredCode) return <>{children}</>;
  if (ok) return <>{children}</>;

  return (
    <div className="mx-auto max-w-xl rounded border border-stone-300 bg-white p-6">
      <h2 className="mb-2 text-lg font-semibold">Enter access code</h2>
      <p className="mb-4 text-sm text-stone-700">This is a lightweight gate for v1 and not full authentication.</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="mb-3 w-full rounded border border-stone-300 p-2" />
      <button
        onClick={() => {
          if (value === requiredCode) {
            sessionStorage.setItem(KEY, value);
            setOk(true);
          }
        }}
        className="rounded bg-stone-900 px-4 py-2 text-white"
      >
        Continue
      </button>
    </div>
  );
}
