import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Debes iniciar sesión para comprar' }, { status: 401 });
    }

    const { 
      items, 
      total, 
      address, 
      recipientName, 
      phone, 
      city, 
      zipCode, 
      additionalInfo 
    } = await req.json();

    // Buscar al usuario en la DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Generar Order Number único
    const orderNumber = `LUM-${Math.random().toString(36).substring(2, 7).toUpperCase()}-AR`;
    
    // Calcular fechas
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); 

    const warrantyUntil = new Date();
    warrantyUntil.setFullYear(warrantyUntil.getFullYear() + 2); 

    // Crear el pedido con todos los campos nuevos
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        items,
        total: parseFloat(total),
        status: 'PROCESANDO',
        address,
        recipientName,
        phone,
        city,
        zipCode,
        additionalInfo,
        deliveryDate,
        warrantyUntil,
      },
    });

    return NextResponse.json({ 
      success: true, 
      trackingId: order.orderNumber,
      message: 'Pedido creado exitosamente' 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error al procesar el pedido' }, { status: 500 });
  }
}
