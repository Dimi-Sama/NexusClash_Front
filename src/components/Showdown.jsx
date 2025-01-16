import React, { useState, useEffect } from 'react'
import './Showdown.css'
import io from 'socket.io-client';
import { getCurrentUser } from '../api/auth';

function Showdown() {
  const getRandomColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [bataille, setBataille] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [currentTour, setCurrentTour] = useState(0);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [backgroundLayers, setBackgroundLayers] = useState({
    layer1: Math.floor(Math.random() * 328),
    layer2: Math.floor(Math.random() * 328)
  });

  useEffect(() => {
    // Charger l'utilisateur au montage du composant
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    loadUser();

    // Connexion WebSocket
    const newSocket = io('/', {
      withCredentials: false,
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      cors: {
          origin: "*",
          methods: ["GET", "POST"]
      }
  });
    setSocket(newSocket);

    // Demander la bataille actuelle au serveur
    newSocket.emit('get_current_battle');

    newSocket.on('current_battle', (data) => {
        console.log('Bataille actuelle reçue:', data);
        if (data) {
            setBataille(data);
            setLoading(false);
            
            // Rejoindre la room de la bataille
            if (data.id_bataille) {
                newSocket.emit('join_battle', { battle_id: data.id_bataille });
                
                // Demander l'historique des messages
                newSocket.emit('get_message_history', { battle_id: data.id_bataille });
            }
        }
    });

    // Recevoir l'historique des messages
    newSocket.on('message_history', (messages) => {
        console.log('Historique des messages reçu:', messages);
        setMessages(messages);
    });

    // Logs de débogage améliorés
    newSocket.on('connect', () => {
        console.log('Connecté au serveur WebSocket', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
        console.error('Erreur de connexion:', error);
    });

    newSocket.on('nouvelle_bataille', (data) => {
      console.log('Données bataille reçues:', data);
      setBataille(data);
      setLoading(false);
      
      // Mise à jour du fond lors de la réception d'une nouvelle bataille
      setBackgroundLayers({
        layer1: Math.floor(Math.random() * 328),
        layer2: Math.floor(Math.random() * 328)
      });
      
      // Rejoindre la room de la bataille
      if (data && data.id_bataille) {
          newSocket.emit('join_battle', { battle_id: data.id_bataille });
          console.log('Rejoint la bataille:', data.id_bataille);
      }
      
      if (data && data.resultat) {
        try {
          let toursData;
          if (typeof data.resultat === 'string') {
            // Si c'est une chaîne JSON valide, on la parse
            try {
              toursData = JSON.parse(data.resultat);
            } catch {
              // Si le parsing échoue, on utilise la chaîne directement
              toursData = data.resultat;
            }
          } else {
            // Si ce n'est pas une chaîne, on utilise directement
            toursData = data.resultat;
          }
          
          // Conversion en tableau si nécessaire
          const toursArray = Array.isArray(toursData) 
            ? toursData 
            : typeof toursData === 'object'
              ? Object.values(toursData)
              : [String(toursData)];
              
          setTours(toursArray);
        } catch (error) {
          console.error('Erreur de traitement:', error);
          setTours([String(data.resultat)]);
        }
      }
    });

    newSocket.on('nouveau_message', (message) => {
        try {
            console.log('Message brut reçu:', message);
            const messageData = typeof message === 'string' ? JSON.parse(message) : message;
            console.log('Message traité:', messageData);
            
            if (messageData && messageData.contenu) {
                setMessages(prevMessages => [...prevMessages, messageData]);
            } else {
                console.error('Format de message invalide:', messageData);
            }
        } catch (error) {
            console.error('Erreur de traitement du message:', error, message);
        }
    });

    newSocket.on('erreur_message', (error) => {
        console.error('Erreur de message:', error);
    });

    // Nettoyage à la déconnexion
    return () => {
        console.log('Déconnexion du socket');
        newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };

    // Désactiver le défilement de la molette
    document.addEventListener('wheel', preventDefault, { passive: false });

    // Nettoyage lors du démontage du composant
    return () => {
      document.removeEventListener('wheel', preventDefault);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket && bataille && currentUser) {
      console.log('Current user:', currentUser); // Debug log
      
      const messageData = {
        id_utilisateur: currentUser.id, // Retour à id_utilisateur
        username: currentUser.username,
        id_bataille: bataille.id_bataille, // Changement de battle_id à id_bataille
        contenu: messageInput // Retour à contenu
      };
      
      console.log('Message data:', messageData); // Debug log
      socket.emit('envoyer_message', messageData);
      setMessageInput('');
    }
  };

  // Modification de fetchBataille pour utiliser les websockets
  const fetchBataille = () => {
    if (socket) {
        socket.emit('demander_bataille');
    }
  };

  return (
    <div className="showdown-page">
      <div className="showdown-container">
        <div className="battle-background">
        <iframe 
            src={`https://www.gjtorikian.com/Earthbound-Battle-Backgrounds-JS/?layer1=${backgroundLayers.layer1}&layer2=${backgroundLayers.layer2}&fullscreen=true`} 
            frameborder="0"
            style={{pointerEvents: 'none'}}
            title="battle-background"
            tabIndex="-1">
          </iframe>
        </div>

        {currentUser?.is_admin && (
          <button className="new-battle-btn" onClick={fetchBataille}>
            Nouvelle Bataille
          </button>
        )}
        
        {error ? (
          <div className="error-message">
            {error}
            <button onClick={fetchBataille}>Réessayer</button>
          </div>
        ) : (
          <>
            <div className="character-left">
              {bataille && (
                <>
                  <img src={bataille.personnage_1.image} alt={bataille.personnage_1.nom} />
                  <div className="character-name">{bataille.personnage_1.nom}</div>
                </>
              )}
            </div>
            
            <div className="vs-symbol">
              <span>VS</span>
            </div>
            
            <div className="character-right">
              {bataille && (
                <>
                  <img src={bataille.personnage_2.image} alt={bataille.personnage_2.nom} />
                  <div className="character-name">{bataille.personnage_2.nom}</div>
                </>
              )}
            </div>
            
            <div className="battle-text">
                {loading ? (
                    <p>Chargement du combat...</p>
                ) : bataille && bataille.resultat ? (
                    <p>{bataille.resultat}</p>
                ) : (
                    <p>En attente d'une nouvelle bataille...</p>
                )}
            </div>
          </>
        )}
      </div>

      <div className="chat-section">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.id_utilisateur === currentUser?.id ? 'own-message' : ''}`}>
              <span 
                className="username" 
                style={{ color: getRandomColor(msg.username || 'Anonyme') }}
              >
                {msg.username || 'Anonyme'}
              </span>
              <span className="message">{msg.contenu}</span>
            </div>
          ))}
        </div>
        
        {currentUser ? (
          <div className="chat-input-container">
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Envoyez un message..." 
              className="chat-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
            />
            <button className="chat-send-button" onClick={handleSendMessage}>
              Envoyer
            </button>
          </div>
        ) : (
          <div className="chat-login-message">
            Connectez-vous pour participer au chat
          </div>
        )}
      </div>
    </div>
  );
}

export default Showdown 
// (Created by Dimi-Sama)
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