import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getAllEvents, getEventHierarchy, getEventStatistics } from '../../lib/events'
import Layout from '../../components/Layout'
import { format } from 'date-fns'

export default function EventsIndex({ allEvents, eventHierarchy, eventStats }) {
  const [viewMode, setViewMode] = useState('timeline') // timeline, hierarchy, grid
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSignificance, setSelectedSignificance] = useState('all')

  // Filter events based on search and filters
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || event.event_type === selectedType
    const matchesCategory = selectedCategory === 'all' || 
                           (event.categories && event.categories.includes(selectedCategory))
    const matchesSignificance = selectedSignificance === 'all' || event.significance === selectedSignificance
    
    return matchesSearch && matchesType && matchesCategory && matchesSignificance
  })

  // Get unique values for filters
  const allTypes = [...new Set(allEvents.map(e => e.event_type))]
  const allCategories = [...new Set(allEvents.flatMap(e => e.categories || []))]
  const allSignificance = [...new Set(allEvents.map(e => e.significance))]

  const renderTimelineView = () => (
    <div className="timeline-view">
      <div className="timeline">
        {filteredEvents.map((event, index) => (
          <div key={event.slug} className={`timeline-item ${event.is_milestone ? 'milestone' : ''}`}>
            <div className="timeline-marker">
              <div className={`timeline-dot ${event.significance}`}></div>
              {index < filteredEvents.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <Link href={`/events/${event.slug}`}>
                <div className="event-card timeline-card">
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <time className="event-date">
                        {format(new Date(event.event_date), 'MMM d, yyyy')}
                      </time>
                      <span className={`significance-badge ${event.significance}`}>
                        {event.significance}
                      </span>
                    </div>
                  </div>
                  
                  {event.location && (
                    <p className="event-location">📍 {event.location}</p>
                  )}
                  
                  <p className="event-excerpt">{event.excerpt}</p>
                  
                  <div className="event-footer">
                    <span className={`event-type badge badge-${event.event_type === 'incident' ? 'danger' : 'primary'}`}>
                      {event.event_type}
                    </span>
                    
                    {event.sub_events && event.sub_events.length > 0 && (
                      <span className="sub-events-count">
                        {event.sub_events.length} sub-event{event.sub_events.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderHierarchyItem = (event, level = 0) => (
    <div key={event.slug} className={`hierarchy-item level-${level}`}>
      <Link href={`/events/${event.slug}`}>
        <div className="event-card hierarchy-card">
          <div className="event-header">
            <h3>{event.title}</h3>
            <time className="event-date">
              {format(new Date(event.event_date), 'MMM d, yyyy')}
            </time>
          </div>
          <p className="event-excerpt">{event.excerpt}</p>
          <div className="event-meta">
            <span className={`event-type badge badge-${event.event_type === 'incident' ? 'danger' : 'primary'}`}>
              {event.event_type}
            </span>
            <span className={`significance-badge ${event.significance}`}>
              {event.significance}
            </span>
          </div>
        </div>
      </Link>
      
      {event.children && event.children.length > 0 && (
        <div className="sub-events">
          {event.children.map(child => renderHierarchyItem(child, level + 1))}
        </div>
      )}
    </div>
  )

  const renderHierarchyView = () => (
    <div className="hierarchy-view">
      {eventHierarchy
        .filter(event => filteredEvents.some(fe => fe.slug === event.slug))
        .map(event => renderHierarchyItem(event))}
    </div>
  )

  const renderGridView = () => (
    <div className="grid-view">
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <Link href={`/events/${event.slug}`} key={event.slug}>
            <div className="event-card grid-card">
              <div className="event-header">
                <h3>{event.title}</h3>
                <time className="event-date">
                  {format(new Date(event.event_date), 'MMM d, yyyy')}
                </time>
              </div>
              
              {event.location && (
                <p className="event-location">📍 {event.location}</p>
              )}
              
              <p className="event-excerpt">{event.excerpt}</p>
              
              <div className="event-footer">
                <div className="event-badges">
                  <span className={`event-type badge badge-${event.event_type === 'incident' ? 'danger' : 'primary'}`}>
                    {event.event_type}
                  </span>
                  <span className={`significance-badge ${event.significance}`}>
                    {event.significance}
                  </span>
                </div>
                
                {event.categories && event.categories.length > 0 && (
                  <div className="event-categories">
                    {event.categories.slice(0, 2).map(category => (
                      <span key={category} className="badge">{category}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <Layout 
      title="Events - Who Said What"
      description="Timeline of documented events, incidents, and their relationships in our case studies"
    >
      <Head>
        <title>Events - Who Said What</title>
        <meta name="description" content="Timeline of documented events, incidents, and their relationships in our case studies" />
      </Head>

      <div className="events-header">
        <h1>Events Timeline</h1>
        <p className="subtitle">
          Chronological documentation of incidents, responses, and related events
        </p>
        <p className="description">
          This timeline provides a comprehensive view of documented events and their relationships. 
          Events can contain sub-events and are linked to related incidents, providing context 
          for understanding complex situations and their development over time.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>{eventStats.total}</h3>
          <p>Total Events</p>
        </div>
        <div className="stat-card">
          <h3>{eventStats.milestones}</h3>
          <p>Milestones</p>
        </div>
        <div className="stat-card">
          <h3>{eventStats.withSubEvents}</h3>
          <p>With Sub-Events</p>
        </div>
        <div className="stat-card">
          <h3>{Object.keys(eventStats.byType).length}</h3>
          <p>Event Types</p>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="view-controls">
        <div className="view-mode-selector">
          <button 
            className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            📅 Timeline
          </button>
          <button 
            className={`view-btn ${viewMode === 'hierarchy' ? 'active' : ''}`}
            onClick={() => setViewMode('hierarchy')}
          >
            🌳 Hierarchy
          </button>
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filters">
        <div className="search-box">
          <label htmlFor="search" className="sr-only">Search events</label>
          <input
            id="search"
            type="text"
            placeholder="Search events by title, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {allTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="significance-filter">Significance:</label>
            <select
              id="significance-filter"
              value={selectedSignificance}
              onChange={(e) => setSelectedSignificance(e.target.value)}
            >
              <option value="all">All Levels</option>
              {allSignificance.map(sig => (
                <option key={sig} value={sig}>{sig}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredEvents.length} of {allEvents.length} events
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Events Display */}
      <div className="events-content">
        {filteredEvents.length > 0 ? (
          <>
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'hierarchy' && renderHierarchyView()}
            {viewMode === 'grid' && renderGridView()}
          </>
        ) : (
          <div className="no-results">
            <h3>No events found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .events-header {
          text-align: center;
          padding: 2rem 0 3rem;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 2rem;
        }
        
        .events-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        
        .description {
          max-width: 800px;
          margin: 0 auto;
          color: var(--text-muted);
          line-height: 1.6;
        }
        
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: var(--background-primary);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
          border: 1px solid var(--border-secondary);
        }
        
        .stat-card h3 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--accent-primary);
        }
        
        .stat-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }
        
        .view-controls {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .view-mode-selector {
          display: inline-flex;
          background: var(--background-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
          overflow: hidden;
        }
        
        .view-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .view-btn:hover {
          background: var(--background-secondary);
        }
        
        .view-btn.active {
          background: var(--accent-primary);
          color: white;
        }
        
        .search-filters {
          background: var(--background-primary);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-md);
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 150px;
        }
        
        .filter-group label {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .filter-group select {
          padding: 0.5rem;
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-sm);
          background: var(--background-primary);
        }
        
        .results-summary {
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        /* Timeline View Styles */
        .timeline {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .timeline-item {
          display: flex;
          margin-bottom: 2rem;
          position: relative;
        }
        
        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 2rem;
          position: relative;
        }
        
        .timeline-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid var(--background-primary);
          z-index: 2;
        }
        
        .timeline-dot.low { background: var(--accent-success); }
        .timeline-dot.medium { background: var(--accent-warning); }
        .timeline-dot.high { background: var(--accent-danger); }
        
        .milestone .timeline-dot {
          width: 20px;
          height: 20px;
          border-width: 4px;
        }
        
        .timeline-line {
          width: 2px;
          height: 60px;
          background: var(--border-primary);
          margin-top: 0.5rem;
        }
        
        .timeline-content {
          flex: 1;
        }
        
        .timeline-card {
          margin-bottom: 0;
        }
        
        /* Hierarchy View Styles */
        .hierarchy-item {
          margin-bottom: 1rem;
        }
        
        .hierarchy-item.level-0 {
          border-left: 4px solid var(--accent-primary);
          padding-left: 1rem;
        }
        
        .hierarchy-item.level-1 {
          border-left: 3px solid var(--accent-secondary);
          padding-left: 1.5rem;
          margin-left: 1rem;
        }
        
        .hierarchy-item.level-2 {
          border-left: 2px solid var(--text-muted);
          padding-left: 2rem;
          margin-left: 2rem;
        }
        
        .sub-events {
          margin-top: 1rem;
        }
        
        /* Grid View Styles */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        /* Event Card Styles */
        .event-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .event-card h3 {
          margin: 0;
          color: var(--text-primary);
          flex: 1;
        }
        
        .event-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        
        .event-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .event-location {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .event-excerpt {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .event-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .event-categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
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
        
        .sub-events-count {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline-marker {
            margin-right: 1rem;
          }
          
          .event-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .event-meta {
            align-items: flex-start;
          }
          
          .filters {
            flex-direction: column;
          }
          
          .view-mode-selector {
            width: 100%;
          }
          
          .view-btn {
            flex: 1;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const allEvents = getAllEvents()
  const eventHierarchy = getEventHierarchy()
  const eventStats = getEventStatistics()
  
  return {
    props: {
      allEvents,
      eventHierarchy,
      eventStats
    }
  }
}
