import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const eventsDirectory = path.join(process.cwd(), 'content/events')

function formatEventData(slug, data, content = '') {
  return {
    slug,
    title: data.title || 'Untitled Event',
    date: data.date || new Date().toISOString(),
    event_date: data.event_date || data.date,
    end_date: data.end_date || null,
    duration: data.duration || null,
    location: data.location || '',
    event_type: data.event_type || 'incident',
    status: data.status || 'documented',
    significance: data.significance || 'medium',
    // Relationships
    parent_event: data.parent_event || null,
    sub_events: data.sub_events || [],
    related_events: data.related_events || [],
    linked_cases: data.linked_cases || [],
    linked_profiles: data.linked_profiles || [],
    // Content
    excerpt: data.excerpt || (content ? content.slice(0, 150) + '...' : ''),
    summary: data.summary || '',
    tags: data.tags || [],
    categories: data.categories || [],
    participants: data.participants || [],
    sources: data.sources || [],
    // Timeline data
    timeline_position: data.timeline_position || 0,
    is_milestone: data.is_milestone || false,
    ...data,
  };
}

export function getAllEvents() {
  if (!fs.existsSync(eventsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(eventsDirectory)
  const allEvents = fileNames
    .filter(name => name.endsWith('.md'))
    .map((name) => {
      const slug = name.replace(/\.md$/, '')
      const fullPath = path.join(eventsDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      return formatEventData(slug, data, content);
    })

  // Sort by event date, most recent first
  return allEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
}

export function getEventBySlug(slug) {
  const fullPath = path.join(eventsDirectory, `${slug}.md`)
  
  if (!fullPath || !fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const formattedData = formatEventData(slug, data);

  return {
    ...formattedData,
    content,
  }
}

export function getAllEventSlugs() {
  if (!fs.existsSync(eventsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(eventsDirectory)
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map((name) => ({
      params: {
        slug: name.replace(/\.md$/, '')
      }
    }))
}

export function getEventsByType(eventType) {
  const allEvents = getAllEvents()
  return allEvents.filter(event => event.event_type === eventType)
}

export function getEventsByCategory(category) {
  const allEvents = getAllEvents()
  return allEvents.filter(event => 
    event.categories && event.categories.includes(category)
  )
}

export function getSubEvents(parentSlug) {
  const allEvents = getAllEvents()
  return allEvents.filter(event => event.parent_event === parentSlug)
}

export function getRelatedEvents(eventSlug) {
  const allEvents = getAllEvents()
  const event = allEvents.find(e => e.slug === eventSlug)
  
  if (!event) return []
  
  return allEvents.filter(e => 
    e.slug !== eventSlug && (
      event.related_events.includes(e.slug) ||
      e.related_events.includes(eventSlug) ||
      e.parent_event === eventSlug ||
      event.parent_event === e.slug
    )
  )
}

export function getEventTimeline(eventSlug = null) {
  const allEvents = getAllEvents()
  
  if (eventSlug) {
    // Get timeline for a specific event and its related events
    const mainEvent = allEvents.find(e => e.slug === eventSlug)
    if (!mainEvent) return []
    
    const relatedEvents = getRelatedEvents(eventSlug)
    const subEvents = getSubEvents(eventSlug)
    
    const timelineEvents = [mainEvent, ...relatedEvents, ...subEvents]
    return timelineEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
  }
  
  // Return all events sorted by date
  return allEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
}

export function getEventHierarchy() {
  const allEvents = getAllEvents()
  const hierarchy = []
  
  // Get root events (no parent)
  const rootEvents = allEvents.filter(event => !event.parent_event)
  
  rootEvents.forEach(rootEvent => {
    const eventWithChildren = {
      ...rootEvent,
      children: buildEventTree(rootEvent.slug, allEvents)
    }
    hierarchy.push(eventWithChildren)
  })
  
  return hierarchy.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
}

function buildEventTree(parentSlug, allEvents) {
  const children = allEvents.filter(event => event.parent_event === parentSlug)
  
  return children.map(child => ({
    ...child,
    children: buildEventTree(child.slug, allEvents)
  })).sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
}

export function searchEvents(query) {
  const allEvents = getAllEvents()
  const lowercaseQuery = query.toLowerCase()
  
  return allEvents.filter(event => 
    event.title.toLowerCase().includes(lowercaseQuery) ||
    event.summary.toLowerCase().includes(lowercaseQuery) ||
    event.location.toLowerCase().includes(lowercaseQuery) ||
    (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
    (event.categories && event.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))) ||
    (event.participants && event.participants.some(p => p.toLowerCase().includes(lowercaseQuery)))
  )
}

export function getEventsByDateRange(startDate, endDate) {
  const allEvents = getAllEvents()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return allEvents.filter(event => {
    const eventDate = new Date(event.event_date)
    return eventDate >= start && eventDate <= end
  })
}

export function getEventsByParticipant(participantName) {
  const allEvents = getAllEvents()
  return allEvents.filter(event => 
    event.participants && event.participants.includes(participantName)
  )
}

export function getMilestoneEvents() {
  const allEvents = getAllEvents()
  return allEvents.filter(event => event.is_milestone)
}

export function getEventStatistics() {
  const allEvents = getAllEvents()
  
  const stats = {
    total: allEvents.length,
    byType: {},
    byCategory: {},
    bySignificance: {},
    withSubEvents: 0,
    milestones: 0
  }
  
  allEvents.forEach(event => {
    // Count by type
    stats.byType[event.event_type] = (stats.byType[event.event_type] || 0) + 1
    
    // Count by significance
    stats.bySignificance[event.significance] = (stats.bySignificance[event.significance] || 0) + 1
    
    // Count categories
    if (event.categories) {
      event.categories.forEach(category => {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
      })
    }
    
    // Count events with sub-events
    if (event.sub_events && event.sub_events.length > 0) {
      stats.withSubEvents++
    }
    
    // Count milestones
    if (event.is_milestone) {
      stats.milestones++
    }
  })
  
  return stats
}
