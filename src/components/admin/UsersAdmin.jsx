import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../api/auth'
import './UsersAdmin.css'

function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    nom_utilisateur: '',
    is_admin: false
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/utilisateurs/')
      setUsers(response.data)
    } catch (error) {
      setError('Erreur lors de la récupération des utilisateurs')
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      nom_utilisateur: user.nom_utilisateur,
      is_admin: user.is_admin
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/utilisateurs/${selectedUser.id}`, formData)
      fetchUsers()
      resetForm()
    } catch (error) {
      setError('Erreur lors de la mise à jour')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axiosInstance.delete(`/utilisateurs/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchUsers();
      } catch (error) {
        console.error('Erreur détaillée:', error);
        setError('Erreur lors de la suppression');
      }
    }
  }

  const resetForm = () => {
    setSelectedUser(null)
    setFormData({
      nom_utilisateur: '',
      is_admin: false
    })
  }

  const columns = [
    {
      name: 'ID',
      selector: row => row.id_utilisateur,
      sortable: true,
      width: '100px'
    },
    {
      name: "Nom d'utilisateur",
      selector: row => row.nom_utilisateur,
      sortable: true,
      width: '200px'
    },
    {
        name: 'Email',
        selector: row => row.email,
        sortable: true,
        width: '200px'
    },
    {
      name: 'Admin',
      selector: row => row.is_admin ? 'Oui' : 'Non',
      sortable: true,
      width: '100px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button onClick={() => handleEdit(row)} className="edit-btn">
            Modifier
          </button>
          <button onClick={() => handleDelete(row.id_utilisateur)} className="delete-btn">
            Supprimer
          </button>
        </div>
      ),
      width: '200px'
    }
  ]

  const customStyles = {
    table: {
      style: {
        backgroundColor: '#2a2a2a',
        color: '#fff'
      }
    },
    rows: {
      style: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#3a3a3a'
        }
      }
    },
    headRow: {
      style: {
        backgroundColor: '#1a1a1a',
        color: '#fff'
      }
    },
    pagination: {
      style: {
        backgroundColor: '#2a2a2a',
        color: '#fff'
      }
    }
  }

  return (
    <div className="users-admin">
      <h1>Gestion des Utilisateurs</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="admin-form-section">
        <h2>{selectedUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom_utilisateur">Nom d'utilisateur</label>
            <input
              type="text"
              id="nom_utilisateur"
              name="nom_utilisateur"
              value={formData.nom_utilisateur}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_admin"
                checked={formData.is_admin}
                onChange={handleChange}
              />
              Administrateur
            </label>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {selectedUser ? 'Mettre à jour' : 'Créer'}
            </button>
            {selectedUser && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="users-list-section">
        <h2>Liste des Utilisateurs</h2>
        <DataTable
          columns={columns}
          data={users}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          customStyles={customStyles}
          striped
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent="Aucun utilisateur trouvé"
        />
      </div>
    </div>
  )
}

export default UsersAdmin 