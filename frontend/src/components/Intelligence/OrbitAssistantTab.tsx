import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AssistantResponse, EventItem, AnalysisResult } from '../../types';
import { api } from '../../services/api';

interface OrbitAssistantTabProps {
  selectedEvent: EventItem | null;
  activeAnalysis: AnalysisResult | null;
}

export const OrbitAssistantTab: React.FC<OrbitAssistantTabProps> = ({
  selectedEvent,
  activeAnalysis,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{
      query: string;
      response: AssistantResponse;
    }>
  >([]);

  const handleSend = async (questionText?: string) => {
    const q = questionText || prompt;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const resp = await api.askOrbit({
        prompt: q,
        selected_event_id: selectedEvent?.event_id,
        selected_analysis_id: activeAnalysis?.analysis_id,
      });

      setConversation((prev) => [...prev, { query: q, response: resp }]);
      setPrompt('');
    } catch (err) {
      console.error('ORBIT assistant query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleChips = [
    'What physical change occurred here?',
    'Explain the radar scattering mechanism',
    'What alternative hypotheses exist?',
    'What verification steps are required?',
  ];

  return (
    <div className="flex flex-col h-full font-mono-tech text-xs select-none">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {conversation.length === 0 ? (
          <div className="text-center py-6 px-2 space-y-3">
            <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
                ORBIT RADAR INTELLIGENCE
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Peer-review calibrated radar physics reasoning. Synthesizes dielectric backscatter,
                interferometric phase coherence, and surface structural changes.
              </p>
            </div>

            {/* Prompt Quick Chips */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                INQUIRE ACTIVE SCENE:
              </span>
              {sampleChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="w-full text-left p-1.5 rounded bg-[#030712] hover:bg-[#0c1833] border border-cyan-500/20 hover:border-cyan-400/50 text-[10px] text-slate-300 hover:text-cyan-200 transition-all truncate"
                >
                  › {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-cyan-950/70 border border-cyan-500/30 text-cyan-200 p-2 rounded max-w-[85%] text-[11px]">
                  {entry.query}
                </div>
              </div>

              {/* ORBIT Response */}
              <div className="bg-[#030712] border border-purple-500/30 rounded p-3 space-y-2.5 text-slate-200">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-1.5 text-[10px]">
                  <span className="font-bold text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ORBIT SCIENCE SYNTHESIS
                  </span>
                  <span className="text-slate-400 uppercase text-[9px]">
                    {entry.response.source_mode.replace('_', ' ')}
                  </span>
                </div>

                {/* Evidence */}
                <div>
                  <span className="text-[10px] font-bold text-cyan-300 block mb-1">
                    1. OBSERVED EVIDENCE:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
                    {entry.response.observed_evidence.map((ev, eIdx) => (
                      <li key={eIdx}>{ev}</li>
                    ))}
                  </ul>
                </div>

                {/* Plausible Interpretation */}
                <div>
                  <span className="text-[10px] font-bold text-emerald-300 block mb-0.5">
                    2. PLAUSIBLE INTERPRETATION:
                  </span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {entry.response.plausible_interpretation}
                  </p>
                </div>

                {/* Confidence */}
                <div className="text-[10px] text-amber-300 bg-amber-950/30 border border-amber-500/20 p-1.5 rounded">
                  {entry.response.confidence_assessment}
                </div>

                {/* Alternative Hypotheses */}
                <div>
                  <span className="text-[10px] font-bold text-rose-300 block mb-1">
                    3. PHYSICAL ALTERNATIVES:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
                    {entry.response.alternative_explanations.map((alt, aIdx) => (
                      <li key={aIdx}>{alt}</li>
                    ))}
                  </ul>
                </div>

                {/* Verification Steps */}
                <div>
                  <span className="text-[10px] font-bold text-sky-300 block mb-1">
                    4. RECOMMENDED VERIFICATION:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-300">
                    {entry.response.recommended_verification_steps.map((st, sIdx) => (
                      <li key={sIdx}>{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Citations */}
                {entry.response.scientific_citations_links.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-800 flex flex-wrap gap-2">
                    {entry.response.scientific_citations_links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="p-3 bg-[#030712] border border-purple-500/30 rounded text-center text-[10px] text-purple-300 animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>ORBIT IS ANALYZING RADAR SCATTERING PHYSICS...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 border-t border-cyan-500/20 bg-[#030712] flex gap-1.5"
      >
        <input
          type="text"
          placeholder="Ask ORBIT about radar scattering..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-[#09101f] border border-cyan-500/20 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="p-1.5 bg-cyan-600/50 hover:bg-cyan-500 text-white rounded transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
