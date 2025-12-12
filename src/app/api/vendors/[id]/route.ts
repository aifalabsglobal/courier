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
            email,
            phone,
            address,
            city,
            state,
            country,
            taxId,
            status
        } = body;

        const vendor = await db.vendor.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
                city,
                state,
                country,
                taxId,
                isActive: status === "Active"
            }
        });

        return NextResponse.json(vendor);
    } catch (error) {
        console.error("[VENDOR_PATCH]", error);
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
        const vendor = await db.vendor.delete({
            where: { id }
        });

        return NextResponse.json(vendor);
    } catch (error) {
        console.error("[VENDOR_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

