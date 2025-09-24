import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout 
      title="About - Who Said What"
      description="Learn about our mission, methodology, and commitment to neutral documentation of public statements and responses"
    >
      <Head>
        <title>About - Who Said What</title>
        <meta name="description" content="Learn about our mission, methodology, and commitment to neutral documentation of public statements and responses" />
      </Head>

      <article className="about-page">
        <header className="page-header">
          <h1>About Who Said What</h1>
          <p className="page-subtitle">
            Committed to factual documentation and neutral presentation of public statements
          </p>
        </header>

        <section className="mission-section">
          <div className="content-container">
            <h2>Our Mission</h2>
            <div className="mission-content">
              <p>
                Who Said What serves as a comprehensive, neutral resource for documenting public statements, 
                allegations, and responses related to controversial incidents. Our primary goal is to create 
                an accurate historical record based on verified sources and factual evidence.
              </p>
              <p>
                We believe that access to accurate information is essential for informed public discourse. 
                By maintaining strict editorial standards and presenting information without bias, we aim to 
                contribute to a more informed understanding of significant public controversies and their impacts.
              </p>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <div className="content-container">
            <h2>Our Principles</h2>
            <div className="principles-grid">
              <div className="principle-card">
                <h3>Factual Accuracy</h3>
                <p>
                  Every statement, date, and claim is verified through multiple credible sources. 
                  We prioritize primary sources such as court documents, official statements, 
                  and verified media reports over speculation or hearsay.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>Neutral Presentation</h3>
                <p>
                  We present information without editorial commentary, bias, or advocacy. 
                  Our role is to document what was said and what happened, not to judge 
                  or interpret the significance of events.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>Comprehensive Documentation</h3>
                <p>
                  We document not only the original statements but also the responses, 
                  consequences, and broader context. This includes industry reactions, 
                  legal outcomes, and long-term impacts.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>Source Transparency</h3>
                <p>
                  All information is clearly sourced and referenced. We provide citations 
                  for every claim, allowing readers to verify information independently 
                  and understand the basis for our documentation.
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
                Our research process begins with identifying significant public statements or incidents 
                that have generated substantial public attention or consequences. We then conduct 
                comprehensive research using multiple independent sources to verify facts and establish 
                accurate timelines.
              </p>
              
              <h3>Source Verification</h3>
              <p>
                We prioritize primary sources including court documents, official corporate statements, 
                government records, and verified media reports from established news organizations. 
                Secondary sources are used only when properly attributed and cross-referenced with 
                primary documentation.
              </p>
              
              <h3>Editorial Standards</h3>
              <p>
                All content undergoes careful review to ensure factual accuracy and neutral presentation. 
                We avoid speculation, opinion, or interpretation, focusing instead on documenting what 
                can be verified through credible sources. Updates and corrections are made when new 
                verified information becomes available.
              </p>
              
              <div className="methodology-link">
                <Link href="/methodology" className="btn btn-outline">
                  Read Full Methodology
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="scope-section">
          <div className="content-container">
            <h2>Scope and Focus</h2>
            <div className="scope-content">
              <h3>What We Document</h3>
              <p>
                We focus on documenting public statements and incidents that have generated significant 
                public attention, controversy, or consequences. This includes statements made by public 
                figures, corporate responses, legal proceedings, and documented impacts on careers, 
                businesses, or public discourse.
              </p>
              
              <h3>What We Don't Do</h3>
              <p>
                We do not engage in investigative journalism, opinion writing, or advocacy. We do not 
                speculate about private matters, undocumented claims, or the motivations behind public 
                statements. Our focus is strictly on what can be verified through public records and 
                credible sources.
              </p>
              
              <h3>Profile System</h3>
              <p>
                Our profile system provides neutral biographical information about individuals and 
                organizations featured in our case studies. These profiles focus on publicly available 
                information and documented facts rather than personal opinions or unverified claims.
              </p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="content-container">
            <h2>Our Approach to Neutrality</h2>
            <div className="neutrality-content">
              <p>
                Maintaining neutrality in documenting controversial topics requires careful attention 
                to language, sourcing, and presentation. We strive to present information in a way 
                that allows readers to form their own conclusions based on verified facts.
              </p>
              
              <h3>Language and Tone</h3>
              <p>
                We use neutral, factual language that avoids loaded terms or emotional appeals. 
                When documenting statements that contain offensive or controversial content, we 
                present them accurately while maintaining professional standards of presentation.
              </p>
              
              <h3>Balanced Documentation</h3>
              <p>
                We document responses and consequences alongside original statements, providing 
                context for understanding the full scope of incidents and their impacts. This 
                includes both immediate reactions and long-term consequences.
              </p>
              
              <h3>Ongoing Updates</h3>
              <p>
                We update our documentation when significant new verified information becomes 
                available. This ensures that our records remain current and comprehensive while 
                maintaining historical accuracy.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="content-container">
            <h2>Contributing and Corrections</h2>
            <div className="contact-content">
              <p>
                We welcome contributions of additional verified sources, corrections to existing 
                information, and suggestions for new case studies that meet our editorial standards. 
                All submissions are carefully reviewed and verified before inclusion.
              </p>
              
              <h3>How to Contribute</h3>
              <p>
                If you have additional sources, corrections, or suggestions, please contact us 
                through our submission process. We require that all contributions include proper 
                source documentation and meet our standards for verification and neutrality.
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
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .mission-section,
        .principles-section,
        .methodology-section,
        .scope-section,
        .team-section,
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
        .scope-content p,
        .neutrality-content p,
        .contact-content p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .principles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .principle-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .principle-card h3 {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        
        .principle-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .methodology-content h3,
        .scope-content h3,
        .neutrality-content h3,
        .contact-content h3 {
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .methodology-content h3:first-child,
        .scope-content h3:first-child,
        .neutrality-content h3:first-child,
        .contact-content h3:first-child {
          margin-top: 0;
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
        
        .principles-section {
          background: var(--background-secondary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
        }
        
        .methodology-section,
        .scope-section,
        .team-section {
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
          
          .content-container h2 {
            font-size: 1.875rem;
          }
          
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
          .principles-section,
          .contact-section {
            padding: 2rem 1rem;
          }
          
          .methodology-section,
          .scope-section,
          .team-section {
            padding: 0 1rem;
          }
        }
      `}</style>
    </Layout>
  )
}
