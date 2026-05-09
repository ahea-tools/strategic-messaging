import { StrategicMessagingForm } from '@/components/StrategicMessagingForm';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#E5E3DC] px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2 border-b border-[#D4967D] pb-4">
          <p className="text-sm uppercase tracking-wide text-[#495A58]">American Health Equity Association</p>
          <h1 className="text-3xl font-semibold">Strategic Messaging Tool</h1>
          <p className="max-w-3xl text-[#495A58]">Adapt complex health messages for today’s communication environment while preserving the substance of the work.</p>
        </header>
        <StrategicMessagingForm />
        <footer className="text-xs text-[#495A58]">This tool provides communication support and does not provide legal, compliance, or policy advice.</footer>
      </div>
    </main>
  );
}
