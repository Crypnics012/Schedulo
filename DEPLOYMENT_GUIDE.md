# Schedulo Pro Audit Website - Deployment Guide

This guide provides instructions for deploying the Schedulo Pro Audit website to various hosting platforms.

## Project Overview

The Schedulo Pro Audit website is a Next.js application that showcases the findings and improvements from a comprehensive audit of the Schedulo Pro social media scheduling platform. The website includes:

- Detailed audit findings across security, performance, error handling, and testing
- Code showcase with syntax highlighting for implemented improvements
- Interactive UI with theme toggling and responsive design
- SEO optimization with metadata, Open Graph images, and sitemap

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the platform built by the creators of Next.js and offers the best integration.

1. Create an account on [Vercel](https://vercel.com) if you don't have one
2. Install the Vercel CLI: `npm install -g vercel`
3. Extract the provided zip file to a local directory
4. Navigate to the project directory in your terminal
5. Run `vercel login` and follow the prompts
6. Run `vercel` to deploy
7. Follow the CLI prompts to configure your project
8. Once deployed, Vercel will provide a URL for your site

### Option 2: Netlify

1. Create an account on [Netlify](https://netlify.com) if you don't have one
2. Extract the provided zip file to a local directory
3. Navigate to the Netlify dashboard
4. Click "New site from Git" or drag and drop the project folder to the Netlify dashboard
5. If using Git, connect your repository and select the project
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Click "Deploy site"

### Option 3: GitHub Pages with GitHub Actions

1. Create a GitHub repository for the project
2. Push the code to the repository
3. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build && npm run export

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: out
```

4. Enable GitHub Pages in your repository settings
5. Set the source to the gh-pages branch

## Local Development

To run the website locally:

1. Extract the provided zip file
2. Navigate to the project directory in your terminal
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open your browser to http://localhost:3000

## Project Structure

- `/src/app`: Next.js pages and routes
- `/src/components`: React components
- `/src/data`: Data files for audit findings and code examples
- `/public`: Static assets
- `/tests`: Playwright tests

## Environment Variables

The following environment variables can be set for production:

- `NEXT_PUBLIC_SITE_URL`: The URL of your deployed website

## Testing

The project includes Playwright tests to verify functionality:

1. Install Playwright: `npx playwright install`
2. Run tests: `npm test`

## Support

If you encounter any issues with deployment, please refer to:

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

## License

This project is provided for your use as part of the Schedulo Pro audit.
