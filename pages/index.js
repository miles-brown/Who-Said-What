import Head from 'next/head'
import Link from 'next/link'
import { getAllCases } from '../lib/cases'
import { getAllProfiles } from '../lib/profiles'
import { getAllEvents } from '../lib/events'
import Layout from '../components/Layout'
import { format } from 'date-fns'

export default function Home({ allCases, allProfiles, allEvents }) {
  const recentCases = allCases.slice(0, 3)
  const featuredProfiles = allProfiles.slice(0, 4)
  const recentEvents = allEvents.slice(0, 3)

  return (
    <Layout>
      <Head>
        <title>Who Said What - Documenting Statements About Jews, Israel, and Antisemitism</title>
        <meta name="description" content="Comprehensive documentation of scandals, comments, and quotes by notable people related to Jews, Israel, and antisemitism. All information is sourced and verified with academic-quality citations." />
      </Head>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Who Said What</h1>
          <p className="hero-subtitle">
            Documenting scandals, comments, and quotes by notable people related to Jews, Israel, and antisemitism
          </p>
          <p className="hero-description">
            A comprehensive resource for tracking public statements, controversies, and incidents involving notable figures 
            and their comments about Jewish people, Israel, or antisemitic content. We maintain strict editorial standards 
            and provide detailed source documentation with academic-quality citations for all documented incidents.
          </p>
          <div className="hero-actions">
            <Link href="/cases" className="btn btn-primary">
              Browse Case Studies
            </Link>
            <Link href="/events" className="btn btn-outline">
              View Events
            </Link>
            <Link href="/profiles" className="btn btn-outline">
              View Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section">
        <div className="content-container">
          <h2>Our Mission</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Focused Documentation</h3>
              <p>
                We specifically document public statements, scandals, and controversies by notable people 
                related to Jews, Israel, and antisemitism. Every incident is thoroughly researched and verified.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Neutral Presentation</h3>
              <p>
                We maintain strict neutrality, presenting facts without editorial commentary 
                or bias. Our goal is accurate documentation of what was said and the consequences.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Academic Citations</h3>
              <p>
                Every claim includes clickable citations with links to original sources and archived versions. 
                We follow academic standards with comprehensive bibliographic information.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Complete Context</h3>
              <p>
                We document the full context: the original statements, immediate responses, 
                business consequences, and long-term impact on careers and public discourse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="recent-cases">
        <div className="content-container">
          <div className="section-header">
            <h2>Recent Case Studies</h2>
            <p>Latest documented incidents involving statements about Jews, Israel, and antisemitism</p>
          </div>
          
          <div className="cases-grid">
            {recentCases.map((caseStudy) => (
              <Link href={`/cases/${caseStudy.slug}`} key={caseStudy.slug}>
                <article className="case-card">
                  <div className="case-header">
                    <h3>{caseStudy.title}</h3>
                    <time className="case-date">
                      {format(new Date(caseStudy.date), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  <p className="case-excerpt">{caseStudy.excerpt}</p>
                  <div className="case-meta">
                    <span className="case-person">{caseStudy.person}</span>
                    <div className="case-tags">
                      {caseStudy.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          <div className="section-footer">
            <Link href="/cases" className="btn btn-secondary">
              View All Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="featured-profiles">
        <div className="content-container">
          <div className="section-header">
            <h2>Featured Profiles</h2>
            <p>Notable figures and organizations involved in documented incidents related to Jewish topics</p>
          </div>
          
          <div className="profiles-grid">
            {featuredProfiles.map((profile) => (
              <Link href={`/profiles/${profile.slug}`} key={profile.slug}>
                <article className="profile-card">
                  <div className="profile-header">
                    <h3>{profile.name}</h3>
                    <span className={`profile-type badge badge-${profile.type === 'individual' ? 'primary' : 'secondary'}`}>
                      {profile.type === 'individual' ? 'Individual' : 'Organization'}
                    </span>
                  </div>
                  {profile.title && (
                    <p className="profile-title">{profile.title}</p>
                  )}
                  <p className="profile-excerpt">{profile.excerpt}</p>
                  {profile.categories && profile.categories.length > 0 && (
                    <div className="profile-categories">
                      {profile.categories.slice(0, 2).map(category => (
                        <span key={category} className="badge">{category}</span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
          
          <div className="section-footer">
            <Link href="/profiles" className="btn btn-secondary">
              View All Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="content-container">
          <div className="cta-content">
            <h2>Contributing Information</h2>
            <p>
              Have additional sources or corrections? We welcome contributions that help 
              maintain the accuracy and completeness of our documentation.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Submit Information
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
          padding: 4rem 0 5rem;
          text-align: center;
          border-bottom: 1px solid var(--border-primary);
        }
        
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .hero-section h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .hero-description {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .features-section {
          padding: 4rem 0;
          background: var(--background-primary);
        }
        
        .features-section h2 {
          text-align: center;
          margin-bottom: 3rem;
          font-size: 2.5rem;
          color: var(--text-primary);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          text-align: center;
          padding: 2rem;
          background: var(--background-secondary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-primary);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .recent-cases,
        .featured-profiles {
          padding: 4rem 0;
        }
        
        .recent-cases {
          background: var(--background-secondary);
        }
        
        .featured-profiles {
          background: var(--background-primary);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: var(--text-muted);
        }
        
        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .case-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .case-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        
        .case-header {
          margin-bottom: 1rem;
        }
        
        .case-card h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.25rem;
        }
        
        .case-date {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .case-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .case-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .case-person {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .case-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .profile-card {
          background: var(--background-secondary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .profile-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .profile-card h3 {
          margin: 0;
          color: var(--text-primary);
          flex: 1;
        }
        
        .profile-type {
          flex-shrink: 0;
        }
        
        .profile-title {
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .profile-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .profile-categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .section-footer {
          text-align: center;
        }
        
        .cta-section {
          background: var(--accent-primary);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }
        
        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .cta-section h2 {
          color: white;
          margin-bottom: 1rem;
          font-size: 2.5rem;
        }
        
        .cta-section p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        .cta-section .btn {
          background: white;
          color: var(--accent-primary);
          border: 2px solid white;
        }
        
        .cta-section .btn:hover {
          background: transparent;
          color: white;
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.25rem;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-actions .btn {
            width: 100%;
            max-width: 300px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .cases-grid,
          .profiles-grid {
            grid-template-columns: 1fr;
          }
          
          .case-meta {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const allCases = getAllCases()
  const allProfiles = getAllProfiles()
  const allEvents = getAllEvents()
  
  return {
    props: {
      allCases,
      allProfiles,
      allEvents
    }
  }
}
