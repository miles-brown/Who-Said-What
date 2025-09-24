import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getAllProfiles } from '../../lib/profiles'
import Layout from '../../components/Layout'

export default function ProfilesIndex({ allProfiles }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter profiles based on search and filters
  const filteredProfiles = allProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.organization.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || profile.type === selectedType
    
    const matchesCategory = selectedCategory === 'all' || 
                           (profile.categories && profile.categories.includes(selectedCategory))
    
    return matchesSearch && matchesType && matchesCategory
  })

  // Get unique categories for filter
  const allCategories = [...new Set(allProfiles.flatMap(p => p.categories || []))]

  return (
    <Layout 
      title="Profiles - Who Said What"
      description="Profiles of public figures, organizations, and entities documented in our case studies"
    >
      <Head>
        <title>Profiles - Who Said What</title>
        <meta name="description" content="Profiles of public figures, organizations, and entities documented in our case studies" />
      </Head>

      <div className="profiles-header">
        <h1>Public Figures & Organizations</h1>
        <p className="subtitle">
          Comprehensive profiles of individuals and organizations featured in our documentation
        </p>
        <p className="description">
          This section provides neutral, factual profiles of public figures and organizations 
          that have been subjects of documented statements or controversies. All information 
          is sourced from public records and verified media reports.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filters">
        <div className="search-box">
          <label htmlFor="search" className="sr-only">Search profiles</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, title, or organization..."
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
              <option value="individual">Individuals</option>
              <option value="organization">Organizations</option>
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
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredProfiles.length} of {allProfiles.length} profiles
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Profiles Grid */}
      <div className="profiles-grid">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <Link href={`/profiles/${profile.slug}`} key={profile.slug}>
              <div className="profile-card">
                <div className="profile-header">
                  <h3>{profile.name}</h3>
                  <span className={`profile-type badge badge-${profile.type === 'individual' ? 'primary' : 'secondary'}`}>
                    {profile.type === 'individual' ? 'Individual' : 'Organization'}
                  </span>
                </div>
                
                {profile.title && (
                  <p className="profile-title">{profile.title}</p>
                )}
                
                {profile.organization && profile.type === 'individual' && (
                  <p className="profile-org">{profile.organization}</p>
                )}
                
                {profile.industry && profile.type === 'organization' && (
                  <p className="profile-industry">{profile.industry}</p>
                )}
                
                <p className="profile-excerpt">{profile.excerpt}</p>
                
                {profile.categories && profile.categories.length > 0 && (
                  <div className="profile-categories">
                    {profile.categories.slice(0, 3).map(category => (
                      <span key={category} className="badge">{category}</span>
                    ))}
                    {profile.categories.length > 3 && (
                      <span className="badge">+{profile.categories.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <h3>No profiles found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .profiles-header {
          text-align: center;
          padding: 2rem 0 3rem;
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: 2rem;
        }
        
        .profiles-header h1 {
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
        
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .profile-card {
          background: var(--background-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .profile-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .profile-header h3 {
          margin: 0;
          color: var(--text-primary);
          flex: 1;
        }
        
        .profile-type {
          margin-left: 1rem;
          flex-shrink: 0;
        }
        
        .profile-title {
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .profile-org,
        .profile-industry {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .profile-excerpt {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .profile-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .profiles-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .profile-type {
            margin-left: 0;
            align-self: flex-start;
          }
          
          .filters {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const allProfiles = getAllProfiles()
  return {
    props: {
      allProfiles
    }
  }
}
