import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getAllEvents, getMainEvents, getEventHierarchy, getEventStatistics } from '../../lib/events'
import Layout from '../../components/Layout'
import { format } from 'date-fns'

export default function EventsIndex({ allEvents, mainEvents, eventHierarchies, eventStats }) {
  const [viewMode, setViewMode] = useState('hierarchy') // hierarchy, list
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter events based on search and filters
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || event.event_type === selectedType
    const matchesCategory = selectedCategory === 'all' || 
                           (event.categories && event.categories.includes(selectedCategory))
    
    return matchesSearch && matchesType && matchesCategory
  })

  // Filter hierarchies based on search and filters
  const filteredHierarchies = eventHierarchies.filter(hierarchy => {
    const parentMatches = hierarchy.parent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hierarchy.parent.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
    const childrenMatch = hierarchy.children.some(child => 
      child.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const typeMatches = selectedType === 'all' || 
                       hierarchy.parent.event_type === selectedType ||
                       hierarchy.children.some(child => child.event_type === selectedType)
    
    const categoryMatches = selectedCategory === 'all' ||
                           (hierarchy.parent.categories && hierarchy.parent.categories.includes(selectedCategory)) ||
                           hierarchy.children.some(child => child.categories && child.categories.includes(selectedCategory))
    
    return (parentMatches || childrenMatch) && typeMatches && categoryMatches
  })

  // Get unique values for filters
  const allTypes = [...new Set(allEvents.map(e => e.event_type))]
  const allCategories = [...new Set(allEvents.flatMap(e => e.categories || []))]

  const renderHierarchyView = () => (
    <div className="hierarchy-view">
      {filteredHierarchies.map((hierarchy) => (
        <div key={hierarchy.parent.slug} className="event-hierarchy">
          {/* Parent Event */}
          <div className="parent-event">
            <Link href={`/events/${hierarchy.parent.slug}`}>
              <div className="event-card parent-event-card">
                <div className="event-header">
                  <h2>{hierarchy.parent.title}</h2>
                  <div className="event-meta">
                    <time className="event-date">
                      {format(new Date(hierarchy.parent.event_date), 'MMMM d, yyyy')}
                      {hierarchy.parent.end_date && (
                        <span> - {format(new Date(hierarchy.parent.end_date), 'MMMM d, yyyy')}</span>
                      )}
                    </time>
                    <span className="event-type">{hierarchy.parent.event_type.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {hierarchy.parent.location && (
                  <p className="event-location">📍 {hierarchy.parent.location}</p>
                )}
                
                <p className="event-summary">{hierarchy.parent.summary || hierarchy.parent.excerpt}</p>
                
                <div className="event-footer">
                  <div className="event-categories">
                    {hierarchy.parent.categories && hierarchy.parent.categories.map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>
                  
                  {hierarchy.children.length > 0 && (
                    <span className="child-events-indicator">
                      {hierarchy.children.length} related event{hierarchy.children.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
          
          {/* Child Events */}
          {hierarchy.children.length > 0 && (
            <div className="child-events-container">
              <h3>Related Events</h3>
              <div className="child-events-grid">
                {hierarchy.children.map((childEvent) => (
                  <Link href={`/events/${childEvent.slug}`} key={childEvent.slug}>
                    <div className="event-card child-event-card">
                      <h4>{childEvent.title}</h4>
                      <time className="child-event-date">
                        {format(new Date(childEvent.event_date), 'MMM d, yyyy')}
                      </time>
                      <p className="child-event-excerpt">{childEvent.excerpt}</p>
                      <span className="child-event-type">{childEvent.event_type.replace('_', ' ')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="list-view">
      <div className="events-list">
        {filteredEvents.map((event) => (
          <Link href={`/events/${event.slug}`} key={event.slug}>
            <div className="event-card list-event-card">
              <div className="event-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <time className="event-date">
                      {format(new Date(event.event_date), 'MMM d, yyyy')}
                    </time>
                    <span className="event-type">{event.event_type.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {event.location && (
                  <p className="event-location">📍 {event.location}</p>
                )}
                
                <p className="event-excerpt">{event.excerpt}</p>
                
                <div className="event-footer">
                  <div className="event-categories">
                    {event.categories && event.categories.slice(0, 3).map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>
                  
                  {event.parent_event && (
                    <span className="parent-indicator">Part of larger event</span>
                  )}
                  
                  {event.child_events && event.child_events.length > 0 && (
                    <span className="child-indicator">Has {event.child_events.length} related events</span>
                  )}
                </div>
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
      description="Browse documented events involving statements about Jews, Israel, and antisemitism with detailed timelines and academic citations"
    >
      <Head>
        <title>Events - Who Said What</title>
        <meta name="description" content="Documented events involving statements about Jews, Israel, and antisemitism with academic citations and detailed timelines" />
      </Head>

      <div className="events-header">
        <h1>Events Documentation</h1>
        <p className="subtitle">
          Incidents involving statements about Jews, Israel, and antisemitism
        </p>
        <p className="description">
          Comprehensive documentation of public statements, scandals, and controversies by notable figures 
          related to Jewish topics. Each event includes academic-quality citations, detailed timelines, 
          and documentation of consequences and responses.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-item">
          <span className="stat-number">{eventStats.total}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{eventStats.mainEvents}</span>
          <span className="stat-label">Main Events</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{eventStats.childEvents}</span>
          <span className="stat-label">Related Events</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{eventStats.withSubEvents}</span>
          <span className="stat-label">With Timelines</span>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="view-controls">
        <div className="view-selector">
          <button 
            className={`view-button ${viewMode === 'hierarchy' ? 'active' : ''}`}
            onClick={() => setViewMode('hierarchy')}
          >
            Hierarchy View
          </button>
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filters">
        <div className="search-container">
          <label htmlFor="search" className="search-label">Search Events</label>
          <input
            id="search"
            type="text"
            placeholder="Search by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <div className="filter-item">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {allTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-info">
        <p>
          {viewMode === 'hierarchy' ? (
            <>Showing {filteredHierarchies.length} event hierarchies</>
          ) : (
            <>Showing {filteredEvents.length} of {allEvents.length} events</>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Events Display */}
      <div className="events-content">
        {(viewMode === 'hierarchy' ? filteredHierarchies.length > 0 : filteredEvents.length > 0) ? (
          <>
            {viewMode === 'hierarchy' && renderHierarchyView()}
            {viewMode === 'list' && renderListView()}
          </>
        ) : (
          <div className="no-results">
            <h3>No events found</h3>
            <p>Try adjusting your search terms or filters to find relevant events.</p>
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
          font-weight: 500;
        }
        
        .description {
          max-width: 700px;
          margin: 0 auto;
          color: var(--text-muted);
          line-height: 1.6;
        }
        
        .stats-overview {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--background-primary);
          border-radius: var(--radius-lg);
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .view-controls {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .view-selector {
          display: inline-flex;
          background: var(--background-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
          overflow: hidden;
        }
        
        .view-button {
          padding: 0.75rem 2rem;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .view-button:hover {
          background: var(--background-secondary);
        }
        
        .view-button.active {
          background: var(--accent-primary);
          color: white;
        }
        
        .search-filters {
          background: var(--background-primary);
          padding: 2rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .search-container {
          margin-bottom: 1.5rem;
        }
        
        .search-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-md);
          font-size: 1rem;
          background: var(--background-secondary);
          transition: var(--transition);
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        
        .filters-container {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        
        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 180px;
        }
        
        .filter-item label {
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .filter-select {
          padding: 0.6rem;
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-sm);
          background: var(--background-secondary);
          font-size: 0.95rem;
        }
        
        .results-info {
          margin-bottom

: 2rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        /* Hierarchy View Styles */
        .event-hierarchy {
          margin-bottom: 3rem;
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--background-primary);
        }
        
        .parent-event-card {
          background: var(--background-secondary);
          border-bottom: 2px solid var(--border-primary);
        }
        
        .child-events-container {
          padding: 2rem;
        }
        
        .child-events-container h3 {
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          font-size: 1.25rem;
        }
        
        .child-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        /* Event Card Styles */
        .event-card {
          padding: 2rem;
          cursor: pointer;
          transition: var(--transition);
          border-radius: var(--radius-md);
        }
        
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .list-event-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          margin-bottom: 1rem;
        }
        
        .child-event-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          padding: 1.5rem;
        }
        
        .event-header {
          margin-bottom: 1rem;
        }
        
        .event-header h2 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .event-header h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.25rem;
        }
        
        .child-event-card h4 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        .event-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .event-date {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        
        .child-event-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        
        .event-type,
        .child-event-type {
          background: var(--accent-primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .event-location {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }
        
        .event-summary,
        .event-excerpt,
        .child-event-excerpt {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .event-categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .category-tag {
          background: var(--background-tertiary);
          color: var(--text-primary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          border: 1px solid var(--border-primary);
        }
        
        .child-events-indicator,
        .parent-indicator,
        .child-indicator {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }
        
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }
        
        .no-results h3 {
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .stats-overview {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .filters-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .filter-item {
            min-width: auto;
          }
          
          .child-events-grid {
            grid-template-columns: 1fr;
          }
          
          .event-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .event-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .view-selector {
            width: 100%;
          }
          
          .view-button {
            flex: 1;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const allEvents = getAllEvents()
  const mainEvents = getMainEvents()
  const eventHierarchies = getEventHierarchy()
  const eventStats = getEventStatistics()
  
  return {
    props: {
      allEvents,
      mainEvents,
      eventHierarchies,
      eventStats
    }
  }
}
