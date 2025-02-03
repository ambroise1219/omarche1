import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../../../lib/auth';  

export async function GET(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = await verifyAuth(token);
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: decoded.userId,
        role: decoded.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
