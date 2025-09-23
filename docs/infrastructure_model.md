# CoComelon Infrastructure Model

This document describes how the cost calculator models user demand and converts it into AWS GameLift capacity and spend.

## 1. Monthly User Projection

1. **Baseline households (Month 1)**
   - Start from the configured Daily Active Users (`current_dau`).
   - Apply the household filter (`household_percentage`) to keep only the homes likely to stream CoComelon.
   - Add the Month 1 marketing cohort. The sum becomes the pre-seasonal active user base for launch.

2. **Cohort tracking (Months 2+)**
   - Each monthly cohort is tracked with an `age` counter. At the start of a new month every cohort ages by one.
   - The age is mapped to the retention curve:
     - Age 1 → `retention_curve.month_1`
     - Age 2 → `retention_curve.month_2`
     - Age 3 → `retention_curve.month_3`
     - Age ≥ 4 → `retention_curve.steady_state` (or `existing_user_retention` if the steady-state value is not configured).
   - Cohorts drop out when they shrink below 1 active user, keeping the model tidy.

3. **Organic growth**
   - After retention is applied we add organic growth equal to `retained_users × monthly_growth_rate`.
   - Organic growth behaves like a fresh cohort (age 0) so it will go through the retention pipeline next month.

4. **Marketing cohorts**
   - The monthly target is treated as an age-0 cohort as well.

5. **Seasonality**
   - For the month label (`january`, `february`, …) we multiply the active user base by the configured seasonal factor.
   - The result is the total active users for the month.

6. **Peak concurrency**
   - First we try to derive the ratio from the expected minutes played per user:
     - `per_user_daily_minutes` is provided by the usage model (see §2.4).
     - We multiply the weekday/weekend pattern averages to get the cumulated daily multiplier (≈number of hours the curve is “on”).
     - `peak_concurrent_ratio = per_user_daily_minutes ÷ (60 × daily_multiplier_sum)`.
   - If the usage model does not supply minutes (generic mode with no derived value) we fall back to the configured ratios:
     - Child model → `child_usage_model.behavioral_model.base_concurrent_ratio` (defaults to ~8%).
     - Generic model → `real_data_baseline.peak_concurrent_ratio` (defaults to 10%).
   - The peak concurrent value is stored with floating-point precision (for planning) and rounded up when displayed.

## 2. Hourly Behaviour Model

1. **Child-model derived local pattern** (when enabled)
   - Start with the detailed weekday / weekend schedule windows (`schedule_patterns`). Each time window contributes to the hours it overlaps; partial coverage is weighted (e.g. a 90-minute window boosts two hours proportionally).
   - Apply age-cohort adjustments: the age distribution and the cohort `concurrent_ratio_adjustment` values are blended together with the behavioural weights so longer-attention preschoolers appropriately lift the curve.
   - Blend household routines: daycare, stay-at-home, and mixed schedules each provide hour-of-day multipliers (e.g. daycare pulls down the 9 AM–4 PM block). The household distribution mixes these together.
   - Layer parental stress factors: high-stress windows multiply the affected hours; “distributed” factors (phone calls, cleaning, etc.) apply a gentle boost across the whole day, while low-stress windows dampen usage.
   - The resulting 24-value series is normalised so the hour with highest pressure becomes 1.0. The UI inputs are pre-filled with this series but teams can override individual hours; we renormalise after edits so peaks remain at 1.0.

2. **Generic hourly pattern** (child model disabled)
   - Falls back to the editable `time_zone_patterns` saved with the calculator.

3. **Timezone weighting**
   - We collect the EST/CST/MST/PST mix (either defaults or user-provided values). Shares are normalised so the total is 100%.
   - For each hour in EST we translate it into local time for the zone (`local_hour = (est_hour + offset + 24) % 24`).
   - The local multiplier is fetched from the chosen hourly pattern and the zone’s share is applied. The weighted average becomes the effective multiplier for that EST hour. This staggers peaks instead of piling every family into Eastern Time.

4. **Resulting concurrency curves**
   - The effective multiplier is multiplied by the peak concurrent users to obtain per-hour concurrency for weekdays and weekends separately.
   - We keep both the raw multiplier and the computed concurrent users for transparency in the UI.

5. **Per-user daily minutes**
   - When the child model is enabled we calculate realistic minutes from the age cohorts:
     - Each cohort supplies `session_duration_minutes` and `sessions_per_day`; durations are capped at `session_duration_cap_minutes` (15 minutes by default).
     - The cohort minutes are blended using the population distribution (30% toddlers, 40% preschoolers, 30% pre‑K by default).
     - Example with the default data: `0.3×32 + 0.4×60 + 0.3×90 = 60.6` minutes per user.
   - If the child model is disabled we do not assume a fixed number; instead, the calculator derives minutes from the selected concurrency ratio and the hourly pattern (see §1.6).

## 3. Capacity Planning

1. **Instance selection**
   - For the chosen month we inspect all instance types that are available (`available_from_month`).
   - We pick the type with the best “streams per dollar” ratio (`sessions_per_host ÷ hourly_rate`).

2. **Always-on floor**
   - We calculate a raw baseline fleet equal to `ceil(peak_concurrent × always_on_percentage ÷ sessions_per_host)`.
   - This raw value serves as the minimum number of hosts to provision before applying high availability rules. It ensures that even ultra-low periods have capacity for matchmaking, health checks, and sudden logins.

3. **Peak buffer**
   - For hours whose multiplier exceeds 0.5 we add the configured buffer: `ceil(hosts × (1 + peak_buffer_percentage))`.
   - This keeps headroom for behaviour spikes while maintaining integral host counts.

4. **High Availability (HA) Rules**
   - To ensure service stability, two rules are applied to the final host count for every hour:
     - A minimum of 2 hosts are provisioned if any activity is present.
     - The total number of hosts is rounded up to the nearest even number.
   - These rules prevent running on a single point of failure and can simplify load balancing.

5. **Final hourly host counts**
   - For each hour, the calculation follows these steps:
     1. Calculate hosts needed for concurrent users: `demand_hosts = ceil(concurrent_users ÷ sessions_per_host)`.
     2. Determine the greater of demand or the always-on floor: `pre_buffer_hosts = max(demand_hosts, always_on_hosts)`.
     3. If it's a peak hour, apply the peak buffer.
     4. Apply the High Availability rules (minimum of 2, round up to even).
   - The final host count is tracked separately for weekdays and weekends so downstream calculations can weight them by the number of days in a typical month (22 weekdays, 8 weekend days).

## 4. Cost Calculation

1. **Hourly cost**
   - Multiply hosts per hour by the instance hourly rate.

2. **Daily cost**
   - Sum the 24 hourly costs for weekdays and for weekends.

3. **Monthly infrastructure**
   - Multiply weekday costs by 22 and weekend costs by 8, then add them together.

4. **Storage**
   - Add persistent storage expenses using `storage_gb_required × storage_cost_per_gb_month`.

5. **Unit economics**
   - `cost_per_user = total_monthly_cost ÷ total_users` for the month.
   - We also compute total minutes streamed: `per_user_daily_minutes × days_in_month × total_users`. The UI renders this as hours/minutes to show aggregate play time.

## 5. Outputs & UI Highlights

- **Peak host requirement** is the max of the buffered host counts across all weekday and weekend hours.
- **Always-on servers** are surfaced in the UI so operators know the minimum fleet size.
- The monthly breakdown shows retained cohorts, organic growth, marketing adds, and the applied seasonal multiplier so planning teams can trace the numbers back to their inputs.
- Total watch time per month is shown and derived tooltips document the arithmetic for each metric so planners can audit the numbers.

## 6. Key Assumptions

- All marketing and organic users are interested in CoComelon once acquired (no additional household filtering after Month 1).
- Hourly multipliers are relative demand signals, not absolute percentages; only their shape matters because peak concurrency anchors the scale.
- When the child model is on, the hourly curve originates from the behavioural config and is renormalised after any manual tweaks so the peak stays at 1.0.
- Timezone offsets assume continental US without daylight saving adjustments (EST reference).
- The buffer threshold (0.5) is intended to capture the steeper portions of the daily curve. Adjust it before changing the multipliers if you want a different definition of “peak”.
- GameLift instance options, along with sessions-per-host and pricing, are loaded from `calculator-v2/config.json` at runtime. Updating that file lets the calculator reflect new hardware generations without code changes.

These choices aim to keep the model explainable while still responding to the behavioural inputs marketing and ops teams control.
