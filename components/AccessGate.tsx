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
    <div className="mx-auto max-w-xl rounded border border-[#E5E3DC] bg-[#FFFFFF] p-6">
      <h2 className="mb-2 text-lg font-semibold">Enter access code</h2>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="mb-3 w-full rounded border border-[#E5E3DC] bg-[#FFFFFF] p-2" />
      <button
        onClick={() => {
          if (value === requiredCode) {
            sessionStorage.setItem(KEY, value);
            setOk(true);
          }
        }}
        className="rounded bg-[#D4967D] px-4 py-2 text-[#303636]"
      >
        Continue
      </button>
    </div>
  );
}
