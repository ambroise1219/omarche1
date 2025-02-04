-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    profile_bio TEXT,
    address TEXT,
    profile_image_url VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_phone_number CHECK (phone_number ~ '^[+]?[0-9]{10,15}$')
);

-- Table des catégories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category_id INT REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des images de produits
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_order_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Table des détails de commande
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Table des favoris
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Table du panier
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Table de l'historique des vues de produits
CREATE TABLE product_views (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    view_count INT DEFAULT 1,
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Table des bannières
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paramètres
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des livraisons
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    delivery_person_id INT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des positions de livraison
CREATE TABLE delivery_positions (
    id SERIAL PRIMARY KEY,
    delivery_id INT REFERENCES deliveries(id) ON DELETE CASCADE,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création des indices
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);
CREATE INDEX idx_product_views_user ON product_views(user_id);
CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_products_category ON products(category_id);

-- Commentaires
COMMENT ON COLUMN users.phone_number IS 'Numéro de téléphone de l''utilisateur au format international';
COMMENT ON COLUMN users.profile_bio IS 'Biographie ou description du profil utilisateur';
COMMENT ON COLUMN users.address IS 'Adresse de livraison par défaut';
COMMENT ON TABLE favorites IS 'Table des produits favoris des utilisateurs';
COMMENT ON TABLE cart_items IS 'Table du panier d''achat des utilisateurs';
COMMENT ON TABLE product_views IS 'Historique des vues de produits par utilisateur';
