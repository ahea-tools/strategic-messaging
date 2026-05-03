'use client';

import { useState } from 'react';

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button type="button" onClick={onCopy} className="rounded border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100">
      {copied ? 'Copied' : label}
    </button>
  );
}
