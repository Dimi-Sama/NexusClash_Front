#!/bin/bash

# Démarrer les conteneurs
docker-compose up -d

# Attendre que Ollama soit prêt
echo "Attente du démarrage d'Ollama..."
sleep 10

# Télécharger le modèle
echo "Téléchargement de llama3.2..."
docker exec NexusClash-ollama ollama pull llama3.2

# Exécuter les migrations
echo "Exécution des migrations..."
docker exec NexusClash-api flask db upgrade

# Créer l'utilisateur admin via Python
echo "Création de l'utilisateur admin..."
docker exec NexusClash-api python3 -c "
from app import app, db
from app.models import Utilisateur
from werkzeug.security import generate_password_hash

with app.app_context():
    admin = Utilisateur(
        nom_utilisateur='admin',
        email='admin@nexusclash.com',
        mot_de_passe=generate_password_hash('Admin123!'),
        is_admin=True
    )
    db.session.add(admin)
    try:
        db.session.commit()
        print('Utilisateur admin créé avec succès')
    except Exception as e:
        db.session.rollback()
        print('Erreur lors de la création de l\'admin:', str(e))
"

echo "Installation terminée !" 