import Head from 'next/head'
import Layout from '../components/Layout'

export default function Terms() {
  return (
    <Layout 
      title="Terms of Use - Who Said What"
      description="Terms of use and conditions for accessing and using the Who Said What documentation platform"
    >
      <Head>
        <title>Terms of Use - Who Said What</title>
        <meta name="description" content="Terms of use and conditions for accessing and using the Who Said What documentation platform" />
      </Head>

      <article className="terms-page">
        <header className="page-header">
          <h1>Terms of Use</h1>
          <p className="page-subtitle">
            Last updated: January 15, 2025
          </p>
        </header>

        <section className="terms-content">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using the Who Said What website, you accept and agree to be bound by 
            these Terms of Use. If you do not agree to these terms, please do not use our website.
          </p>

          <h2>Purpose and Scope</h2>
          <p>
            Who Said What is a documentation platform that provides factual information about 
            public statements, controversies, and their documented consequences. Our content is 
            based on publicly available sources and is presented for informational and educational purposes.
          </p>

          <h3>Educational Use</h3>
          <p>
            The information provided on this website is intended for educational, research, and 
            informational purposes. It is not intended as legal advice, professional guidance, 
            or advocacy for any particular position or viewpoint.
          </p>

          <h2>Content Standards and Accuracy</h2>
          <p>
            We strive to maintain high standards of accuracy and neutrality in our documentation. 
            However, we make no warranties about the completeness, accuracy, or reliability of 
            the information provided.
          </p>

          <h3>Source-Based Information</h3>
          <p>
            All content is based on publicly available sources, which we cite and reference. 
            Users are encouraged to verify information independently and consult original sources 
            when making important decisions based on our documentation.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The compilation, organization, and presentation of information on this website is 
            protected by copyright. However, we respect fair use principles and the public 
            nature of the information we document.
          </p>

          <h3>Fair Use</h3>
          <p>
            Our use of publicly available information, quotes, and documented statements falls 
            under fair use provisions for educational and informational purposes. We provide 
            proper attribution and sourcing for all documented information.
          </p>

          <h2>User Conduct</h2>
          <p>
            Users of this website agree to:
          </p>
          <ul>
            <li>Use the website for lawful purposes only</li>
            <li>Respect the educational and informational nature of the content</li>
            <li>Not attempt to compromise the security or functionality of the website</li>
            <li>Not use automated systems to access or download content without permission</li>
          </ul>

          <h2>Submissions and Contributions</h2>
          <p>
            If you submit information, corrections, or suggestions to us, you grant us the right 
            to use, modify, and incorporate such submissions into our documentation, subject to 
            our editorial standards and verification processes.
          </p>

          <h3>Verification Requirements</h3>
          <p>
            All submissions must be accompanied by proper source documentation and must meet our 
            standards for verification and neutrality. We reserve the right to reject submissions 
            that do not meet these standards.
          </p>

          <h2>Disclaimers</h2>
          <p>
            The information on this website is provided "as is" without warranties of any kind. 
            We disclaim all warranties, express or implied, including but not limited to warranties 
            of accuracy, completeness, or fitness for a particular purpose.
          </p>

          <h3>No Professional Advice</h3>
          <p>
            The content on this website does not constitute legal, professional, or personal advice. 
            Users should consult appropriate professionals for advice specific to their situations.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Who Said What and its operators shall not be 
            liable for any direct, indirect, incidental, consequential, or punitive damages arising 
            from the use of this website or its content.
          </p>

          <h2>External Links and References</h2>
          <p>
            Our website contains links to external sources and references. We are not responsible 
            for the content, accuracy, or availability of external websites. Links are provided 
            for reference and verification purposes only.
          </p>

          <h2>Privacy and Data Protection</h2>
          <p>
            Our collection and use of any personal information is governed by our Privacy Policy, 
            which is incorporated into these Terms of Use by reference.
          </p>

          <h2>Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be posted 
            on this page with an updated revision date. Continued use of the website after changes 
            constitutes acceptance of the modified terms.
          </p>

          <h2>Content Removal and Corrections</h2>
          <p>
            We are committed to accuracy and will correct errors when brought to our attention 
            with proper documentation. We may also remove or modify content if required by law 
            or if we determine it no longer meets our editorial standards.
          </p>

          <h3>Correction Process</h3>
          <p>
            Requests for corrections must be submitted through our contact process and must include 
            proper source documentation supporting the requested changes.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Use are governed by applicable law. Any disputes arising from the use 
            of this website will be resolved in accordance with applicable legal procedures.
          </p>

          <h2>Severability</h2>
          <p>
            If any provision of these Terms of Use is found to be unenforceable, the remaining 
            provisions will continue to be valid and enforceable.
          </p>

          <h2>Contact Information</h2>
          <p>
            Questions about these Terms of Use should be directed to us through our contact page. 
            We will respond to inquiries in a timely manner.
          </p>
        </section>
      </article>

      <style jsx>{`
        .terms-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .page-header {
          text-align: center;
          padding: 3rem 0;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 3rem;
        }
        
        .page-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .page-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
        }
        
        .terms-content h2 {
          font-size: 1.75rem;
          margin-top: 3rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .terms-content h2:first-child {
          margin-top: 0;
        }
        
        .terms-content h3 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .terms-content p {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .terms-content ul {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .terms-content li {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .terms-page {
            padding: 0 1rem;
          }
          
          .page-header h1 {
            font-size: 2rem;
          }
          
          .terms-content h2 {
            font-size: 1.5rem;
          }
          
          .terms-content ul {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  )
}
