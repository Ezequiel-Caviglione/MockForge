import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>
          Mock<span style={{ color: 'var(--accent-primary)' }}>Forge</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto' }}>
          Smart scenario mocking for complex schemas. Generate meaningful combinations of nullable and enum fields, powered by AI to give you realistic dummy data. Stop writing fixtures by hand.
        </p>

        <Link href="/app" style={{ 
          display: 'inline-block',
          backgroundColor: 'var(--accent-primary)', 
          color: 'white', 
          padding: '1rem 2rem', 
          borderRadius: 'var(--radius)', 
          fontSize: '1.125rem', 
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)',
          transition: 'all 0.2s ease'
        }}>
          Try the Editor →
        </Link>
      </div>

      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', width: '100%' }}>
        {/* Feature 1 */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Smart Combinations</h3>
          <p style={{ color: 'var(--text-muted)' }}>Instead of random data, we analyze your schema to generate meaningful test scenarios based on nullables and enums.</p>
        </div>
        {/* Feature 2 */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>AI Enhanced</h3>
          <p style={{ color: 'var(--text-muted)' }}>Bring your own API key to generate hyper-realistic data and semantic scenario names using top-tier LLMs.</p>
        </div>
        {/* Feature 3 */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Export Everywhere</h3>
          <p style={{ color: 'var(--text-muted)' }}>Export straight to JSON, TypeScript fixtures, or directly to MSW handlers. Seamless integration.</p>
        </div>
      </div>
    </main>
  );
}
