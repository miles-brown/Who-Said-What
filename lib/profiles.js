import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const individualsDirectory = path.join(process.cwd(), 'content/profiles/individuals')
const organizationsDirectory = path.join(process.cwd(), 'content/profiles/organizations')

function formatProfileData(slug, data, content = '', type = 'individual') {
  return {
    slug,
    type,
    name: data.name || 'Unknown',
    title: data.title || '',
    organization: data.organization || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    categories: data.categories || [],
    status: data.status || 'active',
    // For list view
    excerpt: data.excerpt || (content ? content.slice(0, 150) + '...' : ''),
    // For detail view
    birth_date: data.birth_date || '',
    nationality: data.nationality || '',
    occupation: data.occupation || '',
    known_for: data.known_for || [],
    founded: data.founded || '',
    headquarters: data.headquarters || '',
    industry: data.industry || '',
    ...data,
  };
}

export function getAllProfiles() {
  const allProfiles = []
  
  // Get individual profiles
  if (fs.existsSync(individualsDirectory)) {
    const individualFiles = fs.readdirSync(individualsDirectory)
    const individuals = individualFiles
      .filter(name => name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.md$/, '')
        const fullPath = path.join(individualsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        return formatProfileData(slug, data, content, 'individual');
      })
    allProfiles.push(...individuals)
  }
  
  // Get organization profiles
  if (fs.existsSync(organizationsDirectory)) {
    const organizationFiles = fs.readdirSync(organizationsDirectory)
    const organizations = organizationFiles
      .filter(name => name.endsWith('.md'))
      .map((name) => {
        const slug = name.replace(/\.md$/, '')
        const fullPath = path.join(organizationsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        return formatProfileData(slug, data, content, 'organization');
      })
    allProfiles.push(...organizations)
  }

  // Sort by name
  return allProfiles.sort((a, b) => a.name.localeCompare(b.name))
}

export function getProfileBySlug(slug, type = null) {
  let fullPath = null
  let profileType = type
  
  // If type is specified, look in that directory
  if (type === 'individual') {
    fullPath = path.join(individualsDirectory, `${slug}.md`)
  } else if (type === 'organization') {
    fullPath = path.join(organizationsDirectory, `${slug}.md`)
  } else {
    // Search both directories
    const individualPath = path.join(individualsDirectory, `${slug}.md`)
    const organizationPath = path.join(organizationsDirectory, `${slug}.md`)
    
    if (fs.existsSync(individualPath)) {
      fullPath = individualPath
      profileType = 'individual'
    } else if (fs.existsSync(organizationPath)) {
      fullPath = organizationPath
      profileType = 'organization'
    }
  }
  
  if (!fullPath || !fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const formattedData = formatProfileData(slug, data, content, profileType);

  return {
    ...formattedData,
    content,
  }
}

export function getAllProfileSlugs() {
  const slugs = []
  
  // Get individual slugs
  if (fs.existsSync(individualsDirectory)) {
    const individualFiles = fs.readdirSync(individualsDirectory)
    individualFiles
      .filter(name => name.endsWith('.md'))
      .forEach((name) => {
        slugs.push({
          params: {
            slug: name.replace(/\.md$/, ''),
            type: 'individual'
          }
        })
      })
  }
  
  // Get organization slugs
  if (fs.existsSync(organizationsDirectory)) {
    const organizationFiles = fs.readdirSync(organizationsDirectory)
    organizationFiles
      .filter(name => name.endsWith('.md'))
      .forEach((name) => {
        slugs.push({
          params: {
            slug: name.replace(/\.md$/, ''),
            type: 'organization'
          }
        })
      })
  }
  
  return slugs
}

export function getProfilesByType(type) {
  const allProfiles = getAllProfiles()
  return allProfiles.filter(profile => profile.type === type)
}

export function getProfilesByCategory(category) {
  const allProfiles = getAllProfiles()
  return allProfiles.filter(profile => 
    profile.categories && profile.categories.includes(category)
  )
}

export function searchProfiles(query) {
  const allProfiles = getAllProfiles()
  const lowercaseQuery = query.toLowerCase()
  
  return allProfiles.filter(profile => 
    profile.name.toLowerCase().includes(lowercaseQuery) ||
    profile.title.toLowerCase().includes(lowercaseQuery) ||
    profile.organization.toLowerCase().includes(lowercaseQuery) ||
    (profile.tags && profile.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
    (profile.categories && profile.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery)))
  )
}
