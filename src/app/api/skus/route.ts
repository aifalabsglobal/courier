import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const skus = await db.sKU.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(skus);
    } catch (error) {
        console.error("[SKUS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { code, name, description, category, weight, volume, hsnCode, isActive } = body;

        if (!code || !name) return new NextResponse("Code and name required", { status: 400 });

        const sku = await db.sKU.create({
            data: {
                code, name, description, category,
                weight: weight ? parseFloat(weight) : 0,
                volume: volume ? parseFloat(volume) : 0,
                hsnCode, isActive: isActive ?? true
            }
        });
        return NextResponse.json(sku);
    } catch (error) {
        console.error("[SKUS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
