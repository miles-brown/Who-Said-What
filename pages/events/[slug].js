import Head from 'next/head'
import Link from 'next/link'
import { getAllEventSlugs, getEventBySlug, getSubEvents, getRelatedEvents } from '../../lib/events'
import { getAllCases } from '../../lib/cases'
import { getAllProfiles } from '../../lib/profiles'
import Layout from '../../components/Layout'
import { remark } from 'remark'
import html from 'remark-html'
import { format, formatDistanceToNow } from 'date-fns'

export default function EventPage({ event, subEvents, relatedEvents, linkedCases, linkedProfiles, contentHtml }) {
  if (!event) {
    return (
      <Layout title="Event Not Found">
        <div className="error-page">
          <h1>Event Not Found</h1>
          <p>The requested event could not be found.</p>
          <Link href="/events">
            <button className="btn btn-primary">Back to Events</button>
          </Link>
        </div>
      </Layout>
    )
  }

  const formatDuration = () => {
    if (!event.end_date) return null
    
    const start = new Date(event.event_date)
    const end = new Date(event.end_date)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day'
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
    return `${Math.round(diffDays / 365)} years`
  }

  return (
    <Layout 
      title={`${event.title} - Who Said What`}
      description={event.excerpt}
    >
      <Head>
        <title>{event.title} - Who Said What</title>
        <meta name="description" content={event.excerpt} />
      </Head>

      <article className="event-article">
        {/* Event Header */}
        <header className="event-header">
          <div className="header-navigation">
            <Link href="/events" className="back-link">
              ← Back to Events
            </Link>
            <div className="event-badges">
              <span className="event-type-badge">
                {event.event_type.replace('_', ' ')}
              </span>
              {event.is_milestone && (
                <span className="milestone-badge">
                  Key Event
                </span>
              )}
            </div>
          </div>
          
          <h1>{event.title}</h1>
          
          {event.summary && (
            <p className="event-summary">{event.summary}</p>
          )}
        </header>

        {/* Event Details */}
        <section className="event-details">
          <h2>Event Information</h2>
          <div className="details-container">
            <div className="detail-row">
              <strong>Date:</strong> 
              <div className="detail-content">
                <time dateTime={event.event_date}>
                  {format(new Date(event.event_date), 'MMMM d, yyyy')}
                </time>
                <span className="time-context">
                  ({formatDistanceToNow(new Date(event.event_date), { addSuffix: true })})
                </span>
              </div>
            </div>
            
            {event.end_date && (
              <div className="detail-row">
                <strong>End Date:</strong> 
                <div className="detail-content">
                  <time dateTime={event.end_date}>
                    {format(new Date(event.end_date), 'MMMM d, yyyy')}
                  </time>
                </div>
              </div>
            )}
            
            {formatDuration() && (
              <div className="detail-row">
                <strong>Duration:</strong> 
                <div className="detail-content">{formatDuration()}</div>
              </div>
            )}
            
            {event.location && (
              <div className="detail-row">
                <strong>Location:</strong> 
                <div className="detail-content">{event.location}</div>
              </div>
            )}
            
            <div className="detail-row">
              <strong>Type:</strong> 
              <div className="detail-content">{event.event_type.replace('_', ' ')}</div>
            </div>
            
            {event.participants && event.participants.length > 0 && (
              <div className="detail-row">
                <strong>Key Participants:</strong>
                <div className="detail-content">
                  <div className="participants-list">
                    {event.participants.map(participant => (
                      <span key={participant} className="participant-item">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {event.categories && event.categories.length > 0 && (
              <div className="detail-row">
                <strong>Categories:</strong>
                <div className="detail-content">
                  <div className="categories-list">
                    {event.categories.map(category => (
                      <span key={category} className="category-item">{category}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Parent Event */}
        {event.parent_event && (
          <section className="parent-event-section">
            <h2>Part of Larger Event</h2>
            <p>This event is part of a larger incident or series of related events.</p>
            <Link href={`/events/${event.parent_event}`} className="btn btn-outline">
              View Main Event
            </Link>
          </section>
        )}

        {/* Main Content */}
        <section className="event-content">
          <div 
            className="content-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </section>

        {/* Sub-Events */}
        {subEvents.length > 0 && (
          <section className="related-section">
            <h2>Related Events</h2>
            <p className="section-description">
              Events that occurred as part of or in response to this incident:
            </p>
            
            <div className="related-events-grid">
              {subEvents.map((subEvent) => (
                <Link href={`/events/${subEvent.slug}`} key={subEvent.slug}>
                  <div className="related-event-card">
                    <h3>{subEvent.title}</h3>
                    <time className="event-date">
                      {format(new Date(subEvent.event_date), 'MMMM d, yyyy')}
                    </time>
                    <p className="event-excerpt">{subEvent.excerpt}</p>
                    <div className="event-meta">
                      <span className="event-type-tag">
                        {subEvent.event_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="related-section">
            <h2>Connected Events</h2>
            <p className="section-description">
              Other events connected to or influenced by this incident:
            </p>
            
            <div className="related-events-grid">
              {relatedEvents.map((relatedEvent) => (
                <Link href={`/events/${relatedEvent.slug}`} key={relatedEvent.slug}>
                  <div className="related-event-card">
                    <h3>{relatedEvent.title}</h3>
                    <time className="event-date">
                      {format(new Date(relatedEvent.event_date), 'MMMM d, yyyy')}
                    </time>
                    <p className="event-excerpt">{relatedEvent.excerpt}</p>
                    <div className="event-meta">
                      <span className="event-type-tag">
                        {relatedEvent.event_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Linked Case Studies */}
        {linkedCases.length > 0 && (
          <section className="linked-section">
            <h2>Related Case Studies</h2>
            <p className="section-description">
              Detailed case studies that document this event or its consequences:
            </p>
            
            <div className="linked-grid">
              {linkedCases.map((caseStudy) => (
                <Link href={`/cases/${caseStudy.slug}`} key={caseStudy.slug}>
                  <div className="linked-card case-card">
                    <h3>{caseStudy.title}</h3>
                    <p className="linked-date">
                      {format(new Date(caseStudy.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="linked-excerpt">{caseStudy.excerpt}</p>
                    <div className="linked-tags">
                      {caseStudy.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-item">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Linked Profiles */}
        {linkedProfiles.length > 0 && (
          <section className="linked-section">
            <h2>Related Profiles</h2>
            <p className="section-description">
              Profiles of individuals and organizations involved in this event:
            </p>
            
            <div className="linked-grid">
              {linkedProfiles.map((profile) => (
                <Link href={`/profiles/${profile.slug}`} key={profile.slug}>
                  <div className="linked-card profile-card">
                    <div className="profile-header">
                      <h3>{profile.name}</h3>
                      <span className="profile-type-tag">
                        {profile.type}
                      </span>
                    </div>
                    {profile.title && (
                      <p className="profile-title">{profile.title}</p>
                    )}
                    <p className="linked-excerpt">{profile.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sources and Documentation */}
        {event.sources && event.sources.length > 0 && (
          <section className="sources-section">
            <h2>Sources and References</h2>
            <div className="sources-container">
              {event.sources.map((source, index) => (
                <div key={index} className="source-item">
                  {source}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <style jsx>{`
        .event-article {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .event-header {
          text-align: center;
          padding: 2rem 0 3rem;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 3rem;
        }
        
        .header-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .back-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        
        .back-link:hover {
          background: var(--background-secondary);
        }
        
        .event-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .event-type-badge,
        .milestone-badge {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .event-type-badge {
          background: var(--accent-primary);
          color: white;
        }
        
        .milestone-badge {
          background: var(--accent-warning);
          color: white;
        }
        
        .event-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          line-height: 1.2;
        }
        
        .event-summary {
          font-size: 1.2rem;
          color: var(--text-secondary);
          font-weight: 500;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }
        
        .event-details {
          background: var(--background-primary);
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 3rem;
          box-shadow: var(--shadow-sm);
        }
        
        .event-details h2 {
          margin-bottom: 2rem;
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .details-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .detail-row strong {
          color: var(--text-primary);
          font-weight: 600;
          min-width: 120px;
          flex-shrink: 0;
        }
        
        .detail-content {
          flex: 1;
          color: var(--text-secondary);
        }
        
        .time-context {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-left: 0.5rem;
        }
        
        .participants-list,
        .categories-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .participant-item,
        .category-item {
          background: var(--background-secondary);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-primary);
          border: 1px solid var(--border-primary);
        }
        
        .parent-event-section {
          background: var(--background-tertiary);
          padding: 2rem;
          border-radius: var(--radius-lg);
          margin-bottom: 3rem;
          text-align: center;
        }
        
        .parent-event-section h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .parent-event-section p {
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }
        
        .event-content {
          margin-bottom: 3rem;
        }
        
        .content-body {
          line-height: 1.7;
          color: var(--text-secondary);
        }
        
        .content-body h2 {
          color: var(--text-primary);
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        
        .content-body h3 {
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        
        .content-body p {
          margin-bottom: 1.5rem;
        }
        
        .content-body ul, .content-body ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .content-body li {
          margin-bottom: 0.75rem;
        }
        
        .related-section,
        .linked-section {
          margin-bottom: 3rem;
        }
        
        .related-section h2,
        .linked-section h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .section-description {
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .related-events-grid,
        .linked-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        .related-event-card,
        .linked-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 2rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .related-event-card:hover,
        .linked-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .related-event-card h3,
        .linked-card h3 {
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.2rem;
        }
        
        .event-date,
        .linked-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .event-excerpt,
        .linked-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .event-meta,
        .linked-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .event-type-tag,
        .tag-item {
          background: var(--background-secondary);
          color: var(--text-primary);
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          border: 1px solid var(--border-primary);
          text-transform: capitalize;
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .profile-header h3 {
          margin: 0;
          flex: 1;
        }
        
        .profile-type-tag {
          background: var(--accent-secondary);
          color: white;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          text-transform: capitalize;
          flex-shrink: 0;
        }
        
        .profile-title {
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .sources-section {
          background: var(--background-tertiary);
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
        }
        
        .sources-section h2 {
          margin-bottom: 2rem;
          color: var(--text-primary);
        }
        
        .sources-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .source-item {
          padding: 1rem;
          background: var(--background-primary);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          border-left: 4px solid var(--accent-primary);
        }
        
        .error-page {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .error-page h1 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .error-page p {
          margin-bottom: 2rem;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .event-article {
            padding: 0 0.5rem;
          }
          
          .header-navigation {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .event-header h1 {
            font-size: 2rem;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .detail-row strong {
            min-width: auto;
          }
          
          .related-events-grid,
          .linked-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .event-details,
          .sources-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllEventSlugs()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const event = getEventBySlug(params.slug)
  
  if (!event) {
    return {
      notFound: true
    }
  }

  // Process markdown content
  const processedContent = await remark()
    .use(html)
    .process(event.content)
  const contentHtml = processedContent.toString()

  // Get sub-events
  const subEvents = getSubEvents(params.slug)

  // Get related events
  const relatedEvents = getRelatedEvents(params.slug)

  // Get linked cases
  const allCases = getAllCases()
  const linkedCases = allCases.filter(caseStudy => 
    event.linked_cases && event.linked_cases.includes(caseStudy.slug)
  )

  // Get linked profiles
  const allProfiles = getAllProfiles()
  const linkedProfiles = allProfiles.filter(profile => 
    event.linked_profiles && event.linked_profiles.includes(profile.slug) ||
    event.participants && event.participants.includes(profile.name)
  )

  return {
    props: {
      event,
      subEvents,
      relatedEvents,
      linkedCases,
      linkedProfiles,
      contentHtml
    }
  }
}
