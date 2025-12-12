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
        const search = searchParams.get('search');
        const all = searchParams.get('all'); // For dropdowns - return all without pagination

        // For dropdown selects, return all customers (limited fields)
        if (all === 'true') {
            const cacheKey = 'customers:all';
            const cached = apiCache.get<unknown[]>(cacheKey);
            if (cached) {
                return NextResponse.json(cached, { headers: getCacheHeaders(120) });
            }

            const customers = await db.customer.findMany({
                where: { isActive: true },
                select: { id: true, name: true, code: true },
                orderBy: { name: 'asc' },
            });
            apiCache.set(cacheKey, customers, 120);
            return NextResponse.json(customers, { headers: getCacheHeaders(120) });
        }

        // Build cache key
        const cacheKey = `customers:${pagination.page}:${pagination.limit}:${search || ''}`;

        // Check cache first
        const cached = apiCache.get<{ data: unknown[]; total: number }>(cacheKey);
        if (cached) {
            return NextResponse.json(
                createPaginatedResponse(cached.data, cached.total, pagination),
                { headers: getCacheHeaders(60) }
            );
        }

        // Build where clause
        const where: Record<string, unknown> = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count and data in parallel
        const [total, customers] = await Promise.all([
            db.customer.count({ where }),
            db.customer.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: pagination.skip,
                take: pagination.limit,
            }),
        ]);

        // Cache the result
        apiCache.set(cacheKey, { data: customers, total }, 60);

        return NextResponse.json(
            createPaginatedResponse(customers, total, pagination),
            { headers: getCacheHeaders(60) }
        );
    } catch (error) {
        console.error("[CUSTOMERS_GET]", error);
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
        const { name, email, phone, address, city, state, country, status } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Ensure company exists
        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({
                data: { name: "Default Company", email: "admin@example.com" }
            });
        }

        const code = name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000).toString();

        const customer = await db.customer.create({
            data: {
                name, email, phone, address, city, state, country, code,
                isActive: status === "Active",
                companyId: company.id
            }
        });

        // Invalidate cache
        apiCache.invalidate('customers');

        return NextResponse.json(customer);
    } catch (error) {
        console.error("[CUSTOMERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
