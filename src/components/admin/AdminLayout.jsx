import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './AdminLayout.css'

function AdminLayout() {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user || !user.is_admin) {
    navigate('/login')
    return null
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Administration</h2>
        <nav>
          <ul>
            <li className={location.pathname === '/admin' ? 'active' : ''}>
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className={location.pathname.includes('/admin/characters') ? 'active' : ''}>
              <Link to="/admin/characters">Personnages</Link>
            </li>
            <li className={location.pathname.includes('/admin/battles') ? 'active' : ''}>
              <Link to="/admin/battles">Batailles</Link>
            </li>
            <li className={location.pathname.includes('/admin/users') ? 'active' : ''}>
              <Link to="/admin/users">Utilisateurs</Link>
            </li>
            <li className={location.pathname.includes('/admin/messages') ? 'active' : ''}>
              <Link to="/admin/messages">Messages</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout