import Head from 'next/head'
import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <Layout 
      title="Privacy Policy - Who Said What"
      description="Privacy policy and data handling practices for Who Said What documentation platform"
    >
      <Head>
        <title>Privacy Policy - Who Said What</title>
        <meta name="description" content="Privacy policy and data handling practices for Who Said What documentation platform" />
      </Head>

      <article className="privacy-page">
        <header className="page-header">
          <h1>Privacy Policy</h1>
          <p className="page-subtitle">
            Last updated: January 15, 2025
          </p>
        </header>

        <section className="privacy-content">
          <h2>Information We Collect</h2>
          <p>
            Who Said What is a documentation platform that focuses on publicly available information. 
            We do not collect personal information from visitors to our website beyond standard 
            web analytics data.
          </p>

          <h3>Website Analytics</h3>
          <p>
            We may use standard web analytics tools to understand how visitors use our site. 
            This may include information such as:
          </p>
          <ul>
            <li>Pages visited and time spent on the site</li>
            <li>General geographic location (country/region level)</li>
            <li>Browser type and device information</li>
            <li>Referring websites</li>
          </ul>

          <h3>Contact Information</h3>
          <p>
            If you contact us through our contact form or email, we collect only the information 
            you voluntarily provide, such as your email address and message content. This information 
            is used solely to respond to your inquiry.
          </p>

          <h2>How We Use Information</h2>
          <p>
            Any information we collect is used for the following purposes:
          </p>
          <ul>
            <li>To improve our website and user experience</li>
            <li>To respond to inquiries and communications</li>
            <li>To ensure the security and proper functioning of our website</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer personal information to third parties. 
            We may share information only in the following circumstances:
          </p>
          <ul>
            <li>When required by law or legal process</li>
            <li>To protect our rights, property, or safety</li>
            <li>With service providers who assist in website operations (under strict confidentiality agreements)</li>
          </ul>

          <h2>Public Information Documentation</h2>
          <p>
            Our primary function is documenting publicly available information about public statements 
            and their consequences. All information we document is:
          </p>
          <ul>
            <li>Already in the public domain</li>
            <li>Sourced from credible, publicly accessible sources</li>
            <li>Presented in accordance with fair use and journalistic standards</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect against unauthorized access, 
            alteration, disclosure, or destruction of information. However, no method of transmission 
            over the internet is 100% secure.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            Our website may use cookies for basic functionality and analytics. You can control 
            cookie settings through your browser preferences. Disabling cookies may affect some 
            website functionality.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to external sources and references. We are not responsible 
            for the privacy practices of these external sites and encourage you to review their 
            privacy policies.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our website is not directed at children under 13, and we do not knowingly collect 
            personal information from children under 13. If we become aware of such collection, 
            we will take steps to delete the information.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this 
            page with an updated revision date. Continued use of our website after changes 
            constitutes acceptance of the updated policy.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions about this privacy policy or our data practices, please contact 
            us through our contact page or at the email address provided there.
          </p>

          <h2>Jurisdiction</h2>
          <p>
            This privacy policy is governed by applicable data protection laws. We comply with 
            relevant privacy regulations including GDPR for European users and CCPA for California residents.
          </p>
        </section>
      </article>

      <style jsx>{`
        .privacy-page {
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
        
        .privacy-content h2 {
          font-size: 1.75rem;
          margin-top: 3rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .privacy-content h2:first-child {
          margin-top: 0;
        }
        
        .privacy-content h3 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .privacy-content p {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .privacy-content ul {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .privacy-content li {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .privacy-page {
            padding: 0 1rem;
          }
          
          .page-header h1 {
            font-size: 2rem;
          }
          
          .privacy-content h2 {
            font-size: 1.5rem;
          }
          
          .privacy-content ul {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  )
}
