import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";
import { apiCache, getCacheHeaders } from "@/lib/cache";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const pagination = getPaginationParams(req);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Build cache key
        const cacheKey = `orders:${pagination.page}:${pagination.limit}:${status || 'all'}:${search || ''}`;

        // Check cache first
        const cached = apiCache.get<{ data: unknown[]; total: number }>(cacheKey);
        if (cached) {
            return NextResponse.json(
                createPaginatedResponse(cached.data, cached.total, pagination),
                { headers: getCacheHeaders(30) }
            );
        }

        // Build where clause
        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { orderNo: { contains: search, mode: 'insensitive' } },
                { shipperName: { contains: search, mode: 'insensitive' } },
                { consigneeName: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count and data in parallel
        const [total, orders] = await Promise.all([
            db.order.count({ where }),
            db.order.findMany({
                where,
                include: { customer: { select: { id: true, name: true, code: true } } },
                orderBy: { createdAt: 'desc' },
                skip: pagination.skip,
                take: pagination.limit,
            }),
        ]);

        // Cache the result
        apiCache.set(cacheKey, { data: orders, total }, 60);

        return NextResponse.json(
            createPaginatedResponse(orders, total, pagination),
            { headers: getCacheHeaders(30) }
        );
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

        // Invalidate orders cache
        apiCache.invalidate('orders');

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
