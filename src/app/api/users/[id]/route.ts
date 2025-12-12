import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { name, phone, department, roleId, branchId, isActive } = body;

        const user = await db.companyUser.update({
            where: { id },
            data: { name, phone, department, roleId, branchId, isActive },
            include: { role: true, branch: true }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.companyUser.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
