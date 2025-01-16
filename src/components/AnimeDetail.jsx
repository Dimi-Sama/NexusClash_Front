import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AnimeDetail.css';
import SearchAnime from './SearchAnime';
import { getCurrentUser} from "../api/auth";

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [relations, setRelations] = useState([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(true);

  useEffect(() => {
    // Charger d'abord les données principales de l'anime
    const fetchAnimeData = async () => {
      try {
        const animeResponse = await fetch(`http://localhost:5000/anime/${id}`);
        const animeData = await animeResponse.json();
        setAnime(animeData);
        
        // Après avoir chargé l'anime, charger les données supplémentaires
        fetchExtraData();
      } catch (error) {
        console.error('Erreur lors du chargement de l\'anime:', error);
      }
    };

    fetchAnimeData();
  }, [id]);

  const fetchExtraData = async () => {
    setIsLoadingExtra(true);
    try {
      const [recommendationsResponse, relationsResponse] = await Promise.all([
        fetch(`http://localhost:5000/anime/${id}/recommendations`),
        fetch(`http://localhost:5000/anime/${id}/relations`)
      ]);
      
      const recommendationsData = await recommendationsResponse.json();
      const relationsData = await relationsResponse.json();
      
      setRecommendations(recommendationsData);
      setRelations(relationsData.filter(relation => relation.media_type === "anime"));
    } catch (error) {
      console.error('Erreur lors du chargement des données supplémentaires:', error);
    } finally {
      setIsLoadingExtra(false);
    }
  };
  const addToUserList = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
              const user = await getCurrentUser();
      const response = await fetch('http://localhost:5000/anime/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id, // Remplacer par l'ID utilisateur réel
          anime_id: anime.id,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        console.error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  if (!anime) return <div>Chargement...</div>;

  return (
    <div className="anime-detail-container">
      <SearchAnime />
      <div className="anime-detail-content">
        <div className="content-layout">
          {/* Colonne de gauche - Relations */}
          <div className="related-section">
            <h2>Related Anime</h2>
            <div className="related-list">
              {isLoadingExtra ? (
                <div className="loading-message">Loading related anime...</div>
              ) : relations.length > 0 ? (
                relations.map((relation) => (
                  <Link 
                    to={`/anime/${relation.id}`} 
                    key={relation.id}
                    className="related-item"
                  >
                    <div className="relation-info">
                      <div className="relation-type">{relation.type}</div>
                      <h3>{relation.title}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-data-message">No related anime found</div>
              )}
            </div>
          </div>

          {/* Contenu central */}
          <div className="main-content">
            <div className="anime-header">
              <img src={anime.image_url} alt={anime.title_english} className="anime-image" />
              <div className="anime-info">
                <h1>{anime.title_english || anime.title_japanese}</h1>
                <p className="date">Release date: {anime.aired.string}</p>
                <p className="description">{anime.description}</p>
              </div>
            </div>
            <button onClick={addToUserList} className="add-to-list-button">Add to My List</button>
            {anime.trailer && (
              <div className="trailer-section">
                <h2>Trailer</h2>
                <iframe
                  src={anime.trailer.embed_url}
                  title="trailer"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Colonne de droite - Recommandations */}
          <div className="recommendations-section">
            <h2>Recommendations</h2>
            <div className="recommendations-list">
              {isLoadingExtra ? (
                <div className="loading-message">Loading recommendations...</div>
              ) : recommendations.length > 0 ? (
                recommendations.slice(0, 8).map((rec) => (
                  <Link 
                    to={`/anime/${rec.id}`} 
                    key={rec.id}
                    className="recommendation-item"
                  >
                    <img src={rec.image_url} alt={rec.title_japanese} />
                    <h3>{rec.title_japanese}</h3>
                  </Link>
                ))
              ) : (
                <div className="no-data-message">No recommendations found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail; 
// (Created by Dimi-Sama | CSS by Dimi-Sama)
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