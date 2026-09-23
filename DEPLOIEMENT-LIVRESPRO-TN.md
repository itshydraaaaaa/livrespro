# LivresPro.tn — déploiement et accès administrateur

## Domaine de production
- Site public : `https://livrespro.tn`
- Administration : `https://livrespro.tn/admin`
- Commandes : `https://livrespro.tn/admin/commandes`
- Offre Educator : `https://livrespro.tn/admin/offre-educator`
- Contenus : `https://livrespro.tn/admin/contenu`
- SEO : `https://livrespro.tn/admin/seo`
- Audience : `https://livrespro.tn/admin/audience`

Le domaine doit être relié à l'hébergement par DNS chez le registrar du `.tn`. Le code ne peut pas réserver ni modifier le DNS du domaine à lui seul.

## Accès administrateur actuel
Le projet utilise l'authentification OAuth existante. Aucun mot de passe administrateur n'est stocké dans le dépôt.

Variables nécessaires :
- `VITE_APP_ID` : identifiant de l'application OAuth
- `OAUTH_SERVER_URL` : serveur OAuth
- `OWNER_OPEN_ID` : identifiant OAuth du propriétaire. Ce compte reçoit automatiquement le rôle `admin`.
- `JWT_SECRET` : secret long et aléatoire pour signer la session
- `DATABASE_URL` : chaîne de connexion MySQL
- `NODE_ENV=production`

Ne jamais publier les valeurs réelles de `JWT_SECRET`, `DATABASE_URL` ou des identifiants privés dans Git ou dans une archive publique.

## Commandes
Le parcours de commande est interne au site. Les coordonnées client et commandes sont enregistrées dans MySQL. Le paiement prévu est à la livraison. Shopify n'est pas nécessaire pour ce flux.

## Domaine et SEO
Dans Admin > SEO, utiliser des URL canoniques commençant par `https://livrespro.tn/`.

## Mise en production
1. Créer la base MySQL et définir `DATABASE_URL`.
2. Définir les variables d'environnement ci-dessus sur le serveur.
3. Installer les dépendances avec `pnpm install`.
4. Appliquer le schéma/migrations Drizzle selon le workflow d'hébergement.
5. Construire avec `pnpm build`.
6. Démarrer l'application avec le script de production du projet.
7. Faire pointer `livrespro.tn` et `www.livrespro.tn` vers l'hébergement.
8. Activer HTTPS.
9. Configurer l'URL de retour OAuth pour le domaine de production.
10. Se connecter avec le compte dont l'OpenID correspond à `OWNER_OPEN_ID`, puis ouvrir `/admin`.

## Important
Le nom de domaine de production est désormais LivresPro.tn. Le nom éditorial visible peut rester « L’Atelier des Pages » tant qu'une décision de rebranding distincte n'est pas prise.
