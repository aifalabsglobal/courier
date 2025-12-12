import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { subtotal, taxAmount, totalAmount, paidAmount, dueDate, status } = body;

        const invoice = await db.invoice.update({
            where: { id },
            data: {
                subtotal: subtotal ? parseFloat(subtotal) : undefined,
                taxAmount: taxAmount ? parseFloat(taxAmount) : undefined,
                totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
                paidAmount: paidAmount ? parseFloat(paidAmount) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status
            },
            include: { customer: true }
        });
        return NextResponse.json(invoice);
    } catch (error) {
        console.error("[INVOICE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.invoice.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[INVOICE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
