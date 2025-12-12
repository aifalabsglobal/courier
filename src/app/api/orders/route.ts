import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get all orders without company filter for now
        const orders = await db.order.findMany({
            include: { customer: true },
            orderBy: { createdAt: 'desc' }
        });

        console.log("[ORDERS_GET] Found orders:", orders.length);
        return NextResponse.json(orders);
    } catch (error) {
        console.error("[ORDERS_GET]", error);
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
            customerId, orderType, priority, status,
            shipperName, shipperAddress, shipperCity, shipperState, shipperCountry, shipperPhone,
            consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeCountry, consigneePhone,
            pickupDate, deliveryDate, totalWeight, totalVolume, packageCount, description
        } = body;

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({
                data: { name: "Default Company", email: "admin@example.com" }
            });
        }

        // Generate order number
        const count = await db.order.count();
        const orderNo = `ORD-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const order = await db.order.create({
            data: {
                companyId: company.id,
                customerId,
                orderNo,
                orderType: orderType || "FTL",
                status: status || "DRAFT",
                priority: priority || "NORMAL",
                shipperName, shipperAddress, shipperCity, shipperState, shipperCountry, shipperPhone,
                consigneeName, consigneeAddress, consigneeCity, consigneeState, consigneeCountry, consigneePhone,
                pickupDate: pickupDate ? new Date(pickupDate) : null,
                deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
                totalWeight: totalWeight ? parseFloat(totalWeight) : 0,
                totalVolume: totalVolume ? parseFloat(totalVolume) : 0,
                packageCount: packageCount ? parseInt(packageCount) : 0,
                description,
                specialHandling: "[]"
            },
            include: { customer: true }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
