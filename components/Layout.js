import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children, title = "Who Said What", description = "Factual documentation of public statements and responses" }) {
  const router = useRouter()
  
  const isActive = (pathname) => {
    return router.pathname === pathname
  }

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://miles-brown.github.io/Who-Said-What${router.asPath}`} />
      </Head>

      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        <nav role="navigation" aria-label="Main navigation">
          <div className="nav-brand">
            <Link href="/">
              <h1>Who Said What</h1>
            </Link>
          </div>
          
          <div className="nav-links">
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
            <Link href="/cases" className={isActive('/cases') ? 'active' : ''}>
              Cases
            </Link>
            <Link href="/profiles" className={isActive('/profiles') ? 'active' : ''}>
              Profiles
            </Link>
            <Link href="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
            <Link href="/methodology" className={isActive('/methodology') ? 'active' : ''}>
              Methodology
            </Link>
            <Link href="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" role="main">
        {children}
      </main>

      <footer role="contentinfo">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About This Project</h4>
            <p>
              Who Said What provides neutral, fact-based documentation of public statements 
              and responses. All information is sourced and verified for accuracy.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <p>
              <Link href="/methodology">Research Methodology</Link><br />
              <Link href="/cases">Case Studies</Link><br />
              <Link href="/profiles">Public Figures</Link><br />
              <Link href="/contact">Submit Information</Link>
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Standards</h4>
            <p>
              We maintain strict editorial standards, cite all sources, 
              and present information without bias. Our goal is factual 
              accuracy and neutral documentation.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              Questions about our methodology or sources? 
              <Link href="/contact"> Get in touch</Link> with our research team.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Who Said What. All rights reserved. | 
            <Link href="/privacy"> Privacy Policy</Link> | 
            <Link href="/terms"> Terms of Use</Link>
          </p>
        </div>
      </footer>

      <style jsx>{`
        .nav-links .active {
          color: var(--accent-primary);
          font-weight: 600;
        }
        
        .nav-links .active::after {
          width: 100%;
        }
        
        .footer-section a {
          color: var(--background-primary);
          text-decoration: underline;
        }
        
        .footer-section a:hover {
          color: var(--accent-primary);
        }
        
        .footer-bottom a {
          color: var(--text-muted);
          margin: 0 0.5rem;
        }
        
        .footer-bottom a:hover {
          color: var(--background-primary);
        }
      `}</style>
    </div>
  )
}
