import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const tariffs = await db.tariff.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(tariffs);
    } catch (error) {
        console.error("[TARIFFS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, description, type, validFrom, validTo, isActive } = body;

        if (!name || !type || !validFrom) return new NextResponse("Name, type and valid from required", { status: 400 });

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({ data: { name: "Default Company", email: "admin@example.com" } });
        }

        const tariff = await db.tariff.create({
            data: {
                companyId: company.id,
                name, description, type,
                validFrom: new Date(validFrom),
                validTo: validTo ? new Date(validTo) : null,
                isActive: isActive ?? true
            }
        });
        return NextResponse.json(tariff);
    } catch (error) {
        console.error("[TARIFFS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
