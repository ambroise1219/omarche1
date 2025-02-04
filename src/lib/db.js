import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Exécute une requête SQL avec des paramètres
 * @param {string} text - La requête SQL
 * @param {Array} params - Les paramètres de la requête
 * @returns {Promise} - Le résultat de la requête
 */
export const executeQuery = async (text, params) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    throw error;
  }
};

export default pool;
