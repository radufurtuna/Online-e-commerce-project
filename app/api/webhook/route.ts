import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.log(`Webhook signature verification failed: ${error.message}`);
        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
    }

    console.log(`Received webhook event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata?.orderId) {
            console.log('No orderId found in session metadata');
            return new NextResponse('Order ID not found', { status: 400 });
        }

        const address = session?.customer_details?.address;

        const addressComponents = [
            address?.line1,
            address?.line2,
            address?.city,
            address?.state,
            address?.postal_code,
            address?.country
        ];

        const addressString = addressComponents.filter((c) => c !== null).join(', ');

        try {
            const order = await prismadb.order.update({
                where: {
                    id: session.metadata.orderId,
                },
                data: {
                    isPaid: true,
                    address: addressString,
                    phone: session?.customer_details?.phone || ''
                },
                include: {
                    orderItems: true
                }
            });

            const productIds = order.orderItems.map((orderItem) => orderItem.productId);
            
            await prismadb.product.updateMany({
                where: {
                    id: {
                        in: productIds
                    }
                },
                data: {
                    isArchived: true
                }
            });
/**/ 
            console.log(`Order ${order.id} updated successfully`);
            return new NextResponse(null, { status: 200 });
        } catch (error: any) {
            console.log(`Error updating order: ${error.message}`);
            return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }
    }

    // Return 200 for all other event types
    console.log(`Unhandled event type: ${event.type}`);
    return new NextResponse(null, { status: 200 });
}