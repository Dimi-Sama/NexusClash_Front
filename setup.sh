#!/bin/bash

# Démarrer les conteneurs
echo "Démarrage des conteneurs..."
docker-compose up -d

# Attendre que Ollama soit prêt
echo "Attente du démarrage d'Ollama..."
sleep 10

# Télécharger le modèle
echo "Téléchargement de llama3.2..."
docker exec NexusClash-ollama ollama pull llama3.2

sleep 2

# Exécuter les migrations
echo "Exécution des migrations..."
docker exec NexusClash-api flask db current
docker exec NexusClash-api flask db upgrade

sleep 5

# Créer l'utilisateur admin via Python
echo "Création de l'utilisateur admin..."
docker exec NexusClash-api python3 -c "
from app import create_app
from app.models import Utilisateur, db
import bcrypt

app = create_app()
with app.app_context():
    try:
        # Vérifier si l'admin existe déjà
        admin = Utilisateur.query.filter_by(email='admin@nexusclash.com').first()
        if admin:
            print('L\'administrateur existe déjà')
        else:
            password = 'Nexus1234'.encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            admin = Utilisateur(
                nom_utilisateur='Nexus',
                email='admin@nexusclash.com',
                mot_de_passe=hashed_password.decode('utf-8'),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print('Utilisateur admin créé avec succès')
    except Exception as e:
        print('Erreur lors de la création de l\'admin:', str(e))
"

echo "Installation terminée !" 