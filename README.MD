# Projet SpéDev

Ce README vous guide à travers la mise en place et le démarrage du projet Node.js qui comprend une partie serveur et une partie client.

## Prérequis

Assurez-vous d'avoir Node.js et npm installés sur votre machine. Pour vérifier si Node.js et npm sont installés, vous pouvez exécuter les commandes suivantes :

```bash
node -v
npm -v
```

Si ces commandes affichent les versions, alors les outils sont correctement installés. Sinon, vous devez les installer avant de procéder.

## Installation

Pour mettre en place le projet, suivez ces étapes :

1. **Clonage du dépôt**

   Tout d'abord, clonez le dépôt où se trouve l'archive du projet. Si l'archive est déjà sur votre système, placez-la dans le répertoire de votre choix et décompressez-la.

   ```bash
   git clone <URL_DU_REPO>
   cd <NOM_DU_REPO>
   ```

2. **Configuration du serveur**

   Changez de répertoire pour entrer dans le dossier du serveur, installez les dépendances et démarrez le serveur :

   ```bash
   cd serveur
   npm install
   node app.js
   ```

   Laissez cette fenêtre de terminal ouverte pour que le serveur continue à tourner.

3. **Configuration du client**

   Ouvrez une nouvelle fenêtre de terminal, puis changez de répertoire pour entrer dans le dossier du client, installez les dépendances et démarrez le client :

   ```bash
   cd client
   npm install
   node app.js
   ```

## Utilisation

Une fois que le serveur et le client sont démarrés, vous pouvez accéder à l'application via un navigateur web à l'adresse indiquée par le serveur (généralement `http://localhost:3000` pour les projets Node.js).

Pour arrêter le serveur ou le client, appuyez sur `CTRL + C` dans le terminal correspondant.
