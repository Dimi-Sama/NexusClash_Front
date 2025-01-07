import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      {/* Votre contenu de page d'accueil actuel */}
      <h1>Accueil</h1>
      <Link to="/showdown">Aller au Showdown</Link>
    </div>
  )
}

export default Home