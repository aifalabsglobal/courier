import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const invoices = await db.invoice.findMany({
            include: { customer: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(invoices);
    } catch (error) {
        console.error("[INVOICES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { customerId, subtotal, taxAmount, totalAmount, dueDate, status } = body;

        if (!customerId) return new NextResponse("Customer required", { status: 400 });

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({ data: { name: "Default Company", email: "admin@example.com" } });
        }

        const count = await db.invoice.count();
        const invoiceNo = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const invoice = await db.invoice.create({
            data: {
                companyId: company.id,
                customerId, invoiceNo,
                invoiceDate: new Date(),
                dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                subtotal: parseFloat(subtotal) || 0,
                taxAmount: parseFloat(taxAmount) || 0,
                totalAmount: parseFloat(totalAmount) || 0,
                paidAmount: 0,
                status: status || "DRAFT"
            },
            include: { customer: true }
        });
        return NextResponse.json(invoice);
    } catch (error) {
        console.error("[INVOICES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
