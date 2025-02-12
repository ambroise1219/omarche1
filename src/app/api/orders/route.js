import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { verifyAuth } from '../../../../lib/auth';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        u.username,
        u.email,
        u.phone_number,
        json_agg(
          json_build_object(
            'product_id', od.product_id,
            'quantity', od.quantity,
            'price', od.price,
            'product', (
              SELECT json_build_object(
                'name', p.name,
                'image_url', (
                  SELECT image_url 
                  FROM product_images pi 
                  WHERE pi.product_id = p.id 
                  LIMIT 1
                )
              )
              FROM products p 
              WHERE p.id = od.product_id
            )
          )
        ) as items
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_details od ON o.id = od.order_id
      GROUP BY o.id, u.id
      ORDER BY o.created_at DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    

    const { formData, cartItems, total, user } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id, role FROM users WHERE email = $1',
      [formData.email]
    );

    if (existingUser.rows.length > 0 && !user) {
      return NextResponse.json({
        error: "Cet email existe déjà",
        type: "EMAIL_EXISTS",
        role: existingUser.rows[0].role
      }, { status: 409 });
    }

    // Formater le numéro de téléphone
    const formatPhoneNumber = (phone) => {
      // Supprimer tous les caractères non numériques
      const numbers = phone.replace(/\D/g, '');
      // Ajouter le préfixe +225 si nécessaire
      return numbers.startsWith('225') ? `+${numbers}` : `+225${numbers}`;
    };

    // Vérifier tous les champs requis
    if (!formData?.email || !formData?.firstName || !formData?.lastName || !formData?.phone) {
      return NextResponse.json(
        { error: "Informations personnelles incomplètes" },
        { status: 400 }
      );
    }

    let userId;
    if (user) {
      userId = user.id;
    } else {
      // Vérifier et formater le numéro de téléphone
      const formattedPhone = formatPhoneNumber(formData.phone);
     
      // Créer un utilisateur guest avec l'email fourni
      const guestUser = await pool.query(`
        INSERT INTO users (
          username,
          first_name,
          last_name,
          email,
          phone_number,
          location,
          address,
          role,
          password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        `${formData.firstName} ${formData.lastName}`,
        formData.firstName,
        formData.lastName,
        formData.email,  // Utilisation directe de l'email du formulaire
        formattedPhone, // Utiliser le numéro formaté
        `${formData.commune}, ${formData.quartier}`,
        formData.addressDetails,
        'guest',
        'NO_PASSWORD'
      ]);
      
      userId = guestUser.rows[0].id;
     
    }

    // Créer la commande
    const orderResult = await pool.query(`
      INSERT INTO orders (user_id, total, status) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `, [userId, total, 'pending']);

    const orderId = orderResult.rows[0].id;

    // Insérer les détails de la commande
    for (const item of cartItems) {
      await pool.query(
        'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      userId,
      message: "Commande créée avec succès"
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Vérifier le token d'authentification
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est admin
    const decoded = await verifyAuth(token);
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Commande non trouvée' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' }, 
      { status: 500 }
    );
  }
}
