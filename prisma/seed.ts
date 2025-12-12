import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');
    console.log('🗑️ Cleaning existing data...');

    // Clean up existing data (order matters due to foreign keys)
    await prisma.trackingEvent.deleteMany({});
    await prisma.inventoryTransaction.deleteMany({});
    await prisma.inventory.deleteMany({});
    await prisma.fuelEntry.deleteMany({});
    await prisma.vehicleMaintenance.deleteMany({});
    await prisma.invoiceLine.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.tariff.deleteMany({});
    await prisma.trip.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.warehouseLocation.deleteMany({});
    await prisma.warehouse.deleteMany({});
    await prisma.companyUser.deleteMany({});
    await prisma.driver.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.vehicleType.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.vendor.deleteMany({});
    await prisma.location.deleteMany({});
    await prisma.sKU.deleteMany({});
    await prisma.role.deleteMany({});
    console.log('✓ Cleaned existing data');

    // Create Company
    const company = await prisma.company.upsert({
        where: { id: 'company-1' },
        update: {},
        create: {
            id: 'company-1',
            name: 'Swift Logistics',
            displayName: 'Swift Logistics Inc.',
            email: 'info@swiftlogistics.com',
            phone: '+1-555-0100',
            address: '123 Logistics Way',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001'
        }
    });
    console.log('✓ Company created');

    // Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin', displayName: 'Administrator', permissions: '["all"]' }
    });
    const userRole = await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: { name: 'User', displayName: 'Standard User', permissions: '["read", "write"]' }
    });
    const driverRole = await prisma.role.upsert({
        where: { name: 'Driver' },
        update: {},
        create: { name: 'Driver', displayName: 'Driver', permissions: '["read"]' }
    });
    console.log('✓ Roles created');

    // Create Customers
    const customers = await Promise.all([
        prisma.customer.upsert({ where: { code: 'CUST-001' }, update: {}, create: { companyId: company.id, code: 'CUST-001', name: 'Acme Corporation', displayName: 'Acme Corp', email: 'orders@acme.com', phone: '+1-555-0101', city: 'Los Angeles', state: 'CA', country: 'USA', creditLimit: 50000, paymentTerms: 'NET30' } }),
        prisma.customer.upsert({ where: { code: 'CUST-002' }, update: {}, create: { companyId: company.id, code: 'CUST-002', name: 'Global Trade Inc', displayName: 'Global Trade', email: 'logistics@globaltrade.com', phone: '+1-555-0102', city: 'Chicago', state: 'IL', country: 'USA', creditLimit: 100000, paymentTerms: 'NET15' } }),
        prisma.customer.upsert({ where: { code: 'CUST-003' }, update: {}, create: { companyId: company.id, code: 'CUST-003', name: 'Metro Retail Group', displayName: 'Metro Retail', email: 'supply@metroretail.com', phone: '+1-555-0103', city: 'Houston', state: 'TX', country: 'USA', creditLimit: 75000, paymentTerms: 'NET30' } }),
        prisma.customer.upsert({ where: { code: 'CUST-004' }, update: {}, create: { companyId: company.id, code: 'CUST-004', name: 'Pacific Imports', displayName: 'Pacific Imports', email: 'shipping@pacificimports.com', phone: '+1-555-0104', city: 'Seattle', state: 'WA', country: 'USA', creditLimit: 150000, paymentTerms: 'NET45' } }),
        prisma.customer.upsert({ where: { code: 'CUST-005' }, update: {}, create: { companyId: company.id, code: 'CUST-005', name: 'East Coast Distributors', displayName: 'ECD', email: 'orders@eastcoastdist.com', phone: '+1-555-0105', city: 'Miami', state: 'FL', country: 'USA', creditLimit: 80000, paymentTerms: 'NET30' } }),
    ]);
    console.log('✓ 5 Customers created');

    // Create Vendors
    const vendors = await Promise.all([
        prisma.vendor.upsert({ where: { code: 'VND-001' }, update: {}, create: { companyId: company.id, code: 'VND-001', name: 'TransPro Carriers', email: 'dispatch@transpro.com', phone: '+1-555-0201', city: 'Dallas', state: 'TX', country: 'USA', serviceTypes: '["FTL", "LTL"]' } }),
        prisma.vendor.upsert({ where: { code: 'VND-002' }, update: {}, create: { companyId: company.id, code: 'VND-002', name: 'Express Fleet Services', email: 'ops@expressfleet.com', phone: '+1-555-0202', city: 'Phoenix', state: 'AZ', country: 'USA', serviceTypes: '["FTL", "DEDICATED"]' } }),
        prisma.vendor.upsert({ where: { code: 'VND-003' }, update: {}, create: { companyId: company.id, code: 'VND-003', name: 'Regional Haulers LLC', email: 'service@regionalhaulers.com', phone: '+1-555-0203', city: 'Denver', state: 'CO', country: 'USA', serviceTypes: '["LTL", "PARCEL"]' } }),
    ]);
    console.log('✓ 3 Vendors created');

    // Create Locations
    await Promise.all([
        prisma.location.upsert({ where: { code: 'LOC-NYC' }, update: {}, create: { code: 'LOC-NYC', name: 'New York Hub', address: '500 Distribution Ave', city: 'New York', state: 'NY', country: 'USA', postalCode: '10001', type: 'warehouse', latitude: 40.7128, longitude: -74.0060 } }),
        prisma.location.upsert({ where: { code: 'LOC-LAX' }, update: {}, create: { code: 'LOC-LAX', name: 'Los Angeles Terminal', address: '2000 Freight Blvd', city: 'Los Angeles', state: 'CA', country: 'USA', postalCode: '90001', type: 'warehouse', latitude: 34.0522, longitude: -118.2437 } }),
        prisma.location.upsert({ where: { code: 'LOC-CHI' }, update: {}, create: { code: 'LOC-CHI', name: 'Chicago Distribution Center', address: '1500 Logistics Park', city: 'Chicago', state: 'IL', country: 'USA', postalCode: '60601', type: 'warehouse', latitude: 41.8781, longitude: -87.6298 } }),
        prisma.location.upsert({ where: { code: 'LOC-HOU' }, update: {}, create: { code: 'LOC-HOU', name: 'Houston Depot', address: '800 Shipping Lane', city: 'Houston', state: 'TX', country: 'USA', postalCode: '77001', type: 'warehouse', latitude: 29.7604, longitude: -95.3698 } }),
        prisma.location.upsert({ where: { code: 'LOC-MIA' }, update: {}, create: { code: 'LOC-MIA', name: 'Miami Gateway', address: '300 Port Access Rd', city: 'Miami', state: 'FL', country: 'USA', postalCode: '33101', type: 'port', latitude: 25.7617, longitude: -80.1918 } }),
    ]);
    console.log('✓ 5 Locations created');

    // Create Vehicle Types
    const vehicleTypes = await Promise.all([
        prisma.vehicleType.upsert({ where: { code: 'HEAVY_TRUCK' }, update: {}, create: { code: 'HEAVY_TRUCK', name: 'Heavy Truck', description: '18-wheeler', capacityWeight: 25000, capacityPallets: 26 } }),
        prisma.vehicleType.upsert({ where: { code: 'MEDIUM_TRUCK' }, update: {}, create: { code: 'MEDIUM_TRUCK', name: 'Medium Truck', description: 'Box truck', capacityWeight: 10000, capacityPallets: 12 } }),
        prisma.vehicleType.upsert({ where: { code: 'VAN' }, update: {}, create: { code: 'VAN', name: 'Van', description: 'Cargo van', capacityWeight: 2000, capacityPallets: 4 } }),
        prisma.vehicleType.upsert({ where: { code: 'REFRIGERATED' }, update: {}, create: { code: 'REFRIGERATED', name: 'Refrigerated Truck', description: 'Temperature controlled', capacityWeight: 20000, capacityPallets: 20 } }),
    ]);
    console.log('✓ 4 Vehicle Types created');

    // Create Vehicles
    const vehicles = await Promise.all([
        prisma.vehicle.upsert({ where: { registration: 'TX-1234-AB' }, update: {}, create: { companyId: company.id, vehicleTypeId: vehicleTypes[0].id, registration: 'TX-1234-AB', make: 'Volvo', model: 'FH16', year: 2022, capacityWeight: 25000, fuelType: 'Diesel', fitnessExpiry: new Date('2025-06-30'), insuranceExpiry: new Date('2025-03-31') } }),
        prisma.vehicle.upsert({ where: { registration: 'TX-5678-CD' }, update: {}, create: { companyId: company.id, vehicleTypeId: vehicleTypes[0].id, registration: 'TX-5678-CD', make: 'Mercedes', model: 'Actros', year: 2023, capacityWeight: 24000, fuelType: 'Diesel', fitnessExpiry: new Date('2025-08-15'), insuranceExpiry: new Date('2025-05-20') } }),
        prisma.vehicle.upsert({ where: { registration: 'CA-9012-EF' }, update: {}, create: { companyId: company.id, vehicleTypeId: vehicleTypes[1].id, registration: 'CA-9012-EF', make: 'Isuzu', model: 'NPR', year: 2021, capacityWeight: 8000, fuelType: 'Diesel', fitnessExpiry: new Date('2025-04-30'), insuranceExpiry: new Date('2025-02-28') } }),
        prisma.vehicle.upsert({ where: { registration: 'NY-3456-GH' }, update: {}, create: { companyId: company.id, vehicleTypeId: vehicleTypes[2].id, registration: 'NY-3456-GH', make: 'Ford', model: 'Transit', year: 2022, capacityWeight: 2000, fuelType: 'Gasoline', fitnessExpiry: new Date('2025-09-30'), insuranceExpiry: new Date('2025-06-15') } }),
        prisma.vehicle.upsert({ where: { registration: 'FL-7890-IJ' }, update: {}, create: { companyId: company.id, vehicleTypeId: vehicleTypes[3].id, registration: 'FL-7890-IJ', make: 'Kenworth', model: 'T680', year: 2023, capacityWeight: 20000, fuelType: 'Diesel', fitnessExpiry: new Date('2025-12-31'), insuranceExpiry: new Date('2025-10-31') } }),
    ]);
    console.log('✓ 5 Vehicles created');

    // Create Drivers
    const drivers = await Promise.all([
        prisma.driver.upsert({ where: { licenseNo: 'DL-TX-12345' }, update: {}, create: { companyId: company.id, code: 'DRV-001', name: 'John Smith', email: 'john.smith@swiftlogistics.com', phone: '+1-555-0301', licenseNo: 'DL-TX-12345', licenseExpiry: new Date('2026-05-15'), rating: 4.8 } }),
        prisma.driver.upsert({ where: { licenseNo: 'DL-CA-67890' }, update: {}, create: { companyId: company.id, code: 'DRV-002', name: 'Maria Garcia', email: 'maria.garcia@swiftlogistics.com', phone: '+1-555-0302', licenseNo: 'DL-CA-67890', licenseExpiry: new Date('2025-11-20'), rating: 4.9 } }),
        prisma.driver.upsert({ where: { licenseNo: 'DL-IL-11111' }, update: {}, create: { companyId: company.id, code: 'DRV-003', name: 'Robert Johnson', email: 'robert.johnson@swiftlogistics.com', phone: '+1-555-0303', licenseNo: 'DL-IL-11111', licenseExpiry: new Date('2026-02-28'), rating: 4.5 } }),
        prisma.driver.upsert({ where: { licenseNo: 'DL-NY-22222' }, update: {}, create: { companyId: company.id, code: 'DRV-004', name: 'Sarah Williams', email: 'sarah.williams@swiftlogistics.com', phone: '+1-555-0304', licenseNo: 'DL-NY-22222', licenseExpiry: new Date('2025-08-10'), rating: 4.7 } }),
        prisma.driver.upsert({ where: { licenseNo: 'DL-FL-33333' }, update: {}, create: { companyId: company.id, code: 'DRV-005', name: 'Michael Brown', email: 'michael.brown@swiftlogistics.com', phone: '+1-555-0305', licenseNo: 'DL-FL-33333', licenseExpiry: new Date('2026-07-01'), rating: 4.6 } }),
    ]);
    console.log('✓ 5 Drivers created');

    // Create Routes
    await Promise.all([
        prisma.route.upsert({ where: { origin_destination: { origin: 'New York, NY', destination: 'Los Angeles, CA' } }, update: {}, create: { origin: 'New York, NY', destination: 'Los Angeles, CA', distance: 4500, normalHours: 42 } }),
        prisma.route.upsert({ where: { origin_destination: { origin: 'Chicago, IL', destination: 'Houston, TX' } }, update: {}, create: { origin: 'Chicago, IL', destination: 'Houston, TX', distance: 1745, normalHours: 16 } }),
        prisma.route.upsert({ where: { origin_destination: { origin: 'Miami, FL', destination: 'New York, NY' } }, update: {}, create: { origin: 'Miami, FL', destination: 'New York, NY', distance: 2150, normalHours: 20 } }),
        prisma.route.upsert({ where: { origin_destination: { origin: 'Seattle, WA', destination: 'Los Angeles, CA' } }, update: {}, create: { origin: 'Seattle, WA', destination: 'Los Angeles, CA', distance: 1850, normalHours: 18 } }),
        prisma.route.upsert({ where: { origin_destination: { origin: 'Dallas, TX', destination: 'Chicago, IL' } }, update: {}, create: { origin: 'Dallas, TX', destination: 'Chicago, IL', distance: 1450, normalHours: 14 } }),
    ]);
    console.log('✓ 5 Routes created');

    // Create Warehouses
    const warehouses = await Promise.all([
        prisma.warehouse.upsert({ where: { code: 'WH-NYC-01' }, update: {}, create: { companyId: company.id, code: 'WH-NYC-01', name: 'New York Warehouse', address: '500 Distribution Ave', city: 'New York', state: 'NY', country: 'USA', warehouseType: 'distribution_center' } }),
        prisma.warehouse.upsert({ where: { code: 'WH-LAX-01' }, update: {}, create: { companyId: company.id, code: 'WH-LAX-01', name: 'LA Fulfillment Center', address: '2000 Freight Blvd', city: 'Los Angeles', state: 'CA', country: 'USA', warehouseType: 'fulfillment_center' } }),
        prisma.warehouse.upsert({ where: { code: 'WH-CHI-01' }, update: {}, create: { companyId: company.id, code: 'WH-CHI-01', name: 'Chicago Cross-Dock', address: '1500 Logistics Park', city: 'Chicago', state: 'IL', country: 'USA', warehouseType: 'cross_dock' } }),
    ]);
    console.log('✓ 3 Warehouses created');

    // Create Warehouse Locations
    for (const wh of warehouses) {
        await Promise.all([
            prisma.warehouseLocation.upsert({ where: { code: `${wh.code}-A01` }, update: {}, create: { warehouseId: wh.id, code: `${wh.code}-A01`, zone: 'A', aisle: '01', rack: '01', level: '1', locationType: 'storage', capacityWeight: 5000 } }),
            prisma.warehouseLocation.upsert({ where: { code: `${wh.code}-A02` }, update: {}, create: { warehouseId: wh.id, code: `${wh.code}-A02`, zone: 'A', aisle: '01', rack: '02', level: '1', locationType: 'storage', capacityWeight: 5000 } }),
            prisma.warehouseLocation.upsert({ where: { code: `${wh.code}-B01` }, update: {}, create: { warehouseId: wh.id, code: `${wh.code}-B01`, zone: 'B', aisle: '01', rack: '01', level: '1', locationType: 'picking', capacityWeight: 2000 } }),
        ]);
    }
    console.log('✓ 9 Warehouse Locations created');

    // Create SKUs
    const skus = await Promise.all([
        prisma.sKU.upsert({ where: { code: 'SKU-ELEC-001' }, update: {}, create: { code: 'SKU-ELEC-001', name: 'Electronic Components Box', category: 'Electronics', weight: 15, volume: 0.05 } }),
        prisma.sKU.upsert({ where: { code: 'SKU-FOOD-001' }, update: {}, create: { code: 'SKU-FOOD-001', name: 'Canned Goods Pallet', category: 'Food', weight: 500, volume: 1.2 } }),
        prisma.sKU.upsert({ where: { code: 'SKU-AUTO-001' }, update: {}, create: { code: 'SKU-AUTO-001', name: 'Auto Parts Crate', category: 'Automotive', weight: 75, volume: 0.3 } }),
        prisma.sKU.upsert({ where: { code: 'SKU-FURN-001' }, update: {}, create: { code: 'SKU-FURN-001', name: 'Furniture Set', category: 'Furniture', weight: 150, volume: 2.5 } }),
        prisma.sKU.upsert({ where: { code: 'SKU-CHEM-001' }, update: {}, create: { code: 'SKU-CHEM-001', name: 'Chemical Drums', category: 'Chemicals', weight: 200, volume: 0.8 } }),
    ]);
    console.log('✓ 5 SKUs created');

    // Create Orders
    const orders = await Promise.all([
        prisma.order.create({ data: { companyId: company.id, customerId: customers[0].id, orderNo: 'ORD-2024-0001', orderType: 'FTL', status: 'IN_TRANSIT', priority: 'HIGH', shipperCity: 'New York', shipperState: 'NY', consigneeCity: 'Los Angeles', consigneeState: 'CA', totalWeight: 18000, packageCount: 24, description: 'Electronics shipment', specialHandling: '["FRAGILE"]' } }),
        prisma.order.create({ data: { companyId: company.id, customerId: customers[1].id, orderNo: 'ORD-2024-0002', orderType: 'LTL', status: 'DELIVERED', priority: 'NORMAL', shipperCity: 'Chicago', shipperState: 'IL', consigneeCity: 'Houston', consigneeState: 'TX', totalWeight: 5000, packageCount: 8, description: 'Mixed cargo', specialHandling: '[]' } }),
        prisma.order.create({ data: { companyId: company.id, customerId: customers[2].id, orderNo: 'ORD-2024-0003', orderType: 'FTL', status: 'DISPATCHED', priority: 'URGENT', shipperCity: 'Miami', shipperState: 'FL', consigneeCity: 'New York', consigneeState: 'NY', totalWeight: 22000, packageCount: 30, description: 'Retail merchandise', specialHandling: '[]' } }),
        prisma.order.create({ data: { companyId: company.id, customerId: customers[3].id, orderNo: 'ORD-2024-0004', orderType: 'PARCEL', status: 'DRAFT', priority: 'LOW', shipperCity: 'Seattle', shipperState: 'WA', consigneeCity: 'Denver', consigneeState: 'CO', totalWeight: 500, packageCount: 10, description: 'Small parcels', specialHandling: '[]' } }),
        prisma.order.create({ data: { companyId: company.id, customerId: customers[4].id, orderNo: 'ORD-2024-0005', orderType: 'FTL', status: 'CONFIRMED', priority: 'NORMAL', shipperCity: 'Dallas', shipperState: 'TX', consigneeCity: 'Phoenix', consigneeState: 'AZ', totalWeight: 15000, packageCount: 18, description: 'Industrial equipment', specialHandling: '["HEAVY"]' } }),
    ]);
    console.log('✓ 5 Orders created');

    // Create Trips
    const trips = await Promise.all([
        prisma.trip.create({ data: { companyId: company.id, tripNo: 'TRP-2024-0001', vehicleId: vehicles[0].id, driverId: drivers[0].id, origin: 'New York, NY', destination: 'Los Angeles, CA', status: 'IN_TRANSIT', distance: 4500, estimatedHours: 42, orderIds: '[]' } }),
        prisma.trip.create({ data: { companyId: company.id, tripNo: 'TRP-2024-0002', vehicleId: vehicles[1].id, driverId: drivers[1].id, origin: 'Chicago, IL', destination: 'Houston, TX', status: 'COMPLETED', distance: 1745, estimatedHours: 16, orderIds: '[]' } }),
        prisma.trip.create({ data: { companyId: company.id, tripNo: 'TRP-2024-0003', vehicleId: vehicles[2].id, driverId: drivers[2].id, origin: 'Miami, FL', destination: 'New York, NY', status: 'DISPATCHED', distance: 2150, estimatedHours: 20, orderIds: '[]' } }),
    ]);
    console.log('✓ 3 Trips created');

    // Create Invoices
    await Promise.all([
        prisma.invoice.create({ data: { companyId: company.id, customerId: customers[0].id, invoiceNo: 'INV-2024-0001', invoiceDate: new Date('2024-12-01'), dueDate: new Date('2024-12-31'), status: 'SENT', subtotal: 8500, taxAmount: 680, totalAmount: 9180, paidAmount: 0 } }),
        prisma.invoice.create({ data: { companyId: company.id, customerId: customers[1].id, invoiceNo: 'INV-2024-0002', invoiceDate: new Date('2024-11-15'), dueDate: new Date('2024-11-30'), status: 'PAID', subtotal: 3200, taxAmount: 256, totalAmount: 3456, paidAmount: 3456 } }),
        prisma.invoice.create({ data: { companyId: company.id, customerId: customers[2].id, invoiceNo: 'INV-2024-0003', invoiceDate: new Date('2024-12-05'), dueDate: new Date('2025-01-05'), status: 'DRAFT', subtotal: 12000, taxAmount: 960, totalAmount: 12960, paidAmount: 0 } }),
        prisma.invoice.create({ data: { companyId: company.id, customerId: customers[3].id, invoiceNo: 'INV-2024-0004', invoiceDate: new Date('2024-10-20'), dueDate: new Date('2024-11-20'), status: 'OVERDUE', subtotal: 5500, taxAmount: 440, totalAmount: 5940, paidAmount: 2000 } }),
    ]);
    console.log('✓ 4 Invoices created');

    // Create Tariffs
    await Promise.all([
        prisma.tariff.create({ data: { companyId: company.id, name: 'Standard FTL Rate', description: 'Full truck load standard pricing', type: 'weight_based', validFrom: new Date('2024-01-01'), validTo: new Date('2025-12-31') } }),
        prisma.tariff.create({ data: { companyId: company.id, name: 'Express LTL Rate', description: 'Less than truckload express', type: 'zone_based', validFrom: new Date('2024-01-01'), validTo: new Date('2025-06-30') } }),
        prisma.tariff.create({ data: { companyId: company.id, name: 'Cross-Country Lane Rate', description: 'Coast to coast pricing', type: 'lane_based', validFrom: new Date('2024-06-01') } }),
    ]);
    console.log('✓ 3 Tariffs created');

    // Create Tracking Events
    await Promise.all([
        prisma.trackingEvent.create({ data: { orderId: orders[0].id, tripId: trips[0].id, eventType: 'DEPARTED', location: 'New York, NY', description: 'Shipment departed from origin', latitude: 40.7128, longitude: -74.0060 } }),
        prisma.trackingEvent.create({ data: { orderId: orders[0].id, tripId: trips[0].id, eventType: 'ARRIVED', location: 'Cleveland, OH', description: 'Arrived at transit hub', latitude: 41.4993, longitude: -81.6944 } }),
        prisma.trackingEvent.create({ data: { orderId: orders[1].id, tripId: trips[1].id, eventType: 'DELIVERED', location: 'Houston, TX', description: 'Delivered to consignee', latitude: 29.7604, longitude: -95.3698 } }),
        prisma.trackingEvent.create({ data: { orderId: orders[2].id, tripId: trips[2].id, eventType: 'DISPATCHED', location: 'Miami, FL', description: 'Vehicle dispatched', latitude: 25.7617, longitude: -80.1918 } }),
    ]);
    console.log('✓ 4 Tracking Events created');

    // Create Maintenance Records
    await Promise.all([
        prisma.vehicleMaintenance.create({ data: { vehicleId: vehicles[0].id, type: 'PREVENTIVE', description: 'Oil change and inspection', cost: 450, odometer: 125000, status: 'COMPLETED', performedAt: new Date('2024-11-15') } }),
        prisma.vehicleMaintenance.create({ data: { vehicleId: vehicles[1].id, type: 'CORRECTIVE', description: 'Brake pad replacement', cost: 800, odometer: 98000, status: 'COMPLETED', performedAt: new Date('2024-12-01') } }),
        prisma.vehicleMaintenance.create({ data: { vehicleId: vehicles[2].id, type: 'PREVENTIVE', description: 'Scheduled service', cost: 350, status: 'SCHEDULED', nextDueAt: new Date('2025-01-15') } }),
    ]);
    console.log('✓ 3 Maintenance Records created');

    // Create Fuel Entries
    await Promise.all([
        prisma.fuelEntry.create({ data: { vehicleId: vehicles[0].id, date: new Date('2024-12-10'), odometer: 125500, quantity: 350, unitPrice: 3.45, totalCost: 1207.5, fuelType: 'Diesel', location: 'Chicago, IL' } }),
        prisma.fuelEntry.create({ data: { vehicleId: vehicles[0].id, date: new Date('2024-12-08'), odometer: 124800, quantity: 380, unitPrice: 3.42, totalCost: 1299.6, fuelType: 'Diesel', location: 'Columbus, OH' } }),
        prisma.fuelEntry.create({ data: { vehicleId: vehicles[1].id, date: new Date('2024-12-09'), odometer: 98500, quantity: 320, unitPrice: 3.48, totalCost: 1113.6, fuelType: 'Diesel', location: 'Houston, TX' } }),
        prisma.fuelEntry.create({ data: { vehicleId: vehicles[3].id, date: new Date('2024-12-11'), odometer: 45000, quantity: 60, unitPrice: 3.25, totalCost: 195, fuelType: 'Gasoline', location: 'New York, NY' } }),
    ]);
    console.log('✓ 4 Fuel Entries created');

    // Get warehouse locations for inventory
    const whLocations = await prisma.warehouseLocation.findMany({ take: 5 });

    // Create Inventory
    if (whLocations.length > 0 && skus.length > 0) {
        await Promise.all([
            prisma.inventory.create({ data: { warehouseId: warehouses[0].id, locationId: whLocations[0]?.id, skuId: skus[0].id, quantity: 100, availableQty: 85, reservedQty: 15, batchNo: 'BATCH-001', status: 'AVAILABLE' } }),
            prisma.inventory.create({ data: { warehouseId: warehouses[0].id, locationId: whLocations[1]?.id, skuId: skus[1].id, quantity: 50, availableQty: 50, reservedQty: 0, batchNo: 'BATCH-002', status: 'AVAILABLE' } }),
            prisma.inventory.create({ data: { warehouseId: warehouses[1].id, locationId: whLocations[2]?.id, skuId: skus[2].id, quantity: 200, availableQty: 180, reservedQty: 20, batchNo: 'BATCH-003', status: 'AVAILABLE' } }),
            prisma.inventory.create({ data: { warehouseId: warehouses[1].id, skuId: skus[3].id, quantity: 30, availableQty: 30, reservedQty: 0, status: 'AVAILABLE' } }),
            prisma.inventory.create({ data: { warehouseId: warehouses[2].id, skuId: skus[4].id, quantity: 75, availableQty: 60, reservedQty: 15, batchNo: 'BATCH-005', status: 'QUARANTINE' } }),
        ]);
        console.log('✓ 5 Inventory records created');

        // Create Inventory Transactions
        await Promise.all([
            prisma.inventoryTransaction.create({ data: { warehouseId: warehouses[0].id, skuId: skus[0].id, transactionType: 'INBOUND', quantity: 100, referenceNo: 'PO-2024-001', reason: 'Purchase order receipt' } }),
            prisma.inventoryTransaction.create({ data: { warehouseId: warehouses[0].id, skuId: skus[0].id, transactionType: 'OUTBOUND', quantity: -15, referenceNo: 'SO-2024-001', reason: 'Sales order fulfillment' } }),
            prisma.inventoryTransaction.create({ data: { warehouseId: warehouses[1].id, skuId: skus[2].id, transactionType: 'INBOUND', quantity: 200, referenceNo: 'PO-2024-002', reason: 'Supplier delivery' } }),
            prisma.inventoryTransaction.create({ data: { warehouseId: warehouses[1].id, skuId: skus[2].id, transactionType: 'TRANSFER', quantity: -20, referenceNo: 'TRF-2024-001', reason: 'Transfer to Chicago warehouse' } }),
            prisma.inventoryTransaction.create({ data: { warehouseId: warehouses[2].id, skuId: skus[4].id, transactionType: 'ADJUSTMENT', quantity: -5, referenceNo: 'ADJ-2024-001', reason: 'Cycle count adjustment' } }),
        ]);
        console.log('✓ 5 Inventory Transactions created');
    }

    // Create Company Users
    await Promise.all([
        prisma.companyUser.create({ data: { companyId: company.id, userId: 'user_admin_001', roleId: adminRole.id, email: 'admin@swiftlogistics.com', name: 'Admin User', phone: '+1-555-0001', department: 'Administration' } }),
        prisma.companyUser.create({ data: { companyId: company.id, userId: 'user_ops_001', roleId: userRole.id, email: 'operations@swiftlogistics.com', name: 'Operations Manager', phone: '+1-555-0002', department: 'Operations' } }),
        prisma.companyUser.create({ data: { companyId: company.id, userId: 'user_dispatch_001', roleId: userRole.id, email: 'dispatch@swiftlogistics.com', name: 'Dispatch Coordinator', phone: '+1-555-0003', department: 'Dispatch' } }),
        prisma.companyUser.create({ data: { companyId: company.id, userId: 'user_driver_001', roleId: driverRole.id, email: 'driver1@swiftlogistics.com', name: 'John Smith (Driver)', phone: '+1-555-0301', department: 'Fleet' } }),
        prisma.companyUser.create({ data: { companyId: company.id, userId: 'user_warehouse_001', roleId: userRole.id, email: 'warehouse@swiftlogistics.com', name: 'Warehouse Supervisor', phone: '+1-555-0004', department: 'Warehouse' } }),
    ]);
    console.log('✓ 5 Company Users created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log('- 1 Company');
    console.log('- 3 Roles');
    console.log('- 5 Customers');
    console.log('- 3 Vendors');
    console.log('- 5 Locations');
    console.log('- 4 Vehicle Types');
    console.log('- 5 Vehicles');
    console.log('- 5 Drivers');
    console.log('- 5 Routes');
    console.log('- 3 Warehouses');
    console.log('- 9 Warehouse Locations');
    console.log('- 5 SKUs');
    console.log('- 5 Orders');
    console.log('- 3 Trips');
    console.log('- 4 Invoices');
    console.log('- 3 Tariffs');
    console.log('- 4 Tracking Events');
    console.log('- 3 Maintenance Records');
    console.log('- 4 Fuel Entries');
    console.log('- 5 Inventory Records');
    console.log('- 5 Inventory Transactions');
    console.log('- 5 Company Users');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
