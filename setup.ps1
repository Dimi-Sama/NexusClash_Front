# Démarrer les conteneurs
Write-Host "Démarrage des conteneurs..."
docker-compose up -d

Start-Sleep -Seconds 2

# Exécuter les migrations
Write-Host "Exécution des migrations..."
docker exec NexusClash-api flask db current
docker exec NexusClash-api flask db upgrade

# Attendre que les migrations soient terminées
Start-Sleep -Seconds 5

# Créer l'utilisateur admin via Python
Write-Host "Création de l'utilisateur admin..."
$pythonScript = @"
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
"@

docker exec NexusClash-api python3 -c "$pythonScript"

Write-Host "Installation terminée !" 