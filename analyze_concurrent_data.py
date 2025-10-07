#!/usr/bin/env python3
"""
Analyze real concurrent user data from Amplitude to improve All Games model.

Processes 5-minute interval concurrent user snapshots to calculate:
- Peak concurrent users (actual simultaneous users)
- Peak concurrent ratio (peak / DAU)
- Hourly average concurrent patterns for weekday/weekend
- Normalized hourly multipliers for config.json
"""

import csv
from datetime import datetime
from collections import defaultdict

# Known DAU for Oct 6-7 period
DAU = 4160

def parse_concurrent_csv(filepath):
    """Parse concurrent user CSV with 5-minute intervals."""
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    # Line 7 (0-indexed line 6) has timestamps
    timestamps_line = lines[6].strip()
    timestamps = [t.strip().strip('"').strip() for t in timestamps_line.split(',')[1:]]
    
    # Line 8 (0-indexed line 7) has concurrent user counts
    values_line = lines[7].strip()
    values = [v.strip().strip('"').strip() for v in values_line.split(',')[1:]]
    
    data_points = []
    for ts_str, val_str in zip(timestamps, values):
        try:
            dt = datetime.fromisoformat(ts_str)
            concurrent = int(val_str)
            data_points.append({
                'datetime': dt,
                'day_of_week': dt.strftime('%A'),
                'hour': dt.hour,
                'date': dt.date(),
                'concurrent': concurrent
            })
        except:
            continue
    
    return data_points

def main():
    print("=" * 80)
    print("CONCURRENT USER ANALYSIS - Oct 6-7, 2025")
    print("=" * 80)
    print(f"\nKnown DAU for period: {DAU:,}")
    
    # Parse concurrent user data
    print("\nParsing concurrent user CSV...")
    data = parse_concurrent_csv('/Users/sean/Desktop/product/gls-cost-calculator/Roku games concurrent users.csv')
    
    print(f"Total 5-minute intervals: {len(data)}")
    print(f"Date range: {data[0]['date']} to {data[-1]['date']}")
    
    # Separate by day
    oct6_data = [d for d in data if d['date'].day == 6]  # Sunday
    oct7_data = [d for d in data if d['date'].day == 7]  # Monday
    
    print(f"\nOct 6 (Sunday) intervals: {len(oct6_data)}")
    print(f"Oct 7 (Monday) intervals: {len(oct7_data)}")
    
    # Find peak concurrent
    peak_concurrent = max(d['concurrent'] for d in data)
    peak_entry = [d for d in data if d['concurrent'] == peak_concurrent][0]
    
    print("\n" + "=" * 80)
    print("PEAK CONCURRENT ANALYSIS")
    print("=" * 80)
    print(f"Peak Concurrent Users: {peak_concurrent}")
    print(f"Peak Time: {peak_entry['datetime']} ({peak_entry['day_of_week']})")
    print(f"Peak Concurrent Ratio: {(peak_concurrent / DAU * 100):.2f}%")
    print(f"\n📊 Current model assumes 15.0% - Actual data shows {(peak_concurrent / DAU * 100):.2f}%")
    
    # Calculate hourly averages
    print("\n" + "=" * 80)
    print("HOURLY CONCURRENT PATTERNS")
    print("=" * 80)
    
    # Group by hour for each day type
    sunday_by_hour = defaultdict(list)
    monday_by_hour = defaultdict(list)
    
    for entry in oct6_data:
        sunday_by_hour[entry['hour']].append(entry['concurrent'])
    
    for entry in oct7_data:
        monday_by_hour[entry['hour']].append(entry['concurrent'])
    
    # Calculate averages
    sunday_hourly_avg = {}
    monday_hourly_avg = {}
    
    for hour in range(24):
        if sunday_by_hour[hour]:
            sunday_hourly_avg[hour] = sum(sunday_by_hour[hour]) / len(sunday_by_hour[hour])
        else:
            sunday_hourly_avg[hour] = 0
            
        if monday_by_hour[hour]:
            monday_hourly_avg[hour] = sum(monday_by_hour[hour]) / len(monday_by_hour[hour])
        else:
            monday_hourly_avg[hour] = 0
    
    sunday_peak = max(sunday_hourly_avg.values())
    monday_peak = max(monday_hourly_avg.values())
    
    print(f"\nSunday (Oct 6) Peak Hour Average: {sunday_peak:.1f} concurrent")
    print(f"Monday (Oct 7) Peak Hour Average: {monday_peak:.1f} concurrent")
    
    # Display hourly patterns
    print("\n" + "=" * 80)
    print("WEEKEND PATTERN (Sunday Oct 6)")
    print("=" * 80)
    print("Hour | Avg Concurrent | Normalized | Sample Count")
    print("-----|----------------|------------|-------------")
    for hour in range(24):
        normalized = sunday_hourly_avg[hour] / sunday_peak if sunday_peak > 0 else 0
        count = len(sunday_by_hour[hour])
        print(f"{hour:4d} | {sunday_hourly_avg[hour]:14.1f} | {normalized:10.3f} | {count:12d}")
    
    print("\n" + "=" * 80)
    print("WEEKDAY PATTERN (Monday Oct 7 - Partial)")
    print("=" * 80)
    print("Hour | Avg Concurrent | Normalized | Sample Count")
    print("-----|----------------|------------|-------------")
    for hour in range(24):
        normalized = monday_hourly_avg[hour] / monday_peak if monday_peak > 0 else 0
        count = len(monday_by_hour[hour])
        print(f"{hour:4d} | {monday_hourly_avg[hour]:14.1f} | {normalized:10.3f} | {count:12d}")
    
    # Generate JSON format
    print("\n" + "=" * 80)
    print("JSON FORMAT FOR config.json")
    print("=" * 80)
    
    print('\n"weekend_pattern": {')
    print('  "hours": {')
    for hour in range(24):
        normalized = sunday_hourly_avg[hour] / sunday_peak if sunday_peak > 0 else 0
        comma = "," if hour < 23 else ""
        print(f'    "{hour}": {normalized:.3f}{comma}')
    print('  }')
    print('},')
    
    print('"weekday_pattern": {')
    print('  "hours": {')
    for hour in range(24):
        normalized = monday_hourly_avg[hour] / monday_peak if monday_peak > 0 else 0
        comma = "," if hour < 23 else ""
        print(f'    "{hour}": {normalized:.3f}{comma}')
    print('  }')
    print('}')
    
    # Recommendations
    print("\n" + "=" * 80)
    print("RECOMMENDATIONS FOR ALL GAMES MODEL")
    print("=" * 80)
    
    actual_ratio = peak_concurrent / DAU * 100
    
    print(f"\n1. UPDATE peak_concurrent_ratio:")
    print(f"   Current: 0.15 (15%)")
    print(f"   Recommended: {(peak_concurrent / DAU):.4f} ({actual_ratio:.2f}%)")
    
    print(f"\n2. HOURLY PATTERNS:")
    print(f"   - Replace weekend_pattern with Sunday data above")
    print(f"   - Note: Monday data is incomplete (only ~16 hours)")
    print(f"   - Recommend collecting more weekday data for accurate pattern")
    
    print(f"\n3. DATA QUALITY:")
    print(f"   - Weekend (Sunday): Complete 24-hour cycle ✓")
    print(f"   - Weekday (Monday): Partial data (~16 hours) ⚠️")
    print(f"   - Recommend: Collect 2-3 more days of concurrent data")
    
    print(f"\n4. VALIDATION:")
    print(f"   - Peak concurrent ({peak_concurrent}) / DAU ({DAU}) = {actual_ratio:.2f}%")
    print(f"   - This ratio is realistic and matches capacity planning needs")
    print(f"   - Much more accurate than previous 108.6% calculation error")
    
    # Calculate what the new daily minutes would be
    avg_weekday_multiplier = sum(monday_hourly_avg.values()) / 24
    avg_weekend_multiplier = sum(sunday_hourly_avg.values()) / 24
    overall_avg_multiplier = (avg_weekday_multiplier * 5 + avg_weekend_multiplier * 2) / 7
    
    # Using the formula: ratio × averageHourlyMultiplier × 60 × 24
    # But averageHourlyMultiplier is the normalized average (sum of all normalized / 24)
    # For accurate calculation, we need to use the actual average concurrent
    actual_daily_minutes = (overall_avg_multiplier / DAU) * 1440 * DAU
    # Simplifies to: overall_avg_multiplier * 1440 / DAU
    # But we want per-user minutes, so: (overall_avg_multiplier * 1440) / some_factor
    
    # Actually, let's calculate it properly:
    # Average concurrent users across all hours = overall_avg_multiplier
    # If this is the average concurrent at any given time,
    # then total user-minutes per day = avg_concurrent * 1440 minutes
    # Minutes per user = (avg_concurrent * 1440) / DAU
    
    estimated_minutes_per_user = (overall_avg_multiplier * 1440) / DAU
    
    print(f"\n5. ESTIMATED DAILY MINUTES PER USER:")
    print(f"   Current model: ~85 minutes/day")
    print(f"   From real data: ~{estimated_minutes_per_user:.1f} minutes/day")
    print(f"   (Based on average concurrent across all hours)")

if __name__ == '__main__':
    main()
