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
        const {
            name,
            address,
            city,
            state,
            country,
            type,
            status
        } = body;

        const location = await db.location.update({
            where: { id },
            data: {
                name,
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
        console.error("[LOCATION_PATCH]", error);
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
        const location = await db.location.delete({
            where: { id }
        });

        return NextResponse.json(location);
    } catch (error) {
        console.error("[LOCATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

