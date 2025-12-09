# 🚚 Courier - Logistics ERP System

A modern, full-featured Logistics and Transportation Management System built with Next.js 15, PostgreSQL, and Prisma.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Modules](#-modules)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 📊 Dashboard
- Real-time business metrics and KPIs
- Revenue charts and analytics
- Quick access to all modules

### 📦 Order Management
- Create and manage transportation orders
- Order tracking with status updates
- Multi-stop shipment support
- Special handling requirements

### 🚛 Transportation
- **Trip Management**: Plan and dispatch trips
- **Route Configuration**: Define lanes with distance and transit times
- **Live Tracking**: Real-time GPS tracking of vehicles

### 🏭 Warehouse Management
- **Inventory Control**: SKU-level stock management
- **Location Management**: Zone, aisle, rack, level configurations
- **Transaction Logging**: Complete audit trail of movements

### 📇 Master Data
- **Customers**: CRM with credit limits and payment terms
- **Vendors**: Partner and contract management
- **Vehicles**: Fleet registration and compliance tracking
- **Drivers**: License management and performance ratings
- **Locations**: Multi-type location support (warehouses, ports, airports)

### 💰 Billing & Finance
- Invoice generation and management
- Payment tracking
- Revenue analytics

### 🔧 Fleet Management
- Vehicle maintenance scheduling
- Fuel consumption tracking
- Compliance monitoring

### 📈 Analytics
- Business intelligence dashboards
- Performance metrics
- Custom reporting

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL 17 |
| **ORM** | Prisma 6 |
| **Authentication** | Clerk |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui + Radix UI |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aifalabsglobal/courier.git
   cd courier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/courier"
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
courier/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── analytics/     # Analytics module
│   │   │   ├── billing/       # Billing & invoices
│   │   │   ├── fleet/         # Fleet management
│   │   │   ├── master-data/   # Master data (customers, vendors, etc.)
│   │   │   ├── orders/        # Order management
│   │   │   ├── transportation/# Transportation & trips
│   │   │   └── warehouse/     # Warehouse & inventory
│   │   ├── sign-in/           # Authentication
│   │   └── sign-up/
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities
├── public/                    # Static assets
└── package.json
```

## 🗄 Database Schema

The system uses a comprehensive schema with 30+ models:

### Core Entities
- **Company** - Multi-tenant organization
- **Branch** - Company locations
- **CompanyUser** - User-company associations with roles

### Master Data
- **Customer** - Customer accounts
- **Vendor** - Transportation partners
- **Vehicle** - Fleet vehicles
- **VehicleType** - Vehicle classifications
- **Driver** - Driver profiles
- **Location** - Geographic locations
- **Route** - Transportation lanes

### Operations
- **Order** - Transportation orders
- **OrderItem** - Order line items
- **Trip** - Planned/active trips
- **TrackingEvent** - GPS/status updates

### Warehouse
- **Warehouse** - Storage facilities
- **WarehouseLocation** - Bin/slot locations
- **SKU** - Stock keeping units
- **Inventory** - Stock levels
- **InventoryTransaction** - Stock movements

### Finance
- **Tariff** - Pricing structures
- **TariffSlab** - Rate slabs
- **Invoice** - Customer invoices
- **InvoiceLine** - Invoice details

### Fleet
- **VehicleMaintenance** - Service records
- **FuelEntry** - Fuel consumption

## 📱 Modules

### Dashboard (`/dashboard`)
Main overview with KPIs, charts, and quick actions.

### Master Data (`/dashboard/master-data`)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/master-data` | Links to all master data |
| Customers | `/master-data/customers` | Customer CRUD |
| Vendors | `/master-data/vendors` | Vendor management |
| Vehicles | `/master-data/vehicles` | Fleet vehicles |
| Drivers | `/master-data/drivers` | Driver profiles |
| Locations | `/master-data/locations` | Location registry |

### Orders (`/dashboard/orders`)
Complete order lifecycle management.

### Transportation (`/dashboard/transportation`)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/transportation` | Trip summary |
| Trips | `/transportation/trips` | Trip management |
| Routes | `/transportation/routes` | Lane configuration |
| Tracking | `/transportation/tracking` | Live tracking |

### Warehouse (`/dashboard/warehouse`)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/warehouse` | Inventory summary |
| Inventory | `/warehouse/inventory` | Stock levels |
| Locations | `/warehouse/locations` | Bin management |
| Transactions | `/warehouse/transactions` | Movement log |

### Billing (`/dashboard/billing`)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/billing` | Financial summary |
| Invoices | `/billing/invoices` | Invoice management |

### Fleet (`/dashboard/fleet`)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/fleet` | Fleet summary |
| Maintenance | `/fleet/maintenance` | Service scheduling |

### Analytics (`/dashboard/analytics`)
Business intelligence and reporting.

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |

Example `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/courier"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

## 🚀 Deployment

### Database Commands
```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations (production)
npm run db:reset     # Reset database (development)
```

### Build for Production
```bash
npm run build
npm start
```

### Docker (Coming Soon)
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by AIFA Labs Global.

---

Built with ❤️ by [AIFA Labs Global](https://github.com/aifalabsglobal)
