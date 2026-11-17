import pandas as pd
import matplotlib.pyplot as plt
import os

BASE_DIR = "../data"
OUTPUT_DIR = "../excel-reports"
os.makedirs(OUTPUT_DIR, exist_ok=True)

orders = pd.read_csv(f"{BASE_DIR}/olist_orders_dataset.csv")
items = pd.read_csv(f"{BASE_DIR}/olist_order_items_dataset.csv")
payments = pd.read_csv(f"{BASE_DIR}/olist_order_payments_dataset.csv")
customers = pd.read_csv(f"{BASE_DIR}/olist_customers_dataset.csv")
reviews = pd.read_csv(f"{BASE_DIR}/olist_order_reviews_dataset.csv")

print("\n===== SHOPSPHERE E-COMMERCE ANALYTICS =====")
print("Orders:", orders.shape)
print("Order Items:", items.shape)
print("Payments:", payments.shape)
print("Customers:", customers.shape)
print("Reviews:", reviews.shape)

total_revenue = payments["payment_value"].sum()
total_orders = orders["order_id"].nunique()
avg_order_value = total_revenue / total_orders

print("\n===== KPI SUMMARY =====")
print(f"Total Revenue: ₹{total_revenue:,.2f}")
print(f"Total Orders: {total_orders}")
print(f"Average Order Value: ₹{avg_order_value:,.2f}")

payment_summary = payments.groupby("payment_type")["payment_value"].sum().reset_index()
payment_summary.to_csv(f"{OUTPUT_DIR}/payment_summary.csv", index=False)

top_products = items["product_id"].value_counts().head(10).reset_index()
top_products.columns = ["product_id", "total_sold"]
top_products.to_csv(f"{OUTPUT_DIR}/top_products.csv", index=False)

customers_by_state = customers["customer_state"].value_counts().head(10).reset_index()
customers_by_state.columns = ["state", "customers"]
customers_by_state.to_csv(f"{OUTPUT_DIR}/customers_by_state.csv", index=False)

orders["order_purchase_timestamp"] = pd.to_datetime(orders["order_purchase_timestamp"])
orders["month"] = orders["order_purchase_timestamp"].dt.to_period("M").astype(str)
monthly_orders = orders.groupby("month").size().reset_index(name="orders")
monthly_orders.to_csv(f"{OUTPUT_DIR}/monthly_orders.csv", index=False)

review_summary = reviews["review_score"].value_counts().sort_index().reset_index()
review_summary.columns = ["review_score", "count"]
review_summary.to_csv(f"{OUTPUT_DIR}/review_summary.csv", index=False)

plt.figure(figsize=(10, 5))
monthly_orders.plot(x="month", y="orders", kind="line", legend=False)
plt.title("Monthly Orders Trend")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/monthly_orders_trend.png")

plt.figure(figsize=(8, 5))
payment_summary.plot(x="payment_type", y="payment_value", kind="bar", legend=False)
plt.title("Revenue by Payment Type")
plt.tight_layout()
plt.savefig(f"{OUTPUT_DIR}/payment_summary.png")

print("\nReports generated inside analytics/excel-reports:")
print("payment_summary.csv")
print("top_products.csv")
print("customers_by_state.csv")
print("monthly_orders.csv")
print("review_summary.csv")
print("monthly_orders_trend.png")
print("payment_summary.png")
