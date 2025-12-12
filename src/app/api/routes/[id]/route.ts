import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { origin, destination, distance, normalHours, isActive } = body;

        const route = await db.route.update({
            where: { id },
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
        console.error("[ROUTE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        await db.route.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[ROUTE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
