import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout 
      title="About - Who Said What"
      description="Learn about our mission to document scandals, comments, and quotes by notable people related to Jews, Israel, and antisemitism with academic-quality citations."
    >
      <Head>
        <title>About - Who Said What</title>
        <meta name="description" content="Learn about our mission to document scandals, comments, and quotes by notable people related to Jews, Israel, and antisemitism with academic-quality citations." />
      </Head>

      <article className="about-page">
        <header className="page-header">
          <h1>About Who Said What</h1>
          <p className="page-subtitle">
            Documenting scandals, comments, and quotes by notable people related to Jews, Israel, and antisemitism
          </p>
        </header>

        <section className="mission-section">
          <div className="content-container">
            <h2>Our Mission</h2>
            <div className="mission-content">
              <p>
                Who Said What is a comprehensive documentation project focused specifically on tracking public statements, 
                scandals, controversies, and incidents involving notable figures and their comments about Jewish people, 
                Israel, or antisemitic content. We maintain strict editorial standards and provide detailed source 
                documentation with academic-quality citations for all documented incidents.
              </p>
              <p>
                Our goal is to create a reliable, neutral resource that documents what was said, when it was said, 
                who said it, and what the consequences were. We focus exclusively on incidents that have a connection 
                to Jewish people, Israel, or antisemitism, providing comprehensive coverage of these specific topics.
              </p>
            </div>
          </div>
        </section>

        <section className="scope-section">
          <div className="content-container">
            <h2>What We Document</h2>
            <div className="scope-grid">
              <div className="scope-item">
                <h3>🗣️ Public Statements</h3>
                <p>
                  Comments, quotes, and statements made by notable figures about Jewish people, Israel, 
                  or containing antisemitic content, whether in interviews, social media, or public appearances.
                </p>
              </div>
              
              <div className="scope-item">
                <h3>📰 Scandals and Controversies</h3>
                <p>
                  High-profile incidents involving public figures where statements about Jews, Israel, 
                  or antisemitic content became the center of public controversy or media attention.
                </p>
              </div>
              
              <div className="scope-item">
                <h3>⚖️ Legal Proceedings</h3>
                <p>
                  Court cases, legal disputes, and official proceedings where statements about Jewish topics 
                  or antisemitic content played a significant role in the case or public discussion.
                </p>
              </div>
              
              <div className="scope-item">
                <h3>💼 Business Consequences</h3>
                <p>
                  Professional and financial impacts resulting from statements about Jews, Israel, or antisemitic content, 
                  including partnership terminations, career effects, and industry responses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <div className="content-container">
            <h2>Editorial Standards</h2>
            <div className="principles-grid">
              <div className="principle-card">
                <h3>📚 Academic-Quality Citations</h3>
                <p>
                  Every factual claim includes clickable citations with links to original sources and archived versions. 
                  We follow academic standards with comprehensive bibliographic information including authors, dates, 
                  URLs, and Wayback Machine archived links.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>⚖️ Strict Neutrality</h3>
                <p>
                  We maintain complete neutrality in our documentation, presenting facts without editorial commentary, 
                  bias, or judgment. Our role is to document what happened, not to advocate for any position or viewpoint.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>🔍 Verified Sources</h3>
                <p>
                  All information is sourced from verified public records, official statements, court documents, 
                  and credible media reports. We clearly indicate the reliability level of each source.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>📊 Complete Context</h3>
                <p>
                  We document the full context of each incident: the original statements, immediate responses, 
                  business consequences, legal proceedings, and long-term impact on careers and public discourse.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="methodology-section">
          <div className="content-container">
            <h2>Our Methodology</h2>
            <div className="methodology-content">
              <h3>Research Process</h3>
              <p>
                Our research process begins with identifying public incidents involving notable figures and statements 
                related to Jewish people, Israel, or antisemitic content. We then conduct comprehensive research using 
                multiple independent sources to verify facts and establish accurate timelines.
              </p>
              
              <h3>Source Verification</h3>
              <p>
                We prioritize primary sources including court documents, official corporate statements, 
                social media posts, and verified media reports from established news organizations. 
                All sources are categorized by reliability level and include both original URLs and archived versions.
              </p>
              
              <h3>Source Reliability Levels</h3>
              <ul>
                <li><strong>Primary Sources:</strong> Original documents, official statements, court records, direct recordings, social media posts</li>
                <li><strong>High Reliability:</strong> Established news organizations, verified reporting, corporate statements, civil rights organizations</li>
                <li><strong>Medium Reliability:</strong> Expert analysis, secondary reporting, opinion pieces from credible sources</li>
              </ul>
              
              <div className="methodology-link">
                <Link href="/methodology" className="btn btn-outline">
                  Read Full Methodology
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="focus-section">
          <div className="content-container">
            <h2>Why This Focus?</h2>
            <div className="focus-content">
              <p>
                Statements about Jewish people, Israel, and antisemitic content often have significant consequences 
                in public discourse, business relationships, and cultural conversations. These incidents frequently 
                become major news stories with lasting impacts on careers, public opinion, and community relations.
              </p>
              
              <p>
                By focusing specifically on this area, we can provide comprehensive, detailed documentation that 
                serves as a reliable reference for researchers, journalists, educators, and the general public 
                who need accurate information about these important incidents.
              </p>
              
              <p>
                Our focused approach allows us to maintain the highest standards of accuracy and completeness 
                while building expertise in this specific area of public discourse documentation.
              </p>
              
              <h3>Historical Importance</h3>
              <p>
                These incidents often become significant moments in cultural and political discourse, influencing 
                public conversations about antisemitism, free speech, and the consequences of public statements. 
                Accurate documentation helps preserve the historical record and provides context for understanding 
                broader patterns and trends.
              </p>
            </div>
          </div>
        </section>

        <section className="transparency-section">
          <div className="content-container">
            <h2>Transparency and Accountability</h2>
            <div className="transparency-content">
              <p>
                We are committed to transparency in our documentation process. All sources are clearly cited 
                with direct links to original materials and archived versions. Every citation includes comprehensive 
                bibliographic information following academic standards.
              </p>
              
              <h3>Citation Standards</h3>
              <p>
                Our citations include author names, publication dates, original URLs, and Wayback Machine archived 
                links with archive dates. This ensures permanent access to source materials and allows readers 
                to verify all information independently.
              </p>
              
              <h3>Updates and Corrections</h3>
              <p>
                We welcome corrections and additional information that can improve the accuracy and completeness 
                of our documentation. When new verified information becomes available, we update our records 
                while maintaining the historical accuracy of the original documentation.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="content-container">
            <h2>Contributing and Corrections</h2>
            <div className="contact-content">
              <p>
                We welcome contributions of additional verified sources, corrections to existing information, 
                and suggestions for new case studies that meet our editorial standards and fall within our 
                focused scope of Jewish-related topics.
              </p>
              
              <h3>How to Contribute</h3>
              <p>
                If you have additional sources, corrections, or suggestions for incidents involving statements 
                about Jews, Israel, or antisemitic content, please contact us through our submission process. 
                We require that all contributions include proper source documentation and meet our standards 
                for verification and neutrality.
              </p>
              
              <div className="contact-actions">
                <Link href="/contact" className="btn btn-primary">
                  Submit Information
                </Link>
                <Link href="/methodology" className="btn btn-outline">
                  Review Guidelines
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>

      <style jsx>{`
        .about-page {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .page-header {
          text-align: center;
          padding: 3rem 0;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 3rem;
        }
        
        .page-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .page-subtitle {
          font-size: 1.3rem;
          color: var(--text-secondary);
          font-weight: 500;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }
        
        .mission-section,
        .scope-section,
        .principles-section,
        .methodology-section,
        .focus-section,
        .transparency-section,
        .contact-section {
          margin-bottom: 4rem;
        }
        
        .content-container h2 {
          font-size: 2.25rem;
          margin-bottom: 2rem;
          color: var(--text-primary);
          text-align: center;
        }
        
        .mission-content p,
        .methodology-content p,
        .focus-content p,
        .transparency-content p,
        .contact-content p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .scope-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .scope-item {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .scope-item h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .scope-item p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        
        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .principle-card {
          background: var(--background-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .principle-card h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .principle-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        
        .methodology-content h3,
        .focus-content h3,
        .transparency-content h3,
        .contact-content h3 {
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .methodology-content h3:first-child,
        .focus-content h3:first-child,
        .transparency-content h3:first-child,
        .contact-content h3:first-child {
          margin-top: 0;
        }
        
        ul {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        li {
          margin-bottom: 0.75rem;
        }
        
        li strong {
          color: var(--text-primary);
        }
        
        .methodology-link,
        .contact-actions {
          margin-top: 2rem;
          text-align: center;
        }
        
        .contact-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .mission-section {
          background: var(--background-primary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        
        .scope-section {
          background: var(--background-secondary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
        }
        
        .principles-section {
          background: var(--background-primary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        
        .methodology-section,
        .focus-section,
        .transparency-section {
          padding: 0 2rem;
        }
        
        .contact-section {
          background: var(--background-tertiary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2.25rem;
          }
          
          .page-subtitle {
            font-size: 1.1rem;
          }
          
          .content-container h2 {
            font-size: 1.875rem;
          }
          
          .scope-grid,
          .principles-grid {
            grid-template-columns: 1fr;
          }
          
          .contact-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .contact-actions .btn {
            width: 100%;
            max-width: 300px;
          }
          
          .mission-section,
          .scope-section,
          .principles-section,
          .contact-section {
            padding: 2rem 1rem;
          }
          
          .methodology-section,
          .focus-section,
          .transparency-section {
            padding: 0 1rem;
          }
        }
      `}</style>
    </Layout>
  )
}
