import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { sendResetEmail } from '../../../../lib/email'; // À implémenter

export async function POST(request) {
  try {
    const { email } = await request.json();

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

  } catch (error) {
    console.error('Erreur reset password:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
