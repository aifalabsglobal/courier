import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderNo = searchParams.get("orderNo");

        if (!orderNo) {
            return new NextResponse("Order number required", { status: 400 });
        }

        // Find the order
        const order = await db.order.findFirst({
            where: { orderNo: { equals: orderNo, mode: 'insensitive' } },
            include: { customer: true }
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Get tracking events for this order
        const events = await db.trackingEvent.findMany({
            where: { orderId: order.id },
            orderBy: { timestamp: 'desc' }
        });

        // Get associated trip
        const trip = await db.trip.findFirst({
            where: { id: { in: events.map(e => e.tripId).filter(Boolean) as string[] } },
            include: { vehicle: true, driver: true }
        });

        return NextResponse.json({
            orderNo: order.orderNo,
            status: order.status,
            origin: `${order.shipperCity}, ${order.shipperState}`,
            destination: `${order.consigneeCity}, ${order.consigneeState}`,
            weight: `${order.totalWeight || 0} kg`,
            packages: order.packageCount || 0,
            description: order.description,
            customer: order.customer?.name,
            priority: order.priority,
            vehicle: trip?.vehicle?.registration,
            driver: trip?.driver?.name,
            events: events.map(e => ({
                id: e.id,
                status: e.eventType.toLowerCase(),
                location: e.location || 'Unknown',
                timestamp: e.timestamp.toISOString(),
                description: e.description || e.eventType
            }))
        });
    } catch (error) {
        console.error("[TRACK_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
