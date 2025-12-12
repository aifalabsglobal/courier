import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { name, description, type, validFrom, validTo, isActive } = body;

        const tariff = await db.tariff.update({
            where: { id },
            data: {
                name, description, type,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validTo: validTo ? new Date(validTo) : undefined,
                isActive
            }
        });
        return NextResponse.json(tariff);
    } catch (error) {
        console.error("[TARIFF_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.tariff.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[TARIFF_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
