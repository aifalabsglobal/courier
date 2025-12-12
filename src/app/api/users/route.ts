import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const users = await db.companyUser.findMany({
            include: { role: true, branch: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("[USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { email, name, phone, department, roleId, branchId, isActive } = body;

        if (!email) return new NextResponse("Email required", { status: 400 });

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({ data: { name: "Default Company", email: "admin@example.com" } });
        }

        // Get or create a default role
        let role = await db.role.findFirst({ where: { id: roleId } });
        if (!role) {
            role = await db.role.findFirst({ where: { name: "User" } });
            if (!role) {
                role = await db.role.create({
                    data: { name: "User", displayName: "User", permissions: "[]" }
                });
            }
        }

        const user = await db.companyUser.create({
            data: {
                companyId: company.id,
                branchId: branchId || null,
                userId: `user_${Date.now()}`, // Placeholder until Clerk ID
                roleId: role.id,
                email, name, phone, department,
                isActive: isActive ?? true
            },
            include: { role: true, branch: true }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error("[USERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
