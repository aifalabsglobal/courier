import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const drivers = await db.driver.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(drivers);
    } catch (error) {
        console.error("[DRIVERS_GET]", error);
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
            name,
            email,
            phone,
            licenseNo,
            licenseExpiry,
            status // frontend sends 'Active'/'Inactive', schema has Boolean isActive
        } = body;

        if (!name || !licenseNo) {
            return new NextResponse("Name and License Number are required", { status: 400 });
        }

        // Ensure company exists
        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({
                data: {
                    name: "Default Company",
                    email: "admin@example.com"
                }
            });
        }

        const driver = await db.driver.create({
            data: {
                name,
                email,
                phone,
                licenseNo,
                licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
                isActive: status === "Active",
                companyId: company.id
            }
        });

        return NextResponse.json(driver);
    } catch (error) {
        console.error("[DRIVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
