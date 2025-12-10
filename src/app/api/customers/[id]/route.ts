import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            status
        } = body;

        const customer = await db.customer.update({
            where: { id: params.id },
            data: {
                name,
                email,
                phone,
                address,
                city,
                state,
                country,
                isActive: status === "Active"
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("[CUSTOMER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const customer = await db.customer.delete({
            where: { id: params.id }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("[CUSTOMER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
