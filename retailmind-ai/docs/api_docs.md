# RetailMind AI - API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## Authentication (`/auth/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register/` | Register a new user (`username`, `email`, `password`, `role`) | No |
| POST | `/auth/login/` | User login (`username`, `password`) -> returns JWT `access` & `refresh` | No |
| POST | `/auth/refresh/` | Refresh JWT access token (`refresh`) | No |
| GET | `/auth/me/` | Fetch details of currently authenticated user | Yes |
| POST | `/auth/logout/` | Blacklist refresh token / client logout | Yes |

---

## Products (`/products/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products/` | List all products with category and brand filtering | Yes |
| POST | `/products/` | Create a new product (`sku`, `product_name`, `category`, `brand`) | Yes |
| GET | `/products/{id}/` | Retrieve specific product details | Yes |
| PUT/PATCH | `/products/{id}/` | Update product details | Yes |
| DELETE | `/products/{id}/` | Delete product | Yes |

---

## Inventory (`/inventory/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/inventory/` | List all inventory records | Yes |
| POST | `/inventory/` | Create stock entry (`product`, `current_stock`, `reorder_level`, `warehouse`) | Yes |
| GET | `/inventory/{id}/` | Retrieve inventory record | Yes |
| PUT/PATCH | `/inventory/{id}/` | Update stock level or reorder point | Yes |
| DELETE | `/inventory/{id}/` | Remove inventory record | Yes |

---

## Forecasting (`/forecasting/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/forecasting/predict/` | Run demand forecast for product (`product_id`, `lead_time_days`, `promotional_event`) | Yes |
| GET | `/forecasting/history/` | List historical AI demand predictions | Yes |

---

## Dashboard (`/dashboard/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/summary/` | Summary metrics (Total products, Stockout alerts, Total forecast demand) | Yes |
| GET | `/dashboard/alerts/` | Real-time low stock & reorder alert feed | Yes |
| GET | `/dashboard/charts/` | Aggregated analytics for demand trends & stock levels | Yes |
