# Database Schema Documentation

This document describes the database schema for the Courier Logistics ERP system.

## Entity Relationship Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Company   │────<│   Branch    │     │    Role     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Customer   │     │ CompanyUser │<────│             │
│   Vendor    │     └─────────────┘     └─────────────┘
│   Vehicle   │
│   Driver    │
│  Warehouse  │
│   Order     │
│   Invoice   │
└─────────────┘
```

## Models

### Multi-Tenancy & Users

#### Company
The root entity for multi-tenancy. All business data is scoped to a company.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| name | String | Company name |
| displayName | String? | Display name |
| email | String? | Contact email |
| phone | String? | Contact phone |
| address | String? | Street address |
| city | String? | City |
| state | String? | State/Province |
| country | String? | Country |
| postalCode | String? | Postal/ZIP code |
| taxId | String? | Tax identification number |
| isActive | Boolean | Active status (default: true) |

#### Branch
Physical locations/offices within a company.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| name | String | Branch name |
| code | String? | Unique branch code |
| address | String? | Full address |
| isActive | Boolean | Active status |

#### Role
User roles with JSON-based permissions.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| name | String | Unique role name |
| displayName | String | Display name |
| description | String? | Role description |
| permissions | String | JSON permissions array |

#### CompanyUser
Associates Clerk users with companies and roles.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| branchId | String? | FK to Branch |
| userId | String | Clerk user ID |
| roleId | String | FK to Role |
| email | String | User email |
| name | String? | Display name |

---

### Master Data

#### Customer
Customer accounts for billing and shipments.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| code | String? | Unique customer code |
| name | String | Customer name |
| email | String? | Contact email |
| phone | String? | Contact phone |
| creditLimit | Float | Credit limit (default: 0) |
| paymentTerms | String? | e.g., "NET30" |

#### Vendor
Transportation partners and service providers.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| code | String? | Unique vendor code |
| name | String | Vendor name |
| serviceTypes | String | JSON array of services |

#### Vehicle
Fleet vehicle registry.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| vendorId | String? | FK to Vendor (if owned by vendor) |
| vehicleTypeId | String | FK to VehicleType |
| registration | String | Unique registration number |
| make | String? | Vehicle make |
| model | String? | Vehicle model |
| capacityWeight | Float? | Weight capacity (kg) |
| capacityVolume | Float? | Volume capacity (m³) |
| fitnessExpiry | DateTime? | Fitness certificate expiry |
| insuranceExpiry | DateTime? | Insurance expiry |

#### Driver
Driver profiles and certifications.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| vendorId | String? | FK to Vendor |
| code | String? | Unique driver code |
| name | String | Driver name |
| licenseNo | String? | Unique license number |
| licenseExpiry | DateTime? | License expiry date |
| rating | Float? | Performance rating |

#### Location
Warehouses, ports, airports, and customer locations.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| name | String | Location name |
| code | String? | Unique location code |
| type | String | warehouse, port, airport, customer |
| latitude | Float? | GPS latitude |
| longitude | Float? | GPS longitude |

#### Route
Transportation lanes between locations.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| origin | String | Origin location |
| destination | String | Destination location |
| distance | Float? | Distance in km |
| normalHours | Float? | Normal transit time (hours) |

---

### Operations

#### Order
Transportation orders/shipments.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| customerId | String | FK to Customer |
| orderNo | String | Unique order number |
| orderType | String | FTL, LTL, PARCEL, CONTAINER |
| status | String | DRAFT, CONFIRMED, DISPATCHED, DELIVERED |
| priority | String | LOW, NORMAL, HIGH, URGENT |
| shipperName | String? | Shipper details |
| consigneeName | String? | Consignee details |
| pickupDate | DateTime? | Scheduled pickup |
| deliveryDate | DateTime? | Scheduled delivery |
| totalWeight | Float | Total weight (kg) |
| totalVolume | Float | Total volume (m³) |
| freightCharge | Float | Freight charges |

#### Trip
Planned/active transportation trips.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| orderIds | String | JSON array of order IDs |
| tripNo | String | Unique trip number |
| vehicleId | String? | FK to Vehicle |
| driverId | String? | FK to Driver |
| status | String | PLANNED, DISPATCHED, IN_TRANSIT, DELIVERED |
| plannedDeparture | DateTime? | Planned departure time |
| actualDeparture | DateTime? | Actual departure time |
| estimatedCost | Float | Estimated trip cost |

#### TrackingEvent
GPS and status updates for orders/trips.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| orderId | String? | FK to Order |
| tripId | String? | FK to Trip |
| eventType | String | DEPARTED, ARRIVED, DELAYED, etc. |
| location | String? | Location description |
| latitude | Float? | GPS latitude |
| longitude | Float? | GPS longitude |
| timestamp | DateTime | Event timestamp |

---

### Warehouse

#### Warehouse
Storage facilities.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| name | String | Warehouse name |
| code | String? | Unique warehouse code |
| warehouseType | String? | distribution_center, fulfillment_center, etc. |

#### WarehouseLocation
Storage bins and slots within warehouses.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| warehouseId | String | FK to Warehouse |
| code | String? | Unique location code (e.g., A-01-01-A) |
| zone | String? | Zone identifier |
| aisle | String? | Aisle number |
| rack | String? | Rack number |
| level | String? | Shelf level |
| locationType | String? | storage, picking, receiving, shipping |
| capacityWeight | Float? | Weight capacity |

#### SKU
Stock keeping units.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| code | String | Unique SKU code |
| name | String | Product name |
| category | String? | Category |
| weight | Float | Unit weight (kg) |
| volume | Float | Unit volume (m³) |
| hsnCode | String? | HSN/HS code |

#### Inventory
Current stock levels.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| warehouseId | String | FK to Warehouse |
| locationId | String? | FK to WarehouseLocation |
| skuId | String | FK to SKU |
| batchNo | String? | Batch number |
| quantity | Float | Current quantity |
| reservedQty | Float | Reserved quantity |
| availableQty | Float | Available quantity |
| status | String | AVAILABLE, RESERVED, DAMAGED, QUARANTINE |

#### InventoryTransaction
Stock movement audit log.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| warehouseId | String | FK to Warehouse |
| skuId | String | FK to SKU |
| transactionType | String | INBOUND, OUTBOUND, TRANSFER, ADJUSTMENT |
| quantity | Float | Movement quantity |
| referenceNo | String? | Reference number |
| reason | String? | Reason for transaction |

---

### Finance

#### Tariff
Pricing structures for services.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| name | String | Tariff name |
| type | String | lane_based, zone_based, weight_based |
| validFrom | DateTime | Valid from date |
| validTo | DateTime? | Valid until date |

#### Invoice
Customer invoices.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| companyId | String | FK to Company |
| customerId | String | FK to Customer |
| invoiceNo | String | Unique invoice number |
| invoiceDate | DateTime | Invoice date |
| status | String | DRAFT, SENT, PAID, OVERDUE |
| totalAmount | Float | Total invoice amount |
| paidAmount | Float | Amount paid |
| balanceAmount | Float | Outstanding balance |

---

### Fleet

#### VehicleMaintenance
Maintenance records for vehicles.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| vehicleId | String | FK to Vehicle |
| type | String | PREVENTIVE, CORRECTIVE, EMERGENCY |
| description | String? | Maintenance description |
| cost | Float | Maintenance cost |
| status | String | SCHEDULED, IN_PROGRESS, COMPLETED |

#### FuelEntry
Fuel consumption records.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| vehicleId | String | FK to Vehicle |
| driverId | String? | FK to Driver |
| date | DateTime | Fuel date |
| quantity | Float | Fuel quantity (liters) |
| totalCost | Float | Total fuel cost |
| location | String? | Fuel station |

---

## Indexes & Constraints

### Unique Constraints
- `Company.id`
- `Branch.code`
- `Customer.code`
- `Vendor.code`
- `Vehicle.registration`, `Vehicle.vin`
- `Driver.code`, `Driver.licenseNo`
- `Location.code`
- `Route(origin, destination)`
- `Order.orderNo`
- `Trip.tripNo`
- `Warehouse.code`
- `WarehouseLocation.code`
- `SKU.code`
- `Inventory(warehouseId, locationId, skuId, batchNo)`
- `Invoice.invoiceNo`

### Foreign Key Cascades
- `onDelete: Cascade` - Child records deleted with parent
- `onDelete: SetNull` - FK set to null when parent deleted
