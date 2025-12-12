import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const locations = await db.location.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error("[LOCATIONS_GET]", error);
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
        const {
            name,
            address,
            city,
            state,
            country,
            type, // 'Warehouse', 'Port', etc.
            status
        } = body;

        if (!name || !type) {
            return new NextResponse("Name and Type are required", { status: 400 });
        }

        // Generate simple code
        const code = "LOC" + Math.floor(Math.random() * 10000).toString();

        const location = await db.location.create({
            data: {
                name,
                code,
                address,
                city,
                state,
                country,
                type,
                isActive: status === "Active"
            }
        });

        return NextResponse.json(location);
    } catch (error) {
        console.error("[LOCATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
