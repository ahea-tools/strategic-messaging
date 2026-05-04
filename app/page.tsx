import { AccessGate } from '@/components/AccessGate';
import { StrategicMessagingForm } from '@/components/StrategicMessagingForm';

export default function Page() {
  const requiredCode = process.env.APP_ACCESS_CODE;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-stone-600">American Health Equity Association</p>
          <h1 className="text-3xl font-semibold">Strategic Messaging Tool</h1>
          <p className="max-w-3xl text-stone-700">Adapt complex health messages for today’s communication environment while preserving the substance of the work.</p>
        </header>
        <AccessGate requiredCode={requiredCode}>{/* Future Squarespace membership token checks can be added here if needed. */}<StrategicMessagingForm /></AccessGate>
        <footer className="text-xs text-stone-600">This tool provides communication support and does not provide legal, compliance, or policy advice.</footer>
      </div>
    </main>
  );
}
