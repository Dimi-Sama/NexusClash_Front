import React from 'react'
import './Showdown.css'
import Navbar from './Navbar'

function Showdown() {
  return (
    <div className="showdown-page">
      <Navbar />
      <main className="showdown-container">
        <div className="character-left">
          <img src="/path/to/character1" alt="Character 1" />
        </div>
        
        <div className="vs-symbol">
          <span>VS</span>
        </div>
        
        <div className="character-right">
          <img src="/path/to/character2" alt="Character 2" />
        </div>
        
        <div className="match-info">
          <h2>Character 1 vs Character 2</h2>
        </div>
      </main>

      <div className="chat-section">
        <div className="chat-messages">
          <div className="chat-message">
            <span className="username">User1:</span>
            <span className="message">Message text</span>
          </div>
        </div>
        <div className="chat-input-container">
          <input 
            type="text" 
            placeholder="Send a message..." 
            className="chat-input"
          />
          <button className="chat-send-button">Send</button>
        </div>
      </div>
    </div>
  )
}

export default Showdown 