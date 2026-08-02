"""
RetailMind AI - Model Training Pipeline Script (XGBoost / Scikit-Learn Template)

This script demonstrates how historical POS/sales data is ingested, preprocessed,
and trained using XGBoost / RandomForest regressors. The output model artifact
is serialized using Joblib into ml/models/demand_forecast_model.joblib.

"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import xgboost as xgb


def generate_synthetic_pos_data(num_samples: int = 1000) -> pd.DataFrame:
    """Generates synthetic POS dataset for FMCG demand training."""
    np.random.seed(42)
    dates = pd.date_range(start="2024-01-01", periods=num_samples, freq="D")
    
    data = {
        "date": dates,
        "product_id": np.random.randint(1, 10, size=num_samples),
        "historical_sales_7d": np.random.randint(50, 500, size=num_samples),
        "historical_sales_30d": np.random.randint(300, 3500, size=num_samples),
        "promotional_flag": np.random.choice([0, 1], size=num_samples, p=[0.8, 0.2]),
        "price": np.random.uniform(10.0, 150.0, size=num_samples),
        "lead_time_days": np.random.randint(1, 14, size=num_samples),
        "seasonality_index": np.random.uniform(0.8, 1.5, size=num_samples),
    }
    
    df = pd.DataFrame(data)
    # Target demand calculation formula with synthetic noise
    df["target_demand"] = (
        df["historical_sales_7d"] * 0.4 +
        df["historical_sales_30d"] * 0.05 +
        df["promotional_flag"] * 75 +
        (150 - df["price"]) * 0.5 +
        df["seasonality_index"] * 30 +
        np.random.normal(0, 10, num_samples)
    )
    df["target_demand"] = np.maximum(0, df["target_demand"]).astype(int)
    return df


def train_and_save_model(output_path: str = "ml/models/demand_forecast_model.joblib"):
    """Trains an XGBoost Regressor model on POS dataset and exports joblib artifact."""
    print("🚀 Ingesting FMCG POS demand dataset...")
    df = generate_synthetic_pos_data(2000)
    
    features = [
        "product_id",
        "historical_sales_7d",
        "historical_sales_30d",
        "promotional_flag",
        "price",
        "lead_time_days",
        "seasonality_index"
    ]
    target = "target_demand"
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("🧠 Training XGBoost Demand Forecasting Model...")
    model = xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.05,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"✅ Model Training Complete!")
    print(f"📊 Validation MAE: {mae:.2f} units")
    print(f"📊 Validation R² Score: {r2:.4f}")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    joblib.dump(model, output_path)
    print(f"💾 Model artifact saved successfully to: {output_path}")


if __name__ == "__main__":
    train_and_save_model()
