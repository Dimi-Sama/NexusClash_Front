import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../api/auth'
import './CharactersAdmin.css'

function CharactersAdmin() {
  const [characters, setCharacters] = useState([])
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    competences: '',
    image: ''
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      const response = await axiosInstance.get('/personnages/')
      setCharacters(response.data)
    } catch (error) {
      setError('Erreur lors de la récupération des personnages')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        nom: formData.nom,
        competences: formData.competences,
        image: formData.image
      }
      
      if (selectedCharacter) {
        await axiosInstance.put(`/personnages/${selectedCharacter.id}`, dataToSend)
      } else {
        await axiosInstance.post('/personnages/', dataToSend)
      }
      fetchCharacters()
      resetForm()
    } catch (error) {
      setError('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      try {
        await axiosInstance.delete(`/personnages/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchCharacters();
      } catch (error) {
        console.error('Erreur détaillée:', error);
        setError('Erreur lors de la suppression');
      }
    }
  }

  const handleEdit = (character) => {
    setSelectedCharacter(character)
    setFormData({
      nom: character.nom,
      competences: character.competences,
      image: character.image
    })
  }

  const resetForm = () => {
    setSelectedCharacter(null)
    setFormData({
      nom: '',
      competences: '',
      image: ''
    })
  }

  // Configuration des colonnes pour DataTable
  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Nom',
      selector: row => row.nom,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Compétences',
      selector: row => row.competences,
      sortable: true,
      wrap: true,
      width: '300px'
    },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.image}
          alt={row.nom}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
      width: '100px'
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button onClick={() => handleEdit(row)} className="edit-btn">
            Modifier
          </button>
          <button onClick={() => handleDelete(row.id)} className="delete-btn">
            Supprimer
          </button>
        </>
      ),
      width: '200px'
    }
  ];

  // Configuration personnalisée pour DataTable
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
  };

  return (
    <div className="characters-admin">
      <h1>Gestion des Personnages</h1>
      
      <div className="admin-form-section">
        <h2>{selectedCharacter ? 'Modifier le Personnage' : 'Créer un Personnage'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="competences">Compétences</label>
            <textarea
              id="competences"
              name="competences"
              value={formData.competences}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de l'image</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {selectedCharacter ? 'Mettre à jour' : 'Créer'}
            </button>
            {selectedCharacter && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="characters-list-section">
        <h2>Liste des Personnages</h2>
        <DataTable
          columns={columns}
          data={characters}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          customStyles={customStyles}
          striped
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent="Aucun personnage trouvé"
        />
      </div>
    </div>
  )
}

export default CharactersAdmin 
// (Created by TrueDiamant777 | Edited by Dimi-Sama | CSS by TrueDiamant777 & Dimi-Sama)
// ⢌⢣⡝⡼⣙⢮⢳⠞⣦⢣⠄⠀⠄⡀⢀⠀⢆⡐⢢⠐⡄⢢⠐⢢⠐⠤⠐⢂⠐⠀⠀⡠⠄⢂⠰⡀⢆⠰⡀⢆⠰⣀⠒⡄⢒⡐⢂⡒⠰⢂⠲⢄⠣⢆⡱⠢⢜⢢⡑⢎⢆⢣⠜⣢⠹⣌⡳⡝⣮⣝
// ⠀⢢⠘⡰⢉⡎⢯⡞⣥⢏⠄⡈⠐⠀⠀⡈⠄⠘⠆⠣⠜⣠⠉⠆⠀⠀⠀⠈⠄⠀⠀⠁⠈⠀⠁⡈⠀⠃⠘⠤⠁⢆⠱⢈⠆⡌⡡⠜⣡⠋⢦⢉⠆⡣⠜⣑⠪⡰⢘⡌⢎⠦⡹⢆⡳⢌⢳⡙⣖⢺
// ⠐⡀⢆⠡⢳⡘⡧⢞⡱⡞⠀⠄⡁⠀⠀⠐⡈⠄⡀⠀⠀⠀⠉⠀⠀⠀⠀⡀⠀⠈⣔⠪⡜⣩⠣⡍⣍⢣⢓⡒⠲⡤⠬⣄⠊⠔⡡⢚⠤⡙⢤⣺⠼⡐⣍⢢⠱⣁⠣⢜⡨⢒⡍⢲⡉⢞⢢⡕⢪⡱
// ⡐⠰⢀⠣⢡⠹⣜⢫⡵⡋⠐⠠⠄⠀⠀⠀⠐⠀⠀⠀⠀⠀⠄⠀⢀⠀⠁⡀⢀⠀⠈⢳⡘⢤⡓⡜⠤⠓⡎⣜⠳⣌⠳⣌⡹⢒⠦⣁⠶⡉⢦⡑⢎⡱⢌⢆⠳⣌⠱⢢⢅⠣⡜⡡⢎⡱⢊⡼⢡⡓
// ⡌⠱⡈⠔⡁⠎⡐⢣⠳⡅⢈⡐⠄⡀⠀⠀⠀⠀⢀⠀⠀⣀⠤⡒⢬⣉⠧⠙⠌⠋⠲⢄⡙⢦⡱⢜⡱⢢⠈⢀⡉⣀⡙⡰⢭⡙⡼⡑⠶⣌⠦⡑⢎⠴⣉⢎⡱⢌⢣⠣⢎⡱⢢⡑⢎⡔⠫⣐⢣⠘
// ⢍⡣⢝⡸⡑⢎⠔⢣⣙⠀⠂⠐⠀⠀⠀⠀⠂⠁⢀⡠⢚⠤⢣⡙⢢⠔⣢⠝⡬⢋⡵⢪⠜⠆⢳⣊⡱⣉⡌⣡⢈⣀⠑⠓⢦⡙⣖⣩⠳⣌⠞⣱⠪⡔⠣⢎⡔⢫⠬⣙⢎⡱⢣⠙⡢⢌⡱⢂⢎⠱
// ⣪⢔⡣⡒⡍⢎⡸⢤⠌⠀⠀⠀⠀⠀⠈⠀⢀⡰⢊⡔⡩⢎⡱⢜⢣⡙⢆⡹⢜⢣⣚⡱⢎⡝⢦⡀⠳⡜⡼⣡⢏⡼⣙⢎⠦⣜⠢⡕⡳⡜⢺⢤⡑⠩⣓⠌⠘⡥⠚⠔⡊⠴⣁⠫⢔⠣⡜⡡⣊⠮
// ⣛⢮⡵⣹⢞⣧⣛⠇⠀⠀⠀⠀⠀⠐⠀⡤⠃⡰⢡⢎⡱⣊⡕⠮⡅⠁⢠⢏⢎⠇⠈⡞⡼⣘⢧⡹⢄⠻⣔⢣⠞⡴⣩⢎⡳⣌⠳⣌⢣⢝⡣⠞⣜⡄⠈⠙⠆⡈⠔⡡⢌⠱⢠⠋⣌⠱⡘⡔⢣⠳
// ⣿⣹⣞⡽⣞⣮⡝⠀⠀⠀⠀⡀⠈⢀⠎⠀⡴⣉⠖⡎⡴⢣⡜⠃⠀⠀⡸⠎⠊⠀⠀⡟⡴⣍⠶⣙⠮⡜⡬⢧⡛⣤⢓⢮⡱⢎⡳⣜⢢⠣⣹⡙⢦⡙⠢⡘⢢⠉⠂⡅⢢⠘⡠⢑⠠⢃⡜⣌⢣⠓
// ⣷⣳⣾⣽⠮⠓⠠⠀⠀⠀⠀⠀⠠⠃⠀⡜⠴⢉⡜⣜⢱⡃⢢⢀⠠⠀⠝⠀⠀⢀⠂⡽⢲⡍⡞⣥⢛⡰⣝⢲⡙⢦⡋⢖⡹⢎⡵⣊⢧⢃⠡⣛⠄⢀⠱⠈⠀⢄⠓⡬⢡⢎⡰⢁⠢⡅⡒⠌⠦⣉
// ⣷⢫⡿⣿⣦⠁⠂⠀⠀⠀⡀⠄⠁⠀⡸⢌⠁⡖⠼⣌⠓⡠⠃⣬⣶⣀⣠⢂⡈⠀⢸⣍⢳⡜⣣⢇⢯⠐⣎⢧⡹⢣⣝⠨⡳⣍⠶⣩⠆⢫⠆⠘⠄⠀⠁⠀⡈⢤⠋⡔⢣⢊⠴⣋⠐⠈⠱⣉⠖⡡
// ⡾⣯⢽⣞⠾⠀⠀⠀⠀⠀⠀⠀⠀⢠⠣⠁⠰⣘⠣⢎⠐⣡⣽⣿⣿⣿⣿⣿⡏⠱⡸⢬⣓⠮⡵⣚⠮⢘⡜⢮⣱⢫⢜⡣⢵⣊⠷⣡⢏⠀⠷⠀⠈⠀⠀⠀⡜⠠⡍⢬⡑⢎⡒⣬⢛⢦⡐⠈⡖⡡
// ⡿⢧⣟⡾⡃⠀⠀⠀⠀⠀⠀⠀⠀⠰⠁⠀⣸⠁⠎⡄⢃⣾⣿⣿⣿⣿⣿⣿⠇⡁⡟⣧⡚⣝⡲⣍⠇⠸⣜⠳⣜⢣⢸⡱⡘⣬⢓⠧⣞⡀⠈⠇⠀⠀⠠⢀⠣⡑⠌⠂⡘⠠⠈⢵⣋⡞⡴⡀⠘⡥
// ⣯⣟⠾⣽⠁⠀⠀⠀⠀⠀⠀⠀⠠⢁⠠⠀⡄⠈⡔⣈⣾⣿⣿⣿⣿⣿⣿⡿⣈⠴⣻⠴⣹⢲⡹⡌⠀⢸⢎⡽⢬⡓⢨⢳⡁⢮⡝⡺⣔⡃⠀⠘⠀⠀⠀⠀⠀⠀⢀⠘⣭⢓⡌⠰⣍⢞⡱⢇⠀⢋
// ⣷⢞⡻⣣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠐⠀⠀⢢⠐⣾⣿⣿⣿⣿⣿⣿⣿⠇⡄⣛⢦⡋⢧⠇⡝⠀⠀⣏⡞⡼⢣⠇⢘⢧⠂⢣⢏⡵⢎⡅⠀⠀⠀⠂⢈⡑⠢⣀⠀⠀⢧⣋⠶⡘⡜⢮⡱⢫⠔⠀
// ⣯⢋⣴⡇⠀⠀⠀⡀⠀⠀⡀⠀⢁⠆⣰⢂⠌⠰⠠⣹⣿⣿⣿⣿⣿⣿⡟⢨⢰⢫⠖⣩⢳⠘⠀⠀⠸⣜⠼⣹⡍⠂⢸⢎⠁⢘⠮⣜⡣⠄⠀⠀⠀⠀⠀⠆⡑⢠⠂⡄⢳⣌⠳⣥⠛⣦⡙⠧⠎⠀
// ⣵⣻⣞⡇⠀⠀⠀⠀⠀⢀⠀⠀⡌⢰⢣⠋⠀⠀⠑⣺⣿⣿⣿⣿⣿⣿⢁⢃⡮⠇⢡⢇⠣⠀⠀⠂⢸⡜⣣⠗⠎⠀⢸⠎⠀⠈⡗⢮⡱⠀⠀⠀⠂⠀⢀⠘⠄⢣⠘⡠⢂⢪⠳⢬⡙⢦⠭⣙⠣⠀
// ⣿⣵⢻⠆⠀⠀⠀⠀⠄⠀⠀⠀⡜⢬⡳⣤⠆⡥⢸⣿⣿⣿⣿⣿⣿⠇⡌⡼⠘⢀⡎⣡⠂⠀⠁⢈⠶⣙⠦⠋⠀⠌⣸⠃⠀⠀⣏⠇⡇⠀⠀⠠⠀⠀⠀⠎⠘⠄⠣⠐⡁⢂⠹⣰⡙⣎⠧⣍⠧⠀
// ⡿⣞⡿⠀⠀⠀⠀⠂⠀⢀⠈⠰⡈⢶⢁⣾⡲⠇⣻⣿⣿⣿⣿⣿⡏⡰⠐⠀⡐⠀⢴⠡⢀⠀⢐⢊⡱⠣⠉⠀⡠⠃⡎⠀⠀⠀⣸⠙⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⣤⣀⠐⠂⡵⢚⡜⡲⢜⡢⢤
// ⢽⡺⡕⠀⠀⠠⠁⠀⠀⡀⠀⡱⢈⠆⡌⢡⠉⢴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣾⣳⠀⡀⠀⠄⡈⢏⣞⣼⡯⠄⠀⠈⠀⢀⠈⠀⠀⠀⠀⠄⠀⠄⠀⢰⡍⡞⠀⢸⣃⠶⡩⠞⣤⠓⠈⡄
// ⠎⠷⠃⠀⢀⠆⠀⠀⢀⠀⠀⡱⢈⡒⠌⡆⣉⣾⣿⣿⣿⣿⣿⣾⣿⣿⣵⣷⣭⣶⣻⣝⠒⠀⠀⢀⠀⠃⣼⣿⢘⠄⣼⣃⠀⠀⠀⠀⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⣏⠶⡉⠀⢶⣨⢓⠭⣎⡱⠂⢿
// ⢎⡱⠀⠀⡌⠀⠀⠀⠀⠀⠄⡑⢢⠑⣊⢴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣾⣳⠀⡀⠀⠄⡈⢏⣞⣼⡯⠄⠀⠈⠀⢀⠈⠀⠀⠀⠀⠄⠀⠄⠀⢰⡍⡞⠀⢸⣃⠶⡩⠞⣤⠓⠈⡄
// ⣿⠀⠀⡘⠀⠀⠀⠀⠁⠀⠠⠘⡄⣃⠆⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣸⣷⣧⣴⣛⡆⡰⢉⣴⣿⣿⣿⠔⠀⢁⠠⠀⠀⢀⠈⠀⠀⢀⠠⠀⢀⠷⡘⠀⢠⠳⣌⢳⣉⢳⠰⠃⠀⢂
// ⠃⠀⡰⠁⠀⠀⢀⠈⠀⠀⢁⠠⡘⢄⢊⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣮⣜⣛⣶⣭⣾⣿⣿⣿⣿⣿⣿⣿⣿⡿⠏⢴⣿⠄⠀⠀⠈⠀⠀⠀⣎⠃⠀⢀⣎⠳⣌⠧⡜⡁⡚⠀⠀⠠
// ⠀⠰⠁⠠⠀⠀⠀⠀⠀⠈⠀⢀⠈⢆⠣⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⢀⣆⡂⣿⠀⠀⠀⠁⠀⠀⡜⠀⠀⢠⠞⣌⢳⢸⡘⠆⢠⠁⠀⠀⣼
// ⠀⡱⢀⠃⠀⠀⡀⠁⠀⠐⠈⠀⡀⢈⠒⡌⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠁⠄⣻⣿⣽⡿⠀⠀⠀⠂⠁⠈⠀⢀⢠⡓⢞⡌⢧⣊⠵⠀⠄⢠⠀⢻⡽
// ⠠⠁⡄⡃⠀⠀⠀⠀⠀⠂⡀⠠⠀⠀⠣⠌⣿⣿⣿⣯⣿⣻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⣀⣎⣴⣿⣿⡿⠁⠀⠀⠀⡀⠄⠀⢀⡴⢣⡙⣎⡜⢦⡱⠀⠀⢠⠣⡄⠀⢻
// ⢆⠡⢂⠥⠀⠀⠁⠀⢀⠀⣇⠀⠠⠐⠀⢃⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⢋⠅⡈⠛⠃⠶⡽⠷⠾⠿⠛⠁⠀⠀⠀⢀⠀⠀⣰⢊⡖⡣⣝⡰⡚⡔⠀⠀⠀⣎⠱⡘⣄⠀
// ⣊⠰⣉⠒⠀⠀⡀⠁⠀⢨⡽⡀⠀⠀⠐⠈⠼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣟⠛⡏⢍⡒⡘⡄⢣⠘⠤⠡⠌⠄⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⣤⠚⣥⠳⣸⢑⠦⢣⠍⠀⠀⠀⠼⣐⢣⠱⡌⠂
// ⢆⠰⢂⡍⠂⠀⠀⠀⠀⢸⣳⣟⡀⠀⠀⠂⠉⢁⠉⢉⠉⡉⢉⠉⣘⡐⢢⠥⠣⢌⠚⡌⠒⡌⠰⡘⠤⡉⣠⠇⡤⣀⡀⠀⠀⠀⠀⡀⠁⣠⢔⡫⢆⡛⣤⠳⣡⠎⡝⠁⠀⠀⠐⠀⠠⢑⠊⡕⠈⠀
// ⢎⡐⠣⢌⡅⠀⠀⠁⠀⢸⣷⣫⣟⠀⠀⠀⠐⠀⠀⠀⠀⠀⠀⠀⡐⢌⠡⢊⠱⣈⠒⡌⠱⣈⠱⣰⠟⢩⢆⡹⢔⡡⠆⠀⠀⠂⢠⢔⡹⣂⠷⣨⢇⡙⢶⣿⣶⣍⠀⠄⠀⠁⠀⡱⢄⡀⠑⠌⠀⠀
// ⠀⠬⡑⠢⢜⡀⠠⠀⠁⠈⢷⣟⣾⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠈⢢⢁⠒⡄⢃⠌⠡⠐⢠⡒⣌⠣⢎⡔⢣⠌⠀⣀⠴⣩⠓⣎⡱⢜⠢⢇⢎⡹⢌⠝⠛⠊⠁⠀⠀⠐⠀⠘⠢⢍⠒⡀⠀⠀
// ⡁⠠⠘⡑⢢⠜⡀⠀⠄⠂⠀⠙⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡀⠀⠁⠈⠀⠀⠀⡰⢣⠐⣌⠳⢬⠘⢀⠤⣪⠕⣣⢃⢯⠐⡡⢎⡝⡸⢌⡒⠁⡀⢤⠰⢌⡒⠤⢄⡀⠄⠈⠊⡑⠀⠀⠀
// ⣷⡄⠀⠀⠡⢊⠱⠄⢀⠀⠢⡀⠀⠳⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⣡⠃⡘⢦⠙⢀⠴⣩⠚⣥⠚⡥⠋⠀⡰⢱⠪⠴⢉⠤⡰⠩⠜⣄⠫⢰⠘⣘⠢⡘⡐⢢⠀⠀⠀⠀⠀
// ⣧⠉⢲⣀⠀⠠⠑⢊⠤⠀⠄⢑⠢⠀⠀⠄⠀⠀⢀⠀⢀⠠⣀⢀⠀⠀⠀⠀⠀⠀⠀⡜⡱⢂⠇⡩⠂⢤⣋⡜⢆⡻⢰⡙⠂⠀⢡⢍⠣⢉⡔⡡⢎⢡⠣⠍⣄⠣⢡⠚⢄⠣⡐⢡⠂⠀⠀⠀⠀⠀