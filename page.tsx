import { MainLayout } from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Schedulo Pro Audit
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              A comprehensive audit and enhancement of a no-code web app for bulk scheduling and multi-account management across social media platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/findings" className="btn-primary">
                View Findings
              </a>
              <a href="/improvements" className="btn-secondary">
                See Improvements
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Comprehensive Audit & Enhancement</h2>
              <p className="text-muted-foreground mb-4">
                This project presents a thorough examination of Schedulo Pro, identifying critical gaps in security, performance, error handling, and testing that could impact reliability, scalability, and user experience.
              </p>
              <p className="text-muted-foreground mb-6">
                Based on these findings, we implemented significant improvements to address the most critical issues, enhancing the application's production-readiness.
              </p>
              <a href="/audit-methodology" className="text-primary font-medium hover:underline">
                Learn about our methodology →
              </a>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Key Areas Addressed</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Security Vulnerabilities</span>
                    <p className="text-sm text-muted-foreground">Insecure token storage, missing API rate limiting, inadequate authentication</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Performance Bottlenecks</span>
                    <p className="text-sm text-muted-foreground">Inefficient bulk upload, missing chunked upload, no progress tracking</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Error Handling Deficiencies</span>
                    <p className="text-sm text-muted-foreground">Inadequate error recovery, missing circuit breakers, limited retry logic</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 16 4-4-4-4" />
                      <path d="m6 8-4 4 4 4" />
                      <path d="m14.5 4-5 16" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Testing Gaps</span>
                    <p className="text-sm text-muted-foreground">Missing automated tests, no mock APIs, limited test coverage</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Improvements Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4">Critical Improvements Implemented</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We implemented several critical improvements to address the most significant gaps identified during the audit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="M7 12h10" />
                  <path d="M12 7v10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Security Enhancements</h3>
              <p className="text-muted-foreground mb-4 flex-1">
                Implemented secure token management, Airtable token storage, and API rate limiting to protect user data.
              </p>
              <a href="/improvements/security" className="text-primary font-medium hover:underline mt-auto">
                View details →
              </a>
            </div>
            <div className="card flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 14-6 6h9v-3" />
                  <path d="M18.37 3.63 8 14l3 3L21.37 6.63a2.12 2.12 0 1 0-3-3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Optimizations</h3>
              <p className="text-muted-foreground mb-4 flex-1">
                Developed optimized bulk upload processor with chunked uploads, concurrent processing, and progress tracking.
              </p>
              <a href="/improvements/performance" className="text-primary font-medium hover:underline mt-auto">
                View details →
              </a>
            </div>
            <div className="card flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M3.58 5.96A2 2 0 0 1 5.32 4h13.36a2 2 0 0 1 1.74 1.96l.77 12.12a2 2 0 0 1-2 2.12H4.82a2 2 0 0 1-2-2.12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Error Handling Solutions</h3>
              <p className="text-muted-foreground mb-4 flex-1">
                Created comprehensive error recovery system with circuit breakers, retry mechanisms, and error categorization.
              </p>
              <a href="/improvements/error-handling" className="text-primary font-medium hover:underline mt-auto">
                View details →
              </a>
            </div>
            <div className="card flex flex-col h-full">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="m3 9 3 3-3 3" />
                  <path d="M14 8h8" />
                  <path d="M22 16h-8" />
                  <path d="M18 4v4" />
                  <path d="M18 16v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Testing Framework</h3>
              <p className="text-muted-foreground mb-4 flex-1">
                Implemented automated testing framework with unit tests, integration tests, and mock APIs for comprehensive testing.
              </p>
              <a href="/improvements/testing" className="text-primary font-medium hover:underline mt-auto">
                View details →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Code Showcase Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4">Code Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the production-ready code implementations that address the critical gaps identified in the audit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Security Code</h3>
              <div className="bg-muted rounded-lg p-4 mb-4 overflow-hidden text-sm">
                <pre className="text-xs overflow-x-auto">
                  <code>
{`class SecureTokenManager {
  // Encrypt tokens using AES-256-GCM
  encryptToken(token, userId, platform) {
    // Implementation details...
  }
  
  // Decrypt tokens for use
  decryptToken(tokenData) {
    // Implementation details...
  }
  
  // Store tokens securely
  async storeToken(token, userId, platform, metadata) {
    // Implementation details...
  }
}`}
                  </code>
                </pre>
              </div>
              <a href="/code/security" className="text-primary font-medium hover:underline">
                View full code examples →
              </a>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Error Handling Code</h3>
              <div className="bg-muted rounded-lg p-4 mb-4 overflow-hidden text-sm">
                <pre className="text-xs overflow-x-auto">
                  <code>
{`class CircuitBreaker {
  // Execute with circuit breaking
  async exec(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this._transitionState('HALF-OPEN');
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await this.fn(...args);
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure(error);
      throw error;
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <a href="/code/error-handling" className="text-primary font-medium hover:underline">
                View full code examples →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-white">Ready to Explore the Full Audit?</h2>
            <p className="text-white/80 text-lg mb-8">
              Dive deeper into our findings, improvements, and code implementations to see how we enhanced Schedulo Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/findings" className="bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-lg transition-colors">
                Start with Findings
              </a>
              <a href="/code" className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                View Code Examples
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
