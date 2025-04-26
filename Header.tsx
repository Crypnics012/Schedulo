'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <span className="font-bold text-xl">Schedulo Pro</span>
          </Link>
          <span className="text-sm text-muted-foreground hidden md:inline-block">Audit Report</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') && !isActive('/findings') && !isActive('/code') && !isActive('/improvements') && !isActive('/audit-methodology') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            href="/audit-methodology" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/audit-methodology') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Methodology
          </Link>
          <Link 
            href="/findings" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/findings') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Findings
          </Link>
          <Link 
            href="/code" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/code') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Code
          </Link>
          <Link 
            href="/improvements" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/improvements') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Improvements
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link 
              href="/" 
              className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive('/') && !isActive('/findings') && !isActive('/code') && !isActive('/improvements') && !isActive('/audit-methodology') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/audit-methodology" 
              className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive('/audit-methodology') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Methodology
            </Link>
            <Link 
              href="/findings" 
              className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive('/findings') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Findings
            </Link>
            <Link 
              href="/code" 
              className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive('/code') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Code
            </Link>
            <Link 
              href="/improvements" 
              className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive('/improvements') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Improvements
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
