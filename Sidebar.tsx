'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  section: 'findings' | 'code' | 'improvements';
}

export function Sidebar({ section }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Define sidebar links based on section
  const links = {
    findings: [
      { href: '/findings/security', label: 'Security Vulnerabilities' },
      { href: '/findings/performance', label: 'Performance Bottlenecks' },
      { href: '/findings/error-handling', label: 'Error Handling Deficiencies' },
      { href: '/findings/testing', label: 'Testing Gaps' }
    ],
    code: [
      { href: '/code/security', label: 'Security Code' },
      { href: '/code/performance', label: 'Performance Code' },
      { href: '/code/error-handling', label: 'Error Handling Code' },
      { href: '/code/testing', label: 'Testing Code' }
    ],
    improvements: [
      { href: '/improvements/security', label: 'Security Improvements' },
      { href: '/improvements/performance', label: 'Performance Improvements' },
      { href: '/improvements/error-handling', label: 'Error Handling Improvements' },
      { href: '/improvements/testing', label: 'Testing Improvements' }
    ]
  };

  const currentLinks = links[section];

  return (
    <div className={`border-r bg-background transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}>
      <div className="sticky top-16 p-4 h-[calc(100vh-4rem)] flex flex-col">
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-6 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors self-start"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>

        <nav className="space-y-2 overflow-y-auto flex-1">
          <Link
            href={`/${section}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              pathname === `/${section}` ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {expanded && <span>Overview</span>}
          </Link>

          {currentLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive(link.href) ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {expanded && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t mt-auto">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {expanded && <span>Back to Home</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
