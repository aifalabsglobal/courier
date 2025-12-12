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
            licenseNo,
            licenseExpiry,
            status
        } = body;

        const driver = await db.driver.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                licenseNo,
                licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
                isActive: status === "Active"
            }
        });

        return NextResponse.json(driver);
    } catch (error) {
        console.error("[DRIVER_PATCH]", error);
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
        const driver = await db.driver.delete({
            where: { id }
        });

        return NextResponse.json(driver);
    } catch (error) {
        console.error("[DRIVER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

