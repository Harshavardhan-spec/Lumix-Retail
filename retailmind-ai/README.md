# RetailMind AI: AI-Powered Hyperlocal Demand Forecasting Platform

RetailMind AI is a production-ready, open-source, on-premise inventory demand forecasting system engineered specifically for FMCG (Fast-Moving Consumer Goods) distributors and retail store operators. It leverages historical POS (Point of Sale) sales velocity, promotional signals, and lead times to generate accurate demand forecasts and stock reorder alerts without relying on cloud vendors.

---

## 🌟 Key Features

- **100% On-Premise Execution**: Zero cloud dependency. Data privacy and local deployment guaranteed.
- **Modular Django 5+ Backend**: Separated into 5 dedicated micro-apps (`users`, `products`, `inventory`, `forecasting`, `dashboard`).
- **Explainable AI (XAI) Forecasting**: Interactive prediction service powered by XGBoost / Scikit-Learn models with feature attribution explanations.
- **Real-Time Stock Alerts**: Intelligent stockout and reorder threshold monitoring across distribution hubs.
- **Modern Glassmorphic React Frontend**: Responsive dashboard built with Vite, React Router v6, Tailwind CSS, and Lucide Icons.
- **JWT Authentication**: Secure SimpleJWT authentication flow with auto-refresh token handling via Axios interceptors.
- **Docker Support**: Containerized PostgreSQL, Django Backend, and Vite Frontend orchestrated with `docker-compose`.

---

## 📁 Project Directory Structure

```
retailmind-ai/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── retailmind/
│   │   ├── settings.py       # CORS, SimpleJWT, Database, Apps config
│   │   ├── urls.py           # /api/v1/ versioned routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── apps/
│   │   ├── users/            # Custom User model & JWT Auth APIs
│   │   ├── products/         # Product catalog CRUD (ModelViewSet)
│   │   ├── inventory/        # Stock management & low-stock alerts
│   │   ├── forecasting/      # Demand prediction & ML predictor service layer
│   │   │   └── services/
│   │   │       └── predictor.py # ML inference service class (load_model, preprocess, predict)
│   │   └── dashboard/        # Summary metrics, stock warnings, & analytics charts
│   ├── media/
│   └── static/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── api/              # Axios HTTP client with JWT interceptors
│       ├── components/       # Navbar, Sidebar, Layout, KpiCard, StockAlertBadge, Modal
│       ├── context/          # AuthContext provider
│       ├── pages/            # Login, Register, Dashboard, Products, Inventory, Forecast
│       ├── App.jsx
│       └── main.jsx
├── ml/
│   ├── models/               # Joblib serialized model artifacts (.joblib)
│   ├── datasets/             # Historical POS datasets (CSV)
│   ├── notebooks/            # Jupyter research notebooks
│   └── train.py              # Runnable XGBoost training script
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/
│   └── api_docs.md           # API specification guide
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and adjust variables as required:

```env
DEBUG=True
SECRET_KEY=django-insecure-retailmind-super-secret-key-change-in-prod
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database Settings (PostgreSQL or local SQLite fallback)
USE_POSTGRES=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=retailmind_db
DB_USER=retailmind_user
DB_PASSWORD=retailmind_pass
DB_HOST=localhost
DB_PORT=5432

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 🚀 Quickstart & Setup Guide

### Option 1: Running with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running.
2. Clone the repository and navigate into the project directory:
   ```bash
   cd retailmind-ai
   ```
3. Launch the container stack:
   ```bash
   docker-compose up --build
   ```
4. Access services:
   - **Frontend UI**: `http://localhost:5173`
   - **Backend API**: `http://localhost:8000/api/v1/`
   - **Django Admin**: `http://localhost:8000/admin/`

---

### Option 2: Manual Local Installation

#### 1. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (Admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

#### 2. Machine Learning Model Training (`/ml`)

To train the demand forecasting model and generate a `.joblib` artifact:

```bash
# From project root
python ml/train.py
```
This script generates `ml/models/demand_forecast_model.joblib`. The backend service `forecasting/services/predictor.py` automatically detects and loads this artifact!

#### 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 REST API Reference Overview

- `POST /api/v1/auth/register/` - Register a user
- `POST /api/v1/auth/login/` - Login & acquire JWT access/refresh tokens
- `GET /api/v1/auth/me/` - Retrieve authenticated user profile
- `GET/POST/PUT/DELETE /api/v1/products/` - Manage FMCG Products catalog
- `GET/POST/PUT/DELETE /api/v1/inventory/` - Manage Stock & Warehouse levels
- `POST /api/v1/forecasting/predict/` - Execute AI demand prediction
- `GET /api/v1/forecasting/history/` - View prediction logs
- `GET /api/v1/dashboard/summary/` - KPI summary statistics
- `GET /api/v1/dashboard/alerts/` - Real-time stockout warning feed
- `GET /api/v1/dashboard/charts/` - Analytics demand trends data

See [docs/api_docs.md](file:///C:/Users/ahars/.gemini/antigravity-ide/scratch/retailmind-ai/docs/api_docs.md) for full details.

---

## 🔮 Future Scope & Enhancements

1. **Prophet / ARIMA Time-Series Integration**: Extend `predictor.py` to support Facebook Prophet for complex multi-year holiday seasonality.
2. **ERP / POS Hardware Sync**: Connect directly via MQTT or Webhooks to local POS scanners and barcodes.
3. **Automated Purchase Order Generation**: Auto-generate PDF purchase orders sent to FMCG distributors when inventory hits critical thresholds.
4. **Hyperlocal Weather & Event Ingestion**: Incorporate regional weather forecasts and local festival data into feature extraction.
