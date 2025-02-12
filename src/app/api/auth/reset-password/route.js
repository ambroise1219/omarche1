import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { sendResetEmail } from '../../../../lib/email'; // À implémenter
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();

    if (email) {
      const userResult = await pool.query(
        'SELECT id, role FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Aucun compte trouvé avec cet email" },
          { status: 404 }
        );
      }

      const user = userResult.rows[0];

      // Générer un token unique pour la réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 heure

      // Stocker le token (il faudra créer une table password_resets)
      await pool.query(
        `INSERT INTO password_resets (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, resetToken, tokenExpiry]
      );

      // Envoyer l'email
      await sendResetEmail(email, resetToken);

      return NextResponse.json({
        message: "Email de réinitialisation envoyé"
      });
    } else if (token && password) {
      // Vérifier le token
      const decoded = verify(token, process.env.JWT_SECRET);
      if (!decoded.email) {
        return NextResponse.json(
          { error: 'Token invalide' },
          { status: 400 }
        );
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mettre à jour le mot de passe
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, decoded.email]
      );

      return NextResponse.json({ 
        message: 'Mot de passe modifié avec succès' 
      });
    } else {
      return NextResponse.json(
        { error: 'Requête invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur reset password:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
