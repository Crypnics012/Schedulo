'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language, theme]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm flex justify-between items-center">
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 bg-gray-800 overflow-x-auto max-h-[600px]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
