import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const order = await db.order.findUnique({
            where: { id },
            include: { customer: true, items: true }
        });

        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

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
            status, priority,
            shipperName, shipperAddress, shipperCity, shipperState, shipperCountry, shipperPhone,
            consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeCountry, consigneePhone,
            pickupDate, deliveryDate, totalWeight, totalVolume, packageCount, description
        } = body;

        const order = await db.order.update({
            where: { id },
            data: {
                status, priority,
                shipperName, shipperAddress, shipperCity, shipperState, shipperCountry, shipperPhone,
                consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeCountry, consigneePhone,
                pickupDate: pickupDate ? new Date(pickupDate) : undefined,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
                totalWeight: totalWeight ? parseFloat(totalWeight) : undefined,
                totalVolume: totalVolume ? parseFloat(totalVolume) : undefined,
                packageCount: packageCount ? parseInt(packageCount) : undefined,
                description
            },
            include: { customer: true }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDER_PUT]", error);
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

        await db.order.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[ORDER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
