import { AHEA_TOOLS_HUB_URL } from '@/lib/config';

export function ToolHubLink() {
  return (
    <nav aria-label="AHEA tools navigation" className="pt-1">
      <a
        href={AHEA_TOOLS_HUB_URL}
        className="inline-flex text-sm text-[#495A58] underline decoration-[#D4967D]/60 underline-offset-4 transition hover:text-[#303636] hover:decoration-[#D4967D] focus:outline-none focus:ring-2 focus:ring-[#D4967D] focus:ring-offset-2 focus:ring-offset-[#E5E3DC]"
      >
        ← Return to AHEA Tools
      </a>
    </nav>
  );
}
