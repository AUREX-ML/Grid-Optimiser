import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        setError(null);

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#60a5fa',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            secondBkg: '#334155',
            labelBackground: '#1e293b',
            labelTextColor: '#e2e8f0',
            nodeBorder: '#475569',
            clusterBkg: '#1e293b',
            clusterBorder: '#475569',
            titleColor: '#f1f5f9',
            edgeLabelBackground: '#1e293b',
            nodeTextColor: '#f1f5f9',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        });

        if (containerRef.current) {
          // Render the mermaid code to SVG
          const { svg } = await mermaid.render(`mermaid-${id}`, chart);
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart, id]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full p-8 bg-slate-900 rounded-lg">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Diagram Error</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={containerRef}
      className="flex items-center justify-center w-full p-8 bg-slate-900 rounded-lg overflow-auto"
    />
  );
}
