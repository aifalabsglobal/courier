import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const entries = await db.fuelEntry.findMany({ orderBy: { date: 'desc' } });
        return NextResponse.json(entries);
    } catch (error) {
        console.error("[FUEL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { vehicleId, driverId, date, odometer, quantity, unitPrice, totalCost, fuelType, location, receiptNo, notes } = body;

        if (!vehicleId) return new NextResponse("Vehicle required", { status: 400 });

        const entry = await db.fuelEntry.create({
            data: {
                vehicleId, driverId,
                date: date ? new Date(date) : new Date(),
                odometer: odometer ? parseFloat(odometer) : null,
                quantity: quantity ? parseFloat(quantity) : 0,
                unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
                totalCost: totalCost ? parseFloat(totalCost) : 0,
                fuelType, location, receiptNo, notes
            }
        });
        return NextResponse.json(entry);
    } catch (error) {
        console.error("[FUEL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
