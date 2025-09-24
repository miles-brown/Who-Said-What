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
          <div className="event-meta">
            <Link href="/events" className="back-link">
              ← Back to Events
            </Link>
            <div className="event-badges">
              <span className={`event-type badge badge-${event.event_type === 'incident' ? 'danger' : 'primary'}`}>
                {event.event_type}
              </span>
              <span className={`significance-badge ${event.significance}`}>
                {event.significance} significance
              </span>
              {event.is_milestone && (
                <span className="milestone-badge badge badge-warning">
                  Milestone Event
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
          <h2>Event Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Date:</strong> 
              <time dateTime={event.event_date}>
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </time>
              <span className="time-ago">
                ({formatDistanceToNow(new Date(event.event_date), { addSuffix: true })})
              </span>
            </div>
            
            {event.end_date && (
              <div className="detail-item">
                <strong>End Date:</strong> 
                <time dateTime={event.end_date}>
                  {format(new Date(event.end_date), 'MMMM d, yyyy')}
                </time>
              </div>
            )}
            
            {formatDuration() && (
              <div className="detail-item">
                <strong>Duration:</strong> {formatDuration()}
              </div>
            )}
            
            {event.location && (
              <div className="detail-item">
                <strong>Location:</strong> {event.location}
              </div>
            )}
            
            {event.participants && event.participants.length > 0 && (
              <div className="detail-item participants">
                <strong>Key Participants:</strong>
                <div className="participants-list">
                  {event.participants.map(participant => (
                    <span key={participant} className="participant-tag">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {event.categories && event.categories.length > 0 && (
              <div className="detail-item categories">
                <strong>Categories:</strong>
                <div className="category-tags">
                  {event.categories.map(category => (
                    <span key={category} className="badge">{category}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Parent Event */}
        {event.parent_event && (
          <section className="parent-event">
            <h2>Part of Larger Event</h2>
            <p>This event is a sub-event of a larger incident or series.</p>
            <Link href={`/events/${event.parent_event}`} className="btn btn-outline">
              View Parent Event
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
          <section className="sub-events">
            <h2>Sub-Events</h2>
            <p className="section-description">
              Related events that occurred as part of or in response to this incident:
            </p>
            
            <div className="sub-events-timeline">
              {subEvents.map((subEvent) => (
                <Link href={`/events/${subEvent.slug}`} key={subEvent.slug}>
                  <div className="sub-event-card">
                    <div className="sub-event-marker">
                      <div className={`timeline-dot ${subEvent.significance}`}></div>
                    </div>
                    <div className="sub-event-content">
                      <h3>{subEvent.title}</h3>
                      <time className="sub-event-date">
                        {format(new Date(subEvent.event_date), 'MMM d, yyyy')}
                      </time>
                      <p className="sub-event-excerpt">{subEvent.excerpt}</p>
                      <div className="sub-event-meta">
                        <span className={`event-type badge badge-${subEvent.event_type === 'incident' ? 'danger' : 'primary'}`}>
                          {subEvent.event_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <section className="related-events">
            <h2>Related Events</h2>
            <p className="section-description">
              Other events connected to or influenced by this incident:
            </p>
            
            <div className="related-events-grid">
              {relatedEvents.map((relatedEvent) => (
                <Link href={`/events/${relatedEvent.slug}`} key={relatedEvent.slug}>
                  <div className="related-event-card">
                    <h3>{relatedEvent.title}</h3>
                    <time className="event-date">
                      {format(new Date(relatedEvent.event_date), 'MMM d, yyyy')}
                    </time>
                    <p className="event-excerpt">{relatedEvent.excerpt}</p>
                    <div className="event-meta">
                      <span className={`event-type badge badge-${relatedEvent.event_type === 'incident' ? 'danger' : 'primary'}`}>
                        {relatedEvent.event_type}
                      </span>
                      <span className={`significance-badge ${relatedEvent.significance}`}>
                        {relatedEvent.significance}
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
          <section className="linked-cases">
            <h2>Related Case Studies</h2>
            <p className="section-description">
              Detailed case studies that document this event or its consequences:
            </p>
            
            <div className="cases-grid">
              {linkedCases.map((caseStudy) => (
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

        {/* Linked Profiles */}
        {linkedProfiles.length > 0 && (
          <section className="linked-profiles">
            <h2>Related Profiles</h2>
            <p className="section-description">
              Profiles of individuals and organizations involved in this event:
            </p>
            
            <div className="profiles-grid">
              {linkedProfiles.map((profile) => (
                <Link href={`/profiles/${profile.slug}`} key={profile.slug}>
                  <div className="profile-card">
                    <div className="profile-header">
                      <h3>{profile.name}</h3>
                      <span className={`profile-type badge badge-${profile.type === 'individual' ? 'primary' : 'secondary'}`}>
                        {profile.type}
                      </span>
                    </div>
                    {profile.title && (
                      <p className="profile-title">{profile.title}</p>
                    )}
                    <p className="profile-excerpt">{profile.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sources and Documentation */}
        {event.sources && event.sources.length > 0 && (
          <section className="sources">
            <h2>Sources and References</h2>
            <ul className="sources-list">
              {event.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <style jsx>{`
        .event-article {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .event-header {
          text-align: center;
          padding: 2rem 0;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 2rem;
        }
        
        .event-meta {
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
        
        .event-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .event-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .event-summary {
          font-size: 1.2rem;
          color: var(--text-secondary);
          font-weight: 500;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .event-details {
          background: var(--background-primary);
          padding: 2rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .event-details h2 {
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .details-grid {
          display: grid;
          gap: 1rem;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .detail-item strong {
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .time-ago {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .participants-list,
        .category-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .participant-tag {
          background: var(--background-secondary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .significance-badge {
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .significance-badge.low {
          background: var(--accent-success);
          color: white;
        }
        
        .significance-badge.medium {
          background: var(--accent-warning);
          color: white;
        }
        
        .significance-badge.high {
          background: var(--accent-danger);
          color: white;
        }
        
        .milestone-badge {
          background: var(--accent-warning);
          color: white;
        }
        
        .parent-event {
          background: var(--background-tertiary);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .parent-event h2 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .parent-event p {
          margin-bottom: 1rem;
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
        
        .sub-events,
        .related-events,
        .linked-cases,
        .linked-profiles {
          margin-bottom: 3rem;
        }
        
        .sub-events h2,
        .related-events h2,
        .linked-cases h2,
        .linked-profiles h2 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .section-description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        
        .sub-events-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .sub-event-card {
          display: flex;
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .sub-event-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .sub-event-marker {
          margin-right: 1rem;
          display: flex;
          align-items: flex-start;
          padding-top: 0.25rem;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--background-primary);
        }
        
        .timeline-dot.low { background: var(--accent-success); }
        .timeline-dot.medium { background: var(--accent-warning); }
        .timeline-dot.high { background: var(--accent-danger); }
        
        .sub-event-content {
          flex: 1;
        }
        
        .sub-event-card h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .sub-event-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .sub-event-excerpt {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .sub-event-meta {
          display: flex;
          gap: 0.5rem;
        }
        
        .related-events-grid,
        .cases-grid,
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .related-event-card,
        .case-card,
        .profile-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .related-event-card:hover,
        .case-card:hover,
        .profile-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .related-event-card h3,
        .case-card h3,
        .profile-card h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .event-date,
        .case-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .event-excerpt,
        .case-excerpt,
        .profile-excerpt {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .event-meta,
        .case-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
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
        
        .profile-title {
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.95rem;
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
          .event-meta {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .event-header h1 {
            font-size: 2rem;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .sub-event-card {
            flex-direction: column;
          }
          
          .sub-event-marker {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .related-events-grid,
          .cases-grid,
          .profiles-grid {
            grid-template-columns: 1fr;
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
