import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoLink}>
          <span className="gradient-text" style={styles.logoText}>BrainWave Quiz</span>
        </Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/create" style={styles.navLinkCreate}>Create Quiz</Link>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'rgba(15, 12, 27, 0.5)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '16px 24px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#9ca3af',
    transition: 'color 0.2s',
  },
  navLinkCreate: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(147, 51, 234, 0.2)',
    border: '1px solid rgba(147, 51, 234, 0.4)',
    padding: '6px 14px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  }
};

export default Navbar;
