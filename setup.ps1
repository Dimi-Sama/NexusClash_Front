# Démarrer les conteneurs
Write-Host "Démarrage des conteneurs..."
docker-compose up -d

# Attendre que Ollama soit prêt
Write-Host "Attente du démarrage d'Ollama..."
Start-Sleep -Seconds 10

# Télécharger le modèle
Write-Host "Téléchargement de llama3.2..."
docker exec NexusClash-ollama ollama pull llama3.2

# Exécuter les migrations
Write-Host "Exécution des migrations..."
docker exec NexusClash-api flask db current
docker exec NexusClash-api flask db upgrade

# Créer l'utilisateur admin via Python
Write-Host "Création de l'utilisateur admin..."
$pythonScript = @"
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
"@

docker exec NexusClash-api python3 -c "$pythonScript"

Write-Host "Installation terminée !" 