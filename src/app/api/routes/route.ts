import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const routes = await db.route.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(routes);
    } catch (error) {
        console.error("[ROUTES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { origin, destination, distance, normalHours, isActive } = body;

        if (!origin || !destination) {
            return new NextResponse("Origin and destination are required", { status: 400 });
        }

        const route = await db.route.create({
            data: {
                origin,
                destination,
                distance: distance ? parseFloat(distance) : null,
                normalHours: normalHours ? parseFloat(normalHours) : null,
                isActive: isActive ?? true
            }
        });

        return NextResponse.json(route);
    } catch (error) {
        console.error("[ROUTES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
