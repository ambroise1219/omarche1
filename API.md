# Documentation API O'Marché

Cette documentation détaille toutes les APIs disponibles pour l'application mobile O'Marché.

## Base URL
```
https://api.omarche.ci
```

## Authentification
Toutes les requêtes (sauf login/register) doivent inclure un token JWT dans le header :
```http
Authorization: Bearer <votre_token_jwt>
```

## Endpoints

### 🔐 Authentification

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Réponse:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Register
```http
POST /api/auth/register
```
**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

### 📦 Produits

#### Liste des produits
```http
GET /api/products
```
**Query Parameters:**
- `category_id` (optionnel): Filtrer par catégorie
- `search` (optionnel): Recherche par nom
- `limit` (optionnel): Nombre de résultats par page
- `offset` (optionnel): Offset pour la pagination

**Réponse:**
```json
{
  "products": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "category_id": "string",
    "image_url": "string",
    "created_at": "string"
  }],
  "total": "number"
}
```

#### Détails d'un produit
```http
GET /api/products/{id}
```
**Réponse:** Objet produit

#### Créer un produit
```http
POST /api/products
```
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "category_id": "string",
  "image_url": "string"
}
```

#### Mettre à jour un produit
```http
PUT /api/products/{id}
```
**Body:** Mêmes champs que la création (tous optionnels)

#### Supprimer un produit
```http
DELETE /api/products/{id}
```

### 📝 Commandes

#### Liste des commandes
```http
GET /api/orders
```
**Query Parameters:**
- `status` (optionnel): Filtrer par statut
- `user_id` (optionnel): Filtrer par utilisateur

**Réponse:**
```json
{
  "orders": [{
    "id": "string",
    "user_id": "string",
    "total": "number",
    "status": "string",
    "created_at": "string",
    "items": [{
      "product_id": "string",
      "quantity": "number",
      "price": "number"
    }]
  }]
}
```

#### Détails d'une commande
```http
GET /api/orders/{id}
```

#### Créer une commande
```http
POST /api/orders
```
**Body:**
```json
{
  "items": [{
    "product_id": "string",
    "quantity": "number"
  }]
}
```

#### Mettre à jour le statut d'une commande
```http
PUT /api/orders/{id}
```
**Body:**
```json
{
  "status": "string" // processing, shipping, completed, cancelled
}
```

### 🚚 Livraisons

#### Liste des livraisons
```http
GET /api/deliveries
```
**Query Parameters:**
- `status` (optionnel): Filtrer par statut
- `delivery_person_id` (optionnel): Filtrer par livreur

**Réponse:**
```json
{
  "deliveries": [{
    "id": "string",
    "order_id": "string",
    "delivery_person_id": "string",
    "status": "string",
    "created_at": "string",
    "delivery_person_name": "string",
    "latitude": "number",
    "longitude": "number"
  }]
}
```

#### Détails d'une livraison
```http
GET /api/deliveries/{id}
```

#### Mettre à jour une livraison
```http
PUT /api/deliveries/{id}
```
**Body:**
```json
{
  "status": "string", // pending, preparing, pickup, delivering, completed, cancelled
  "latitude": "number",
  "longitude": "number"
}
```

### 📁 Catégories

#### Liste des catégories
```http
GET /api/categories
```
**Réponse:**
```json
{
  "categories": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "image_url": "string"
  }]
}
```

#### Détails d'une catégorie
```http
GET /api/categories/{id}
```

#### Créer une catégorie
```http
POST /api/categories
```
**Body:**
```json
{
  "name": "string",
  "description": "string",
  "image_url": "string"
}
```

#### Mettre à jour une catégorie
```http
PUT /api/categories/{id}
```

#### Supprimer une catégorie
```http
DELETE /api/categories/{id}
```

## Gestion des erreurs

Les erreurs sont retournées avec un code HTTP approprié et un corps JSON :
```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Codes d'erreur communs :
- `400`: Requête invalide
- `401`: Non authentifié
- `403`: Non autorisé
- `404`: Ressource non trouvée
- `500`: Erreur serveur

## Pagination

Pour les endpoints qui supportent la pagination :
```http
GET /api/resources?limit=10&offset=0
```

**Réponse:**
```json
{
  "data": [...],
  "pagination": {
    "total": "number",
    "limit": "number",
    "offset": "number",
    "has_more": "boolean"
  }
}
```

## Bonnes pratiques
1. Utilisez toujours HTTPS
2. Mettez en cache les réponses quand c'est possible
3. Implémentez une gestion d'erreur robuste
4. Utilisez la pagination pour les listes longues
5. Envoyez le token dans chaque requête
6. Rafraîchissez le token quand nécessaire
