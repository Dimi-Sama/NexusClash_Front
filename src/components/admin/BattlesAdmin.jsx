import React, { useState, useEffect } from 'react'
import axiosInstance from '../../api/auth'
import './BattlesAdmin.css'
import DataTable from 'react-data-table-component'

function BattlesAdmin() {
  const [battles, setBattles] = useState([])
  const [characters, setCharacters] = useState([])
  const [selectedBattle, setSelectedBattle] = useState(null)
  const [formData, setFormData] = useState({
    id_personnage_1: '',
    id_personnage_2: '',
    date_bataille: new Date().toISOString().slice(0, 16)
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBattles()
    fetchCharacters()
  }, [])

  const fetchBattles = async () => {
    try {
      const response = await axiosInstance.get('/batailles/');
      setBattles(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des batailles');
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await axiosInstance.get('/personnages/');
      setCharacters(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des personnages');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBattle) {
        await axiosInstance.put(`/batailles/${selectedBattle.id_bataille}/`, formData);
      } else {
        await axiosInstance.post('/batailles/', formData);
      }
      fetchBattles();
      resetForm();
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bataille ?')) {
      try {
        await axiosInstance.delete(`/batailles/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchBattles();
      } catch (error) {
        console.error('Erreur détaillée:', error);
        setError('Erreur lors de la suppression');
      }
    }
  }

  const resetForm = () => {
    setSelectedBattle(null)
    setFormData({
      id_personnage_1: '',
      id_personnage_2: '',
      date_bataille: new Date().toISOString().slice(0, 16)
    })
  }

  const getCharacterName = (id) => {
    const character = characters.find(c => c.id === id)
    return character ? character.nom : 'Inconnu'
  }

  // Configuration des colonnes pour DataTable
  const columns = [
    {
      name: 'ID',
      selector: row => row.id_bataille,
      sortable: true,
      width: '100px'
    },
    {
      name: 'Personnage 1',
      selector: row => getCharacterName(row.id_personnage_1),
      sortable: true,
      width: '200px'
    },
    {
      name: 'Personnage 2',
      selector: row => getCharacterName(row.id_personnage_2),
      sortable: true,
      width: '200px'
    },
    {
        name: 'resultat',
        selector: row => row.resultat,
        sortable: true,
        width: '200px'
    },
    {
      name: 'Date',
      selector: row => new Date(row.date_bataille).toLocaleString(),
      sortable: true,
      width: '200px'
    },
    {
      name: 'Actions',
      cell: row => (
        <button onClick={() => handleDelete(row.id_bataille)} className="delete-btn">
          Supprimer
        </button>
      ),
      width: '150px'
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
    <div className="battles-admin">
      <h1>Gestion des Batailles</h1>

      <div className="battles-list-section">
        <h2>Liste des Batailles</h2>
        <DataTable
          columns={columns}
          data={battles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          customStyles={customStyles}
          striped
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent="Aucune bataille trouvée"
        />
      </div>
    </div>
  )
}

export default BattlesAdmin 
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