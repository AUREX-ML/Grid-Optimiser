import { useState } from 'react';
import { MermaidDiagram } from './MermaidDiagram';
import { Code, Eye, Download, Copy, Check } from 'lucide-react';

const exampleDiagram = `graph TB
  subgraph Site["Solar Farm Site"]
    Panels[Solar Panels]
    Inverter[Inverter]
    Battery[Battery Storage]
  end

  subgraph Edge["Edge Controller"]
    MyEMS[MyEMS Controller]
  end

  subgraph Cloud["Cloud VPP"]
    ThingsBoard[ThingsBoard]
  end

  Panels --> Inverter
  Inverter --> Battery
  Battery --> MyEMS
  MyEMS -->|MQTT| ThingsBoard

  style MyEMS fill:#3b82f6
  style ThingsBoard fill:#8b5cf6
`;

export function MermaidEditor() {
  const [code, setCode] = useState(exampleDiagram);
  const [view, setView] = useState<'split' | 'code' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.mmd';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
        <h3 className="text-lg font-semibold text-slate-200">Mermaid Diagram Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView('code')}
            className={`p-2 rounded transition-colors ${
              view === 'code' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Code View"
          >
            <Code className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('split')}
            className={`p-2 rounded transition-colors ${
              view === 'split' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Split View"
          >
            <div className="w-5 h-5 flex gap-0.5">
              <div className="w-2 h-5 bg-current"></div>
              <div className="w-2 h-5 bg-current"></div>
            </div>
          </button>
          <button
            onClick={() => setView('preview')}
            className={`p-2 rounded transition-colors ${
              view === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title="Preview View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <div className="w-px bg-slate-700 mx-2"></div>
          <button
            onClick={handleCopy}
            className="p-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
            title="Download Code"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`flex-1 grid ${view === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 overflow-hidden`}>
        {(view === 'code' || view === 'split') && (
          <div className="flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
              <span className="text-sm text-slate-400">Mermaid Code</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-slate-950 text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Mermaid diagram code here..."
              spellCheck={false}
            />
          </div>
        )}

        {(view === 'preview' || view === 'split') && (
          <div className="flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
              <span className="text-sm text-slate-400">Live Preview</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MermaidDiagram chart={code} id="editor-preview" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Quick Reference</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-400">
          <div>
            <code className="text-blue-400">graph TB</code> - Top to Bottom
          </div>
          <div>
            <code className="text-blue-400">graph LR</code> - Left to Right
          </div>
          <div>
            <code className="text-green-400">A[Box]</code> - Rectangle node
          </div>
          <div>
            <code className="text-green-400">B(Rounded)</code> - Rounded node
          </div>
          <div>
            <code className="text-purple-400">A --&gt; B</code> - Arrow
          </div>
          <div>
            <code className="text-purple-400">A ---|Text| B</code> - Labeled arrow
          </div>
          <div>
            <code className="text-orange-400">subgraph Title</code> - Group
          </div>
          <div>
            <code className="text-orange-400">style A fill:#f00</code> - Styling
          </div>
        </div>
      </div>
    </div>
  );
}
