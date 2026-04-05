'use client';

import { useMockForgeStore } from '@/lib/store';
import Editor from '@monaco-editor/react';

export default function SchemaEditor() {
  const { schemaText, setSchemaText } = useMockForgeStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setSchemaText(value);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={schemaText}
        onChange={handleEditorChange}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.5,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          }
        }}
      />
    </div>
  );
}
