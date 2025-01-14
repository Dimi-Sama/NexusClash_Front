import React from 'react'
import { Link } from 'react-router-dom'

function AdminHome() {
  return (
    <div className="admin-home">
      <h1>Admin Dashboard</h1>
      <div className="admin-quick-links">
        <div className="admin-card">
          <h2>Quick Actions</h2>
          <ul>
            <li><Link to="/admin/characters">Manage Characters</Link></li>
            <li><Link to="/admin/form">Admin Form</Link></li>
            {/* Add more quick links as needed */}
          </ul>
        </div>
        <div className="admin-card">
          <h2>Recent Activity</h2>
          <p>Recent activities will be displayed here</p>
        </div>
      </div>
    </div>
  )
}

export default AdminHome