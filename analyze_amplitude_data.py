#!/usr/bin/env python3
"""
Analyze Amplitude CSV data to extract hourly usage patterns for All Games mode.
"""

import csv
from datetime import datetime
from collections import defaultdict

# Read the CSV file
csv_file = "Event Segmentation - [Amplitude] Any Active Event (2025.09.30 - 2025.10.07).csv"

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

# Parse header row (row 5, index 4) - has timestamps
header = rows[4]
# Parse data row (row 6, index 5) - has user counts
data = rows[5]

# Extract timestamps and user counts
timestamps = []
user_counts = []

for i in range(2, len(header)):  # Skip first two columns
    timestamp_str = header[i].strip()
    user_count_str = data[i].strip()

    if timestamp_str and user_count_str:
        # Parse timestamp: "2025-09-30T00:00:00"
        dt = datetime.fromisoformat(timestamp_str)
        count = int(user_count_str)
        timestamps.append(dt)
        user_counts.append(count)

print(f"📊 Parsed {len(timestamps)} hourly data points from {timestamps[0]} to {timestamps[-1]}")
print(f"📈 User count range: {min(user_counts)} to {max(user_counts)}")

# Separate weekday vs weekend patterns
weekday_hours = defaultdict(list)  # hour -> [counts]
weekend_hours = defaultdict(list)

for dt, count in zip(timestamps, user_counts):
    hour = dt.hour
    is_weekend = dt.weekday() >= 5  # Saturday=5, Sunday=6

    if is_weekend:
        weekend_hours[hour].append(count)
    else:
        weekday_hours[hour].append(count)

# Calculate average patterns
print("\n📅 WEEKDAY PATTERN (Monday-Friday)")
weekday_pattern = {}
weekday_total = 0
for hour in range(24):
    if hour in weekday_hours:
        avg = sum(weekday_hours[hour]) / len(weekday_hours[hour])
        weekday_pattern[hour] = avg
        weekday_total += avg
        print(f"  {hour:2d}:00 - {avg:6.1f} users (n={len(weekday_hours[hour])})")

print(f"\n  Average hourly users (weekday): {weekday_total / 24:.1f}")
print(f"  Peak hour: {max(weekday_pattern.items(), key=lambda x: x[1])}")

print("\n📅 WEEKEND PATTERN (Saturday-Sunday)")
weekend_pattern = {}
weekend_total = 0
for hour in range(24):
    if hour in weekend_hours:
        avg = sum(weekend_hours[hour]) / len(weekend_hours[hour])
        weekend_pattern[hour] = avg
        weekend_total += avg
        print(f"  {hour:2d}:00 - {avg:6.1f} users (n={len(weekend_hours[hour])})")

print(f"\n  Average hourly users (weekend): {weekend_total / 24:.1f}")
print(f"  Peak hour: {max(weekend_pattern.items(), key=lambda x: x[1])}")

# Normalize to multipliers (peak = 1.0)
weekday_peak = max(weekday_pattern.values())
weekend_peak = max(weekend_pattern.values())

print("\n🔢 NORMALIZED WEEKDAY MULTIPLIERS (for config)")
weekday_multipliers = {}
for hour in range(24):
    multiplier = weekday_pattern.get(hour, 0) / weekday_peak
    weekday_multipliers[str(hour)] = round(multiplier, 3)
    print(f'  "{hour}": {multiplier:.3f},')

print("\n🔢 NORMALIZED WEEKEND MULTIPLIERS (for config)")
weekend_multipliers = {}
for hour in range(24):
    multiplier = weekend_pattern.get(hour, 0) / weekend_peak
    weekend_multipliers[str(hour)] = round(multiplier, 3)
    print(f'  "{hour}": {multiplier:.3f},')

# Calculate concurrent ratio
# Peak concurrent = max hourly users
# Total DAU = sum of unique users across the day
# For simplicity, estimate DAU as ~3x peak concurrent (typical for gaming)
max_concurrent = max(user_counts)
estimated_dau = max_concurrent * 3  # Conservative estimate

concurrent_ratio = max_concurrent / estimated_dau
print(f"\n📊 CONCURRENT RATIO ESTIMATION")
print(f"  Peak concurrent users: {max_concurrent}")
print(f"  Estimated DAU (3x peak): {estimated_dau}")
print(f"  Concurrent ratio: {concurrent_ratio:.1%}")
print(f"  Suggested config value: 0.10 (generic model)")

# Total active time analysis
print(f"\n⏱️ USAGE PATTERN ANALYSIS")
print(f"  Data period: {(timestamps[-1] - timestamps[0]).days + 1} days")
print(f"  Total hourly samples: {len(timestamps)}")
print(f"  Average concurrent users: {sum(user_counts) / len(user_counts):.1f}")

# ACTUAL CONCURRENT RATIO (from user-provided DAU)
actual_dau = 4000
actual_concurrent_ratio = max_concurrent / actual_dau
print(f"\n🎯 ACTUAL CONCURRENT RATIO (with real DAU data)")
print(f"  Peak concurrent users: {max_concurrent}")
print(f"  Actual DAU: {actual_dau}")
print(f"  **Actual concurrent ratio: {actual_concurrent_ratio:.1%}**")
print(f"  Config value to use: {actual_concurrent_ratio:.2f}")
print(f"\n  📊 Comparison:")
print(f"     CoComelon (child): 8%")
print(f"     Generic model: 10%")
print(f"     All Games (adult): {actual_concurrent_ratio:.1%} ← USE THIS")
