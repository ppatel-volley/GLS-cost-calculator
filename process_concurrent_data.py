#!/usr/bin/env python3
"""
Process Amplitude concurrent user data and generate normalized patterns for config.json
"""
import csv
import json
from datetime import datetime

def process_concurrent_data(csv_path):
    """Parse CSV and calculate normalized hourly patterns"""

    # Read CSV data
    weekday_hours = {}
    weekend_hours = {}

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            hour = int(row['HOUR_OF_DAY_UTC'])
            day_type = row['DAY_TYPE']
            avg_concurrent = float(row['AVG_CONCURRENT_USERS_5M'])

            if day_type == 'Weekday':
                weekday_hours[hour] = avg_concurrent
            elif day_type == 'Weekend':
                weekend_hours[hour] = avg_concurrent

    # Find peak across all hours for normalization
    all_values = list(weekday_hours.values()) + list(weekend_hours.values())
    peak_value = max(all_values)
    peak_hour_weekday = max(weekday_hours, key=weekday_hours.get)
    peak_hour_weekend = max(weekend_hours, key=weekend_hours.get)

    print(f"\n=== Concurrent User Analysis ===")
    print(f"Peak concurrent users: {peak_value:.2f}")
    print(f"Peak weekday hour: {peak_hour_weekday} ({weekday_hours[peak_hour_weekday]:.2f} users)")
    print(f"Peak weekend hour: {peak_hour_weekend} ({weekend_hours[peak_hour_weekend]:.2f} users)")

    # Normalize to 0-1 range (where 1.0 = peak hour)
    weekday_normalized = {str(hour): round(weekday_hours[hour] / peak_value, 3) for hour in range(24)}
    weekend_normalized = {str(hour): round(weekend_hours[hour] / peak_value, 3) for hour in range(24)}

    # Calculate average concurrent for reference
    avg_weekday = sum(weekday_hours.values()) / len(weekday_hours)
    avg_weekend = sum(weekend_hours.values()) / len(weekend_hours)

    print(f"\nAverage concurrent - Weekday: {avg_weekday:.2f}")
    print(f"Average concurrent - Weekend: {avg_weekend:.2f}")
    print(f"\nNormalization factor: {peak_value:.2f}")

    # Generate output structure
    output = {
        "metadata": {
            "data_source": "Amplitude Analytics - Roku games concurrent users",
            "measurement_type": "Average concurrent users per 5-minute interval",
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "peak_concurrent_users": round(peak_value, 2),
            "peak_hour_weekday": peak_hour_weekday,
            "peak_hour_weekend": peak_hour_weekend,
            "avg_concurrent_weekday": round(avg_weekday, 2),
            "avg_concurrent_weekend": round(avg_weekend, 2),
            "data_quality": "COMPLETE - Comprehensive hourly averages split by weekday/weekend"
        },
        "weekday_pattern": {
            "description": "Weekday pattern from Amplitude hourly averages (normalized to peak=1.0)",
            "data_quality": "COMPLETE - Full 24-hour coverage with real production data",
            "hours": weekday_normalized
        },
        "weekend_pattern": {
            "description": "Weekend pattern from Amplitude hourly averages (normalized to peak=1.0)",
            "data_quality": "COMPLETE - Full 24-hour coverage with real production data",
            "hours": weekend_normalized
        }
    }

    return output

if __name__ == "__main__":
    csv_path = "Hourly concurrent - weekend vs weekday - Fire by Hour - Weekday vs Weekend.csv"

    print("Processing concurrent user data from CSV...")
    result = process_concurrent_data(csv_path)

    # Output formatted JSON
    print("\n=== Generated Config Structure ===")
    print(json.dumps(result, indent=2))

    # Save to file
    output_path = "all_games_patterns_updated.json"
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"\n✓ Saved updated patterns to {output_path}")
    print("\nNext: Copy the weekday_pattern and weekend_pattern sections into config.json")
    print("under all_games_model.time_zone_patterns")
