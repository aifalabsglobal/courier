import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { name, code, address, city, state, country, warehouseType, isActive } = body;

        const warehouse = await db.warehouse.update({
            where: { id },
            data: { name, code, address, city, state, country, warehouseType, isActive }
        });
        return NextResponse.json(warehouse);
    } catch (error) {
        console.error("[WAREHOUSE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.warehouse.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[WAREHOUSE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
