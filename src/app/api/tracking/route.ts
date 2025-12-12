import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const events = await db.trackingEvent.findMany({
            include: { order: true, trip: true },
            orderBy: { timestamp: 'desc' }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("[TRACKING_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { orderId, tripId, eventType, location, description, latitude, longitude } = body;

        if (!eventType) return new NextResponse("Event type required", { status: 400 });

        const event = await db.trackingEvent.create({
            data: {
                orderId: orderId || null,
                tripId: tripId || null,
                eventType, location, description,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null
            },
            include: { order: true, trip: true }
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error("[TRACKING_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
