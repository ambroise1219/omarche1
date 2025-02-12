import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { verifyAuth } from '../../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    // Utiliser params.id de manière asynchrone
    const orderId = await Promise.resolve(params.id);
    
    // Récupérer la commande avec les détails des produits et les informations utilisateur en une seule requête
    const orderQuery = await pool.query(`
      SELECT 
        o.*,
        u.username, 
        u.email,
        u.first_name,
        u.last_name,
        u.phone_number,
        json_agg(
          json_build_object(
            'product_id', od.product_id,
            'quantity', od.quantity,
            'price', od.price,
            'product', (
              SELECT json_build_object(
                'name', p.name,
                'description', p.description,
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
      LEFT JOIN order_details od ON o.id = od.order_id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
      GROUP BY o.id, u.id
    `, [orderId]);

    if (orderQuery.rows.length === 0) {
      return NextResponse.json(
        { error: 'Commande non trouvée' }, 
        { status: 404 }
      );
    }

    const orderData = orderQuery.rows[0];

    // Structurer la réponse
    const response = {
      ...orderData,
      user: {
        username: orderData.username,
        email: orderData.email,
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        phone_number: orderData.phone_number
      }
    };

    // Supprimer les champs redondants
    delete response.username;
    delete response.email;
    delete response.first_name;
    delete response.last_name;
    delete response.phone_number;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    

    // Récupérer le bon cookie
    const token = request.cookies.get('authToken')?.value;
     

    if (!token) {
      console.log('❌ Pas de token trouvé');
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
     
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

 
    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('❌ Erreur mise à jour commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Vérifier la session active
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    const { id } = params;

    // Vérifier si l'utilisateur est autorisé à supprimer la commande
    const orderCheck = await pool.query(
      'SELECT user_id FROM orders WHERE id = $1',
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    if (orderCheck.rows[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await pool.query('DELETE FROM order_details WHERE order_id = $1', [id]);
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    
    return NextResponse.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la commande' }, { status: 500 });
  }
}
