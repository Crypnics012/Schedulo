'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Sidebar } from '@/components/navigation/Sidebar';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  section: 'findings' | 'code' | 'improvements';
  breadcrumbs: BreadcrumbItem[];
}

export function SidebarLayout({ children, section, breadcrumbs }: SidebarLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {!isMobile && <Sidebar section={section} />}
      
      <div className="flex-1 container py-12">
        <Breadcrumbs items={breadcrumbs} />
        
        {isMobile && (
          <div className="mb-8">
            <div className="bg-muted rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">Navigate to:</label>
              <select 
                className="w-full p-2 rounded-md border bg-background"
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = e.target.value;
                  }
                }}
                value=""
              >
                <option value="" disabled>Select a page...</option>
                <option value={`/${section}`}>Overview</option>
                {section === 'findings' && (
                  <>
                    <option value="/findings/security">Security Vulnerabilities</option>
                    <option value="/findings/performance">Performance Bottlenecks</option>
                    <option value="/findings/error-handling">Error Handling Deficiencies</option>
                    <option value="/findings/testing">Testing Gaps</option>
                  </>
                )}
                {section === 'code' && (
                  <>
                    <option value="/code/security">Security Code</option>
                    <option value="/code/performance">Performance Code</option>
                    <option value="/code/error-handling">Error Handling Code</option>
                    <option value="/code/testing">Testing Code</option>
                  </>
                )}
                {section === 'improvements' && (
                  <>
                    <option value="/improvements/security">Security Improvements</option>
                    <option value="/improvements/performance">Performance Improvements</option>
                    <option value="/improvements/error-handling">Error Handling Improvements</option>
                    <option value="/improvements/testing">Testing Improvements</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
