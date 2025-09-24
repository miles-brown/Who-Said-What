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
    // Hierarchical relationships
    parent_event: data.parent_event || null,
    child_events: data.child_events || [],
    sub_events: data.sub_events || [], // Embedded timeline events
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

// Get main events (events that are not child events of other events)
export function getMainEvents() {
  const allEvents = getAllEvents()
  return allEvents.filter(event => !event.parent_event)
}

// Get child events of a parent event
export function getChildEvents(parentSlug) {
  const allEvents = getAllEvents()
  return allEvents.filter(event => event.parent_event === parentSlug)
}

// Get parent event of a child event
export function getParentEvent(childSlug) {
  const allEvents = getAllEvents()
  const childEvent = allEvents.find(e => e.slug === childSlug)
  
  if (!childEvent || !childEvent.parent_event) {
    return null
  }
  
  return allEvents.find(e => e.slug === childEvent.parent_event)
}

// Get all events in a hierarchy (parent + all children)
export function getEventHierarchy(parentSlug = null) {
  const allEvents = getAllEvents()
  
  if (parentSlug) {
    // Get specific hierarchy
    const parentEvent = allEvents.find(e => e.slug === parentSlug)
    if (!parentEvent) return null
    
    const childEvents = getChildEvents(parentSlug)
    return {
      parent: parentEvent,
      children: childEvents
    }
  }
  
  // Get all hierarchies
  const mainEvents = getMainEvents()
  return mainEvents.map(mainEvent => ({
    parent: mainEvent,
    children: getChildEvents(mainEvent.slug)
  }))
}

export function getRelatedEvents(eventSlug) {
  const allEvents = getAllEvents()
  const event = allEvents.find(e => e.slug === eventSlug)
  
  if (!event) return []
  
  return allEvents.filter(e => 
    e.slug !== eventSlug && (
      event.related_events.includes(e.slug) ||
      e.related_events.includes(eventSlug)
    )
  )
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
    mainEvents: 0,
    childEvents: 0,
    milestones: 0,
    withSubEvents: 0
  }
  
  allEvents.forEach(event => {
    // Count by type
    stats.byType[event.event_type] = (stats.byType[event.event_type] || 0) + 1
    
    // Count categories
    if (event.categories) {
      event.categories.forEach(category => {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1
      })
    }
    
    // Count main vs child events
    if (event.parent_event) {
      stats.childEvents++
    } else {
      stats.mainEvents++
    }
    
    // Count events with embedded sub-events
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

// Get breadcrumb trail for an event
export function getEventBreadcrumbs(eventSlug) {
  const allEvents = getAllEvents()
  const event = allEvents.find(e => e.slug === eventSlug)
  
  if (!event) return []
  
  const breadcrumbs = [event]
  
  // Add parent if exists
  if (event.parent_event) {
    const parent = allEvents.find(e => e.slug === event.parent_event)
    if (parent) {
      breadcrumbs.unshift(parent)
    }
  }
  
  return breadcrumbs
}
