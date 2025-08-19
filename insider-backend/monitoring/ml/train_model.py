# monitoring/ml/train_model.py
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from django.utils import timezone
from django.db.models import Q

# If running from manage.py shell or a management command, set DJANGO_SETTINGS_MODULE accordingly.

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'iso_forest.joblib')

def extract_features_from_queryset(qs):
    """
    qs: QuerySet of AuditLog objects for a chosen historical period (e.g., 30 days)
    Returns: DataFrame with columns (user, window_end, feature_*)
    """
    # We'll build a simple user-level feature set aggregated per day (or custom window)
    # You can adapt windowing to minutes.
    logs = list(qs.values('actor_id', 'action', 'resource_id', 'timestamp'))
    if not logs:
        return pd.DataFrame()

    df = pd.DataFrame(logs)
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Example aggregation: per actor per day
    df['date'] = df['timestamp'].dt.floor('D')
    # pivot counts by action
    action_counts = df.pivot_table(index=['actor_id','date'], columns='action', values='resource_id', aggfunc='count', fill_value=0)
    # resource diversity
    unique_res = df.groupby(['actor_id','date'])['resource_id'].nunique().rename('unique_resources')
    agg = action_counts.join(unique_res, how='left').fillna(0)
    agg.reset_index(inplace=True)

    # add hour features aggregated as mean hour (optional)
    agg['total_actions'] = agg[action_counts.columns].sum(axis=1)
    # replace NaNs
    agg = agg.fillna(0)
    return agg

def train_and_save(qs, contamination=0.01, random_state=42):
    """Train IsolationForest from auditlog queryset and save pipeline."""
    Xdf = extract_features_from_queryset(qs)
    if Xdf.empty:
        raise ValueError("No training data")

    feature_cols = [c for c in Xdf.columns if c not in ('actor_id','date')]
    X = Xdf[feature_cols].values

    pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('iso', IsolationForest(n_estimators=200, contamination=contamination, behaviour='new', random_state=random_state))
    ])

    pipe.fit(X)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump({'pipeline': pipe, 'feature_cols': feature_cols}, MODEL_PATH)
    print("Saved model to", MODEL_PATH)
    return MODEL_PATH

if __name__ == '__main__':
    # Example: train on last 30 days of logs
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'insiderbackend.settings')
    django.setup()
    from users.models import AuditLog
    period_start = timezone.now() - pd.Timedelta(days=30)
    qs = AuditLog.objects.filter(timestamp__gte=period_start)
    train_and_save(qs)
