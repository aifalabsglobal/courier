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
            registration,
            make,
            model,
            type, // receiving type name/string
            status,
            capacityWeight,
            capacityVolume,
            fitnessExpiry,
            insuranceExpiry,
            vehicleTypeId // Optional direct update if frontend sends it
        } = body;

        // Resolve vehicleType if provided as string name (similar to POST)
        let finalVehicleTypeId = vehicleTypeId;

        if (!vehicleTypeId && type) {
            // Try to find the type by name
            let vehicleType = await db.vehicleType.findFirst({
                where: { name: type }
            });

            if (!vehicleType) {
                // Create new vehicle type
                vehicleType = await db.vehicleType.create({
                    data: {
                        name: type,
                        code: type.toUpperCase().replace(/\s+/g, '_'),
                        description: "Auto-generated"
                    }
                });
            }
            finalVehicleTypeId = vehicleType?.id;
        }

        // Prepare update data, excluding undefined fields
        const updateData: Record<string, unknown> = {
            registration,
            make,
            model,
            isActive: status === "Active",
            fitnessExpiry: fitnessExpiry ? new Date(fitnessExpiry) : undefined,
            insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
        };

        if (finalVehicleTypeId) {
            updateData.vehicleTypeId = finalVehicleTypeId;
        }

        const vehicle = await db.vehicle.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("[VEHICLE_PATCH]", error);
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
        const vehicle = await db.vehicle.delete({
            where: { id }
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("[VEHICLE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
