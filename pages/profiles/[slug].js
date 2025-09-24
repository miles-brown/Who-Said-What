import Head from 'next/head'
import Link from 'next/link'
import { getAllProfileSlugs, getProfileBySlug } from '../../lib/profiles'
import { getAllCases } from '../../lib/cases'
import Layout from '../../components/Layout'
import { remark } from 'remark'
import html from 'remark-html'
import { format } from 'date-fns'

export default function ProfilePage({ profile, relatedCases, contentHtml }) {
  if (!profile) {
    return (
      <Layout title="Profile Not Found">
        <div className="error-page">
          <h1>Profile Not Found</h1>
          <p>The requested profile could not be found.</p>
          <Link href="/profiles">
            <button className="btn btn-primary">Back to Profiles</button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout 
      title={`${profile.name} - Who Said What`}
      description={profile.excerpt}
    >
      <Head>
        <title>{profile.name} - Who Said What</title>
        <meta name="description" content={profile.excerpt} />
      </Head>

      <article className="profile-article">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="profile-meta">
            <Link href="/profiles" className="back-link">
              ← Back to Profiles
            </Link>
            <span className={`profile-type badge badge-${profile.type === 'individual' ? 'primary' : 'secondary'}`}>
              {profile.type === 'individual' ? 'Individual' : 'Organization'}
            </span>
          </div>
          
          <h1>{profile.name}</h1>
          
          {profile.title && (
            <p className="profile-title">{profile.title}</p>
          )}
          
          {profile.organization && profile.type === 'individual' && (
            <p className="profile-organization">{profile.organization}</p>
          )}
        </header>

        {/* Quick Facts */}
        <section className="quick-facts">
          <h2>Quick Facts</h2>
          <div className="facts-grid">
            {profile.type === 'individual' ? (
              <>
                {profile.birth_date && (
                  <div className="fact-item">
                    <strong>Born:</strong> {format(new Date(profile.birth_date), 'MMMM d, yyyy')}
                  </div>
                )}
                {profile.nationality && (
                  <div className="fact-item">
                    <strong>Nationality:</strong> {profile.nationality}
                  </div>
                )}
                {profile.occupation && (
                  <div className="fact-item">
                    <strong>Occupation:</strong> {profile.occupation}
                  </div>
                )}
                {profile.known_for && profile.known_for.length > 0 && (
                  <div className="fact-item">
                    <strong>Known For:</strong> {profile.known_for.join(', ')}
                  </div>
                )}
              </>
            ) : (
              <>
                {profile.founded && (
                  <div className="fact-item">
                    <strong>Founded:</strong> {profile.founded}
                  </div>
                )}
                {profile.headquarters && (
                  <div className="fact-item">
                    <strong>Headquarters:</strong> {profile.headquarters}
                  </div>
                )}
                {profile.industry && (
                  <div className="fact-item">
                    <strong>Industry:</strong> {profile.industry}
                  </div>
                )}
              </>
            )}
            
            {profile.categories && profile.categories.length > 0 && (
              <div className="fact-item categories">
                <strong>Categories:</strong>
                <div className="category-tags">
                  {profile.categories.map(category => (
                    <span key={category} className="badge">{category}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="profile-content">
          <div 
            className="content-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </section>

        {/* Related Cases */}
        {relatedCases.length > 0 && (
          <section className="related-cases">
            <h2>Related Case Studies</h2>
            <p className="section-description">
              Case studies and documented incidents involving {profile.name}:
            </p>
            
            <div className="cases-grid">
              {relatedCases.map((caseStudy) => (
                <Link href={`/cases/${caseStudy.slug}`} key={caseStudy.slug}>
                  <div className="case-card">
                    <h3>{caseStudy.title}</h3>
                    <p className="case-date">
                      {format(new Date(caseStudy.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="case-excerpt">{caseStudy.excerpt}</p>
                    <div className="case-tags">
                      {caseStudy.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sources and Documentation */}
        {profile.sources && profile.sources.length > 0 && (
          <section className="sources">
            <h2>Sources and References</h2>
            <ul className="sources-list">
              {profile.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <style jsx>{`
        .profile-article {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-header {
          text-align: center;
          padding: 2rem 0;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 2rem;
        }
        
        .profile-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .back-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
        
        .profile-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .profile-title {
          font-size: 1.2rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .profile-organization {
          color: var(--text-muted);
          font-size: 1rem;
        }
        
        .quick-facts {
          background: var(--background-primary);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .quick-facts h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .facts-grid {
          display: grid;
          gap: 1rem;
        }
        
        .fact-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .fact-item strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .categories .category-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .profile-content {
          margin-bottom: 3rem;
        }
        
        .content-body {
          line-height: 1.7;
          color: var(--text-secondary);
        }
        
        .content-body h2 {
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .content-body h3 {
          color: var(--text-primary);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .content-body p {
          margin-bottom: 1rem;
        }
        
        .content-body ul, .content-body ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .content-body li {
          margin-bottom: 0.5rem;
        }
        
        .related-cases {
          margin-bottom: 3rem;
        }
        
        .related-cases h2 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .section-description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        
        .cases-grid {
          display: grid;
          gap: 1.5rem;
        }
        
        .case-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .case-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .case-card h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .case-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .case-excerpt {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .case-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .sources {
          background: var(--background-tertiary);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
        }
        
        .sources h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .sources-list {
          list-style: none;
          padding: 0;
        }
        
        .sources-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-primary);
          color: var(--text-secondary);
        }
        
        .sources-list li:last-child {
          border-bottom: none;
        }
        
        .error-page {
          text-align: center;
          padding: 3rem;
        }
        
        @media (max-width: 768px) {
          .profile-meta {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .profile-header h1 {
            font-size: 2rem;
          }
          
          .facts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllProfileSlugs()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const profile = getProfileBySlug(params.slug)
  
  if (!profile) {
    return {
      notFound: true
    }
  }

  // Process markdown content
  const processedContent = await remark()
    .use(html)
    .process(profile.content)
  const contentHtml = processedContent.toString()

  // Find related cases
  const allCases = getAllCases()
  const relatedCases = allCases.filter(caseStudy => 
    caseStudy.person === profile.name ||
    (caseStudy.tags && caseStudy.tags.some(tag => 
      profile.tags && profile.tags.includes(tag)
    ))
  )

  return {
    props: {
      profile,
      relatedCases,
      contentHtml
    }
  }
}
