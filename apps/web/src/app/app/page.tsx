import Link from 'next/link';
import SchemaEditor from '@/components/SchemaEditor';
import ScenarioGrid from '@/components/ScenarioGrid';
import ExportPanel from '@/components/ExportPanel';
import ApiSettingsPanel from '@/components/ApiSettingsPanel';
import GenerateButton from '@/components/GenerateButton'; // I'll create this next

export default function EditorPage() {
  return (
    <div className="mobile-scrollable" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          <Link href="/">Mock<span style={{ color: 'var(--accent-primary)' }}>Forge</span></Link>
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ApiSettingsPanel />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="workspace-container">
        {/* Left pane: Model Input */}
        <div style={{ flex: 1, minWidth: 0, minHeight: '400px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', fontWeight: 500 }}>
            Code Model Input (TypeScript, Java, etc.)
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
            <SchemaEditor />
          </div>
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
            <GenerateButton />
          </div>
        </div>

        {/* Right pane: Results */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '500px' }}>
          <div style={{ flex: 1.2, minHeight: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-surface)', padding: '1rem', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Generated Scenarios</h2>
            </div>
            <ScenarioGrid />
          </div>
          <div style={{ flex: 1.8, border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-surface)', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Export</h2>
            </div>
            <div style={{ flex: 1, backgroundColor: '#1e1e1e', borderRadius: '4px', padding: '1rem', overflow: 'auto', minHeight: 0 }}>
              <ExportPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
