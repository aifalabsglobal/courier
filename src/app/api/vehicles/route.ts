import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vehicles = await db.vehicle.findMany({
            include: {
                vehicleType: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("[VEHICLES_GET]", error);
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
            registration,
            make,
            model,
            type,
            status,
            capacityWeight,
            capacityVolume,
            fuelType,
            fitnessExpiry,
            insuranceExpiry
        } = body;

        if (!registration) {
            return new NextResponse("Registration number is required", { status: 400 });
        }

        // Ensure a company exists
        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({
                data: {
                    name: "Default Company",
                    email: "admin@default.com",
                    isActive: true
                }
            });
        }

        // Handle Vehicle Type - find or create one
        let vehicleTypeId: string;
        if (type) {
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
            vehicleTypeId = vehicleType.id;
        } else {
            // Fallback if no type provided, try to find ANY type or create a default
            let defaultType = await db.vehicleType.findFirst({ where: { name: "General" } });
            if (!defaultType) {
                defaultType = await db.vehicleType.create({
                    data: {
                        name: "General",
                        code: "GENERAL"
                    }
                });
            }
            vehicleTypeId = defaultType.id;
        }

        const vehicle = await db.vehicle.create({
            data: {
                registration,
                make,
                model,
                isActive: status === "Active",
                companyId: company.id,
                vehicleTypeId,
                capacityWeight: capacityWeight ? parseFloat(capacityWeight) : undefined,
                capacityVolume: capacityVolume ? parseFloat(capacityVolume) : undefined,
                fuelType: fuelType,
                fitnessExpiry: fitnessExpiry ? new Date(fitnessExpiry) : undefined,
                insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
            }
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("[VEHICLES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
