import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Navbar = ({ theme, onToggleTheme, isAuthenticated }) => {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-dot" />
        <span>NEDx Assistant</span>
      </div>
      <div className="top-nav-actions">
        <Link className="top-nav-link" to="/">
          Chat
        </Link>
        <Link className="top-nav-link" to={isAuthenticated ? '/admin' : '/login'}>
          {isAuthenticated ? 'Admin' : 'Admin Login'}
        </Link>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}

export default Navbar
