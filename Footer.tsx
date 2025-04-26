export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-space-grotesk font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Schedulo Pro
              </span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                Audit
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              A comprehensive audit of Schedulo Pro, a no-code web app for bulk scheduling and multi-account management across social media platforms.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-4">Audit Sections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/audit-methodology" className="text-muted-foreground hover:text-primary transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="/findings" className="text-muted-foreground hover:text-primary transition-colors">
                  Findings
                </a>
              </li>
              <li>
                <a href="/improvements" className="text-muted-foreground hover:text-primary transition-colors">
                  Improvements
                </a>
              </li>
              <li>
                <a href="/code" className="text-muted-foreground hover:text-primary transition-colors">
                  Code Showcase
                </a>
              </li>
              <li>
                <a href="/recommendations" className="text-muted-foreground hover:text-primary transition-colors">
                  Recommendations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About the Audit
                </a>
              </li>
              <li>
                <a href="https://github.com/schedulo-pro" className="text-muted-foreground hover:text-primary transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://nextjs.org" className="text-muted-foreground hover:text-primary transition-colors">
                  Built with Next.js
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Schedulo Pro Audit. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
