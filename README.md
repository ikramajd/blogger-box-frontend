# Blogger Box Frontend

Frontend Angular pour les sessions 05 et 06.

## Fonctionnalites

- Liste des posts recuperes depuis le backend.
- Filtre par texte, categorie et date.
- Detail d'un post.
- Creation d'un post via `/add-post`.
- Formulaire reactif avec validations.
- Chargement des categories depuis `/v1/categories`.
- Notifications SweetAlert2.
- Proxy Angular vers le backend Spring Boot.

## Lancer

Le backend doit tourner sur `http://localhost:8080`.

```bash
npm start
```

L'application est disponible sur :

```text
http://localhost:4200
```

Si le port 4200 est deja pris :

```bash
npm start -- --host 127.0.0.1 --port 4201 --proxy-config proxy.conf.cjs
```

## Build

```bash
npm run build
```

## Routes

- `/` : liste des posts.
- `/add-post` : formulaire de creation.
- `/posts/:id` : detail d'un post.
