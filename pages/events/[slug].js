import Head from 'next/head'
import Link from 'next/link'
import { getAllEventSlugs, getEventBySlug, getChildEvents, getParentEvent, getRelatedEvents, getEventBreadcrumbs } from '../../lib/events'
import { getAllCases } from '../../lib/cases'
import { getAllProfiles } from '../../lib/profiles'
import Layout from '../../components/Layout'
import { remark } from 'remark'
import html from 'remark-html'
import { format, formatDistanceToNow } from 'date-fns'

export default function EventPage({ event, childEvents, parentEvent, relatedEvents, linkedCases, linkedProfiles, breadcrumbs, contentHtml }) {
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

  // Process content to add clickable citations
  const processContentWithCitations = (content) => {
    if (!content) return content
    
    // Replace citation patterns [[1]] with clickable links
    return content.replace(/\[\[(\d+)\]\]/g, (match, num) => {
      return `<a href="#ref-${num}" class="citation-link" title="Click to view source">[${num}]</a>`
    })
  }

  const renderTimeline = () => {
    if (!event.sub_events || event.sub_events.length === 0) return null

    return (
      <section className="timeline-section">
        <h2>Event Timeline</h2>
        <p className="timeline-description">
          Detailed chronological breakdown of how this event unfolded:
        </p>
        
        <div className="timeline-container">
          {event.sub_events.map((subEvent, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                {index < event.sub_events.length - 1 && <div className="timeline-line"></div>}
              </div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{subEvent.title}</h3>
                  <div className="timeline-meta">
                    <time className="timeline-date">
                      {format(new Date(subEvent.date), 'MMMM d, yyyy')}
                    </time>
                    {subEvent.time && (
                      <span className="timeline-time">{subEvent.time}</span>
                    )}
                    <span className="timeline-type">{subEvent.type.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <p className="timeline-description">{subEvent.description}</p>
                
                {subEvent.details && (
                  <div className="timeline-details">
                    <p>{subEvent.details}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderReferences = () => {
    if (!event.references || event.references.length === 0) return null

    return (
      <section className="references-section">
        <h2>References and Sources</h2>
        <p className="references-description">
          All factual claims in this documentation are supported by the following verified sources. 
          Click the links to access the original articles and archived versions.
        </p>
        
        <div className="references-container">
          {event.references.map((ref) => (
            <div key={ref.id} id={`ref-${ref.id}`} className="reference-item">
              <div className="reference-header">
                <span className="reference-number">[{ref.id}]</span>
                <div className="reference-meta">
                  <span className="reference-source">{ref.source}</span>
                  <span className="reference-date">{ref.date}</span>
                  <span className={`reference-reliability ${ref.reliability}`}>
                    {ref.reliability.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="reference-content">
                <h4 className="reference-title">
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="reference-link">
                      {ref.title}
                    </a>
                  ) : (
                    ref.title
                  )}
                </h4>
                
                {ref.author && (
                  <p className="reference-author">
                    <strong>Author:</strong> {ref.author}
                  </p>
                )}
                
                <div className="reference-links">
                  {ref.url && (
                    <div className="link-item">
                      <strong>Original:</strong>{' '}
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="source-link">
                        {ref.url}
                      </a>
                    </div>
                  )}
                  
                  {ref.archive_url && (
                    <div className="link-item">
                      <strong>Archived ({ref.archive_date}):</strong>{' '}
                      <a href={ref.archive_url} target="_blank" rel="noopener noreferrer" className="archive-link">
                        {ref.archive_url}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="reference-details">
                  <p className="reference-context">
                    <strong>Context:</strong> {ref.context}
                  </p>
                  <p className="reference-type">
                    <strong>Type:</strong> {ref.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="reliability-guide">
          <h3>Source Reliability Guide</h3>
          <div className="reliability-legend">
            <div className="reliability-item">
              <span className="reliability-indicator primary_source"></span>
              <span className="reliability-label">Primary Source</span>
              <span className="reliability-description">Original documents, official statements, direct recordings</span>
            </div>
            <div className="reliability-item">
              <span className="reliability-indicator high"></span>
              <span className="reliability-label">High Reliability</span>
              <span className="reliability-description">Established news organizations, verified reporting</span>
            </div>
            <div className="reliability-item">
              <span className="reliability-indicator medium"></span>
              <span className="reliability-label">Medium Reliability</span>
              <span className="reliability-description">Expert analysis, secondary reporting</span>
            </div>
          </div>
        </div>
      </section>
    )
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
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 1 && (
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link href="/events">Events</Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.slug} className="breadcrumb-item">
                  {index === breadcrumbs.length - 1 ? (
                    <span className="breadcrumb-current">{crumb.title}</span>
                  ) : (
                    <Link href={`/events/${crumb.slug}`}>{crumb.title}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

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

        {/* Parent Event Context */}
        {parentEvent && (
          <section className="parent-event-section">
            <h2>Part of: {parentEvent.title}</h2>
            <p>This event occurred within the context of the larger {parentEvent.title.toLowerCase()}.</p>
            <Link href={`/events/${parentEvent.slug}`} className="btn btn-outline">
              View Parent Event
            </Link>
          </section>
        )}

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

        {/* Main Content with Citations */}
        <section className="event-content">
          <div 
            className="content-body"
            dangerouslySetInnerHTML={{ __html: processContentWithCitations(contentHtml) }}
          />
        </section>

        {/* Embedded Timeline */}
        {renderTimeline()}

        {/* Child Events */}
        {childEvents.length > 0 && (
          <section className="child-events-section">
            <h2>Related Events</h2>
            <p className="section-description">
              Events that occurred within the context of this incident:
            </p>
            
            <div className="child-events-grid">
              {childEvents.map((childEvent) => (
                <Link href={`/events/${childEvent.slug}`} key={childEvent.slug}>
                  <div className="child-event-card">
                    <h3>{childEvent.title}</h3>
                    <time className="event-date">
                      {format(new Date(childEvent.event_date), 'MMMM d, yyyy')}
                    </time>
                    <p className="event-excerpt">{childEvent.excerpt}</p>
                    <div className="event-meta">
                      <span className="event-type-tag">
                        {childEvent.event_type.replace('_', ' ')}
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

        {/* References Section */}
        {renderReferences()}
      </article>

      <style jsx>{`
        .event-article {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .breadcrumb-nav {
          margin-bottom: 2rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-secondary);
        }
        
        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .breadcrumb-item {
          display: flex;
          align-items: center;
        }
        
        .breadcrumb-item:not(:last-child)::after {
          content: '›';
          margin-left: 0.5rem;
          color: var(--text-muted);
        }
        
        .breadcrumb-item a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
        }
        
        .breadcrumb-item a:hover {
          text-decoration: underline;
        }
        
        .breadcrumb-current {
          color: var(--text-secondary);
          font-weight: 500;
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
        
        /* Citation Styles */
        :global(.citation-link) {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          background: var(--background-secondary);
          border: 1px solid var(--border-primary);
          margin: 0 0.1rem;
          transition: var(--transition);
          display: inline-block;
          line-height: 1;
        }
        
        :global(.citation-link:hover) {
          background: var(--accent-primary);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Timeline Styles */
        .timeline-section {
          background: var(--background-primary);
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 3rem;
          box-shadow: var(--shadow-sm);
        }
        
        .timeline-section h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .timeline-description {
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .timeline-container {
          position: relative;
        }
        
        .timeline-item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        
        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent-primary);
          border: 3px solid var(--background-primary);
          box-shadow: 0 0 0 3px var(--accent-primary);
        }
        
        .timeline-line {
          width: 2px;
          height: 100%;
          background: var(--border-primary);
          margin-top: 0.5rem;
          min-height: 2rem;
        }
        
        .timeline-content {
          flex: 1;
          background: var(--background-secondary);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-secondary);
        }
        
        .timeline-header {
          margin-bottom: 1rem;
        }
        
        .timeline-header h3 {
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        .timeline-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .timeline-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .timeline-time {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .timeline-type {
          background: var(--accent-secondary);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          text-transform: capitalize;
        }
        
        .timeline-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0;
        }
        
        .timeline-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-primary);
        }
        
        .timeline-details p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
        }
        
        /* References Section Styles */
        .references-section {
          background: var(--background-primary);
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 3rem;
          box-shadow: var(--shadow-sm);
          border-top: 4px solid var(--accent-primary);
        }
        
        .references-section h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .references-description {
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .references-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .reference-item {
          background: var(--background-secondary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          scroll-margin-top: 100px;
        }
        
        .reference-item:target {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.1);
        }
        
        .reference-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .reference-number {
          background: var(--accent-primary);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        
        .reference-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        
        .reference-source {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
        }
        
        .reference-date {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .reference-reliability {
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
          align-self: flex-start;
        }
        
        .reference-reliability.primary_source {
          background: #10b981;
          color: white;
        }
        
        .reference-reliability.high {
          background: #3b82f6;
          color: white;
        }
        
        .reference-reliability.medium {
          background: #f59e0b;
          color: white;
        }
        
        .reference-content {
          flex: 1;
        }
        
        .reference-title {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .reference-link {
          color: var(--accent-primary);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .reference-link:hover {
          text-decoration: underline;
          color: var(--accent-secondary);
        }
        
        .reference-author {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .reference-links {
          background: var(--background-tertiary);
          padding: 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1rem;
          border-left: 3px solid var(--accent-primary);
        }
        
        .link-item {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        
        .link-item:last-child {
          margin-bottom: 0;
        }
        
        .source-link,
        .archive-link {
          color: var(--accent-primary);
          text-decoration: none;
          word-break: break-all;
          font-family: monospace;
          font-size: 0.85rem;
          padding: 0.2rem 0.4rem;
          background: var(--background-primary);
          border-radius: 3px;
          border: 1px solid var(--border-primary);
          transition: var(--transition);
        }
        
        .source-link:hover,
        .archive-link:hover {
          background: var(--accent-primary);
          color: white;
          text-decoration: none;
        }
        
        .archive-link {
          color: var(--accent-secondary);
        }
        
        .archive-link:hover {
          background: var(--accent-secondary);
        }
        
        .reference-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .reference-context,
        .reference-type {
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        
        .reference-context strong,
        .reference-type strong {
          color: var(--text-primary);
        }
        
        .reliability-guide {
          background: var(--background-tertiary);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }
        
        .reliability-guide h3 {
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        .reliability-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .reliability-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .reliability-

indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .reliability-indicator.primary_source {
          background: #10b981;
        }
        
        .reliability-indicator.high {
          background: #3b82f6;
        }
        
        .reliability-indicator.medium {
          background: #f59e0b;
        }
        
        .reliability-label {
          font-weight: 600;
          color: var(--text-primary);
          min-width: 120px;
        }
        
        .reliability-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        /* Section Styles */
        .child-events-section,
        .related-section,
        .linked-section {
          margin-bottom: 3rem;
        }
        
        .child-events-section h2,
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
        
        .child-events-grid,
        .related-events-grid,
        .linked-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        .child-event-card,
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
        
        .child-event-card:hover,
        .related-event-card:hover,
        .linked-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .child-event-card h3,
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
          
          .timeline-item {
            gap: 1rem;
          }
          
          .timeline-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .child-events-grid,
          .related-events-grid,
          .linked-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .event-details,
          .timeline-section,
          .references-section {
            padding: 1.5rem;
          }
          
          .breadcrumb-list {
            flex-wrap: wrap;
          }
          
          .reference-header {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .reference-meta {
            align-items: flex-start;
          }
          
          .reliability-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .reliability-label {
            min-width: auto;
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

  // Get child events
  const childEvents = getChildEvents(params.slug)

  // Get parent event
  const parentEvent = getParentEvent(params.slug)

  // Get related events
  const relatedEvents = getRelatedEvents(params.slug)

  // Get breadcrumbs
  const breadcrumbs = getEventBreadcrumbs(params.slug)

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
      childEvents,
      parentEvent,
      relatedEvents,
      linkedCases,
      linkedProfiles,
      breadcrumbs,
      contentHtml
    }
  }
}
