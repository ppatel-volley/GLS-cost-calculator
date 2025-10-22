// Default configuration data (business model elements removed)
// NOTE: Month 1 filters starting DAU by household percentage (only households with kids want CoComelon)
// Growth assumes all new users are CoComelon-interested (no household filtering after month 1)
const defaultConfig = {
    real_data_baseline: {
        current_dau: 4140,
        household_percentage: 0.1, // Updated from user's saved value
        peak_concurrent_ratio: 0.1
    },
    growth_assumptions: {
        monthly_growth_rate: 0.2, // Updated from user's saved value
        existing_user_retention: 0.88,
        seasonal_multipliers: {
            january: 0.95, february: 0.98, march: 1.05, april: 1.08,
            may: 1.12, june: 1.15, july: 1.18, august: 1.15,
            september: 1.08, october: 1.05, november: 1.1, december: 1.2
        }
    },
    marketing_acquisition: {
        comment: "New user acquisition patterns that marketing can control",
        new_user_monthly_targets: {
            month_1: 500,
            month_2: 1200,
            month_3: 2000,
            month_4: 2500,
            month_5: 2200,
            month_6: 2000,
            month_7: 1800,
            month_8: 1600,
            month_9: 1500,
            month_10: 1400,
            month_11: 1800,
            month_12: 2200
        },
        new_user_cocomelon_interest: 1, // Updated from user's saved value
        referral_multiplier: 1, // Updated from user's saved value
        retention_curve: {
            month_1: 0.8, // Updated from user's saved value
            month_2: 0.82,
            month_3: 0.79,
            steady_state: 0.76
        }
    },
    time_zone_patterns: {
        weekday_pattern: {
            hours: {
                "0": 0.006, "1": 0.006, "2": 0.006, "3": 0.006, "4": 0.006,
                "5": 0.01, "6": 0.05, "7": 0.25, "8": 0.3, "9": 0.05,
                "10": 0.01, "11": 0.01, "12": 0.01, "13": 0.01, "14": 0.01,
                "15": 0.35, "16": 0.5, "17": 1, "18": 1, "19": 0.6,
                "20": 0.1, "21": 0.006, "22": 0.006, "23": 0.006
            }
        },
        weekend_pattern: {
            hours: {
                "0": 0.002, "1": 0.002, "2": 0.002, "3": 0.002, "4": 0.002,
                "5": 0.002, "6": 0.01, "7": 0.15, "8": 0.35, "9": 0.5,
                "10": 0.6, "11": 0.65, "12": 0.7, "13": 0.75, "14": 0.7,
                "15": 0.65, "16": 0.7, "17": 0.75, "18": 0.7, "19": 0.55,
                "20": 0.25, "21": 0.002, "22": 0.002, "23": 0.002
            }
        }
    },

    child_usage_model: {
        enabled: true,
        comment: "Child-focused usage modeling for ages 1.5-5 years, replacing generic 10% peak concurrent ratio",

        behavioral_model: {
            age_range: "1.5_to_5_years",
            base_concurrent_ratio: 0.08, // Replaces generic 0.10 - children have different usage patterns
            attention_span_minutes: 12, // Average attention span for target age group
            session_frequency_per_day: 5, // Multiple short sessions throughout day
            parental_supervision_factor: 0.75 // 75% of usage is parent-initiated/supervised
        },

        schedule_patterns: {
            comment: "Time-based multipliers reflecting toddler/preschooler daily routines",

            weekday_routine: {
                "06:00-07:30": { multiplier: 0.02, reason: "wake_up_routine", description: "Waking up, getting dressed" },
                "07:30-09:00": { multiplier: 0.15, reason: "breakfast_distraction", description: "Breakfast time, parents need distraction" },
                "09:00-11:30": { multiplier: 0.08, reason: "preschool_hours", description: "Many children at daycare/preschool" },
                "11:30-12:30": { multiplier: 0.20, reason: "pre_lunch_fussy_time", description: "Pre-lunch energy, need entertainment" },
                "12:30-13:00": { multiplier: 0.12, reason: "lunch_distraction", description: "Lunch time entertainment" },
                "13:00-15:00": { multiplier: 0.03, reason: "nap_time", description: "Critical nap period - very low usage" },
                "15:00-17:00": { multiplier: 0.35, reason: "post_nap_peak", description: "Post-nap energy, first child peak hour" },
                "17:00-18:30": { multiplier: 0.18, reason: "dinner_prep", description: "Parents preparing dinner" },
                "18:30-20:00": { multiplier: 0.45, reason: "bedtime_routine", description: "Wind-down time, second child peak hour" },
                "20:00-06:00": { multiplier: 0.01, reason: "sleep_time", description: "Children asleep" }
            },

            weekend_routine: {
                "07:00-09:00": { multiplier: 0.08, reason: "lazy_morning", description: "Slower weekend morning routine" },
                "09:00-12:00": { multiplier: 0.25, reason: "weekend_family_time", description: "Family activities, higher engagement" },
                "12:00-13:00": { multiplier: 0.15, reason: "lunch_time", description: "Weekend lunch preparation" },
                "13:00-15:00": { multiplier: 0.05, reason: "nap_time", description: "Weekend nap period - slightly higher than weekday" },
                "15:00-18:00": { multiplier: 0.40, reason: "weekend_peak", description: "Main weekend usage period" },
                "18:00-20:00": { multiplier: 0.30, reason: "dinner_wind_down", description: "Weekend dinner and bedtime prep" },
                "20:00-07:00": { multiplier: 0.02, reason: "sleep_time", description: "Weekend sleep time" }
            }
        },

        timezone_awareness: {
            comment: "Child schedules are local-time based - nap at 1 PM local, bedtime at 7 PM local",

            local_time_calculation: true,
            timezone_distribution: {
                eastern: { percentage: 0.47, utc_offset: -5 },   // EST/EDT
                central: { percentage: 0.29, utc_offset: -6 },   // CST/CDT
                mountain: { percentage: 0.07, utc_offset: -7 },  // MST/MDT
                pacific: { percentage: 0.17, utc_offset: -8 }    // PST/PDT
            },

            peak_staggering: {
                comment: "Child peaks occur at different UTC times due to timezone differences",
                post_nap_peak: "15:00-17:00_local_time",      // 3-5 PM local becomes staggered UTC peaks
                bedtime_peak: "18:30-20:00_local_time",       // 6:30-8 PM local becomes staggered UTC peaks
                nap_time_low: "13:00-15:00_local_time"        // 1-3 PM local becomes staggered UTC lows
            }
        },

        age_cohorts: {
            comment: "Different behavioral patterns by age group within 1.5-5 year range",

            "1.5-2.5_years": {
                concurrent_ratio_adjustment: 0.6,    // 60% of base (shorter attention, more supervision)
                session_duration_minutes: 8,         // Very short sessions
                sessions_per_day: 4,                  // Fewer sessions
                parental_supervision_required: 0.90, // 90% parent-initiated
                attention_volatility: "high"         // More unpredictable usage
            },

            "2.5-3.5_years": {
                concurrent_ratio_adjustment: 1.0,    // 100% of base (baseline group)
                session_duration_minutes: 12,        // Moderate sessions
                sessions_per_day: 5,                  // Average sessions
                parental_supervision_required: 0.75, // 75% parent-initiated
                attention_volatility: "medium"       // More predictable patterns emerging
            },

            "3.5-5_years": {
                concurrent_ratio_adjustment: 1.5,    // 150% of base (longer attention, more independent)
                session_duration_minutes: 18,        // Longer sessions
                sessions_per_day: 6,                  // More frequent usage
                parental_supervision_required: 0.60, // 60% parent-initiated
                attention_volatility: "low"          // Most predictable usage patterns
            }
        },

        parental_stress_multipliers: {
            comment: "Usage spikes during times when parents need distraction tools",

            high_stress_periods: {
                dinner_prep: { multiplier: 2.0, time_windows: ["17:00-18:30"] },
                phone_calls: { multiplier: 1.7, distributed: true },
                cleaning: { multiplier: 1.4, distributed: true },
                work_calls: { multiplier: 1.8, time_windows: ["09:00-17:00"] }
            },

            low_stress_periods: {
                parent_working: { multiplier: 0.6, time_windows: ["09:00-17:00"] },
                nap_enforcement: { multiplier: 0.1, time_windows: ["13:00-15:00"] },
                bedtime_enforcement: { multiplier: 0.05, time_windows: ["20:00-06:00"] }
            }
        },

        // Built-in population assumptions (no user configuration needed)
        population_model: {
            comment: "Research-backed population-level assumptions for children ages 1.5-5",

            age_distribution: {
                "1.5-2.5_years": 0.30,    // 30% toddlers (higher supervision, shorter sessions)
                "2.5-3.5_years": 0.40,    // 40% preschoolers (baseline behavioral patterns)
                "3.5-5_years": 0.30       // 30% pre-K (more independent, longer sessions)
            },

            household_schedule_distribution: {
                daycare_routine: 0.40,     // 40% attend daycare/preschool
                stay_at_home: 0.35,        // 35% stay at home with parents
                mixed_schedule: 0.25       // 25% have mixed/flexible schedules
            },

            optimal_settings: {
                base_concurrent_ratio: 0.08,           // 8% peak concurrent for child population
                average_attention_span_minutes: 12,    // Population-weighted average
                default_nap_window: "13:00-15:00",    // Standard US toddler nap time
                primary_schedule_type: "preschooler_routine",  // Most representative schedule
                session_duration_cap_minutes: 15       // Max session length based on attention research
            },

            behavioral_weighting: {
                comment: "How different age groups contribute to overall usage patterns",
                young_toddlers_weight: 0.6,   // 1.5-2.5 years: 60% of baseline (more supervision)
                preschoolers_weight: 1.0,     // 2.5-3.5 years: 100% baseline (reference group)
                pre_k_weight: 1.5             // 3.5-5 years: 150% baseline (more independent)
            }
        }
    },

    infrastructure_specs: {
        selected_instance_type: 'gen4n_high',
        instance_types: {
            gen4n_high: {
                description: "NVIDIA T4 Tensor GPU - 4 vCPU, 8GB VRAM, 16GB RAM",
                display_name: "gen4n_high (NVIDIA T4)",
                stream_class: "gen4n_high",
                gpu: "NVIDIA T4 Tensor GPU",
                hourly_rate_per_stream: 0.50,
                pricing_region: "us-east-1 (Ohio)",
                available_from_month: 1
            },
            gen4n_ultra: {
                description: "NVIDIA T4 Tensor GPU - 8 vCPU, 16GB VRAM, 32GB RAM",
                display_name: "gen4n_ultra (NVIDIA T4)",
                stream_class: "gen4n_ultra",
                gpu: "NVIDIA T4 Tensor GPU",
                hourly_rate_per_stream: 0.93,
                pricing_region: "us-east-1 (Ohio)",
                available_from_month: 1
            },
            gen5n_high: {
                description: "NVIDIA A10G Tensor GPU - 4 vCPU, 12GB VRAM, 16GB RAM",
                display_name: "gen5n_high (NVIDIA A10G)",
                stream_class: "gen5n_high",
                gpu: "NVIDIA A10G Tensor GPU",
                hourly_rate_per_stream: 0.77,
                pricing_region: "us-east-1 (Ohio)",
                available_from_month: 1
            },
            gen5n_ultra: {
                description: "NVIDIA A10G Tensor GPU - 8 vCPU, 24GB VRAM, 32GB RAM",
                display_name: "gen5n_ultra (NVIDIA A10G)",
                stream_class: "gen5n_ultra",
                gpu: "NVIDIA A10G Tensor GPU",
                hourly_rate_per_stream: 1.45,
                pricing_region: "us-east-1 (Ohio)",
                available_from_month: 1
            }
        },
        capacity_planning: {
            always_on_percentage: 0.02,
            peak_buffer_percentage: 0.15,
            storage_cost_per_gb_month: 0.03,
            storage_gb_required: 100
        }
    }
};

// Preserve generic hourly patterns for scenarios where the child model is disabled
const genericTimePatterns = JSON.parse(JSON.stringify(defaultConfig.time_zone_patterns));

function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60) + minutes;
}

function getCoverageFraction(timeWindow, hour) {
    if (!timeWindow) {
        return 0;
    }

    const [startString, endString] = timeWindow.split('-');
    const start = timeStringToMinutes(startString);
    const end = timeStringToMinutes(endString);
    const hourStart = hour * 60;
    const hourEnd = hourStart + 60;

    const ranges = [];
    if (start < end) {
        ranges.push([start, end]);
    } else {
        ranges.push([start, 1440]);
        ranges.push([0, end]);
    }

    let overlapMinutes = 0;
    ranges.forEach(([rangeStart, rangeEnd]) => {
        const overlapStart = Math.max(rangeStart, hourStart);
        const overlapEnd = Math.min(rangeEnd, hourEnd);
        if (overlapEnd > overlapStart) {
            overlapMinutes += overlapEnd - overlapStart;
        }
    });

    return Math.max(0, Math.min(1, overlapMinutes / 60));
}

function computeScheduleMultiplier(routine, hour) {
    if (!routine) {
        return 0.01;
    }

    let weightedTotal = 0;
    let totalCoverage = 0;

    Object.entries(routine).forEach(([timeWindow, details]) => {
        const multiplier = details && details.multiplier !== undefined ? details.multiplier : 0;
        const coverage = getCoverageFraction(timeWindow, hour);
        if (coverage > 0) {
            weightedTotal += multiplier * coverage;
            totalCoverage += coverage;
        }
    });

    if (totalCoverage === 0) {
        return 0.01;
    }

    return weightedTotal / totalCoverage;
}

function computeAgeAdjustmentFactor(childModel) {
    const populationModel = childModel.population_model || {};
    const ageDistribution = populationModel.age_distribution || {};
    const ageCohorts = childModel.age_cohorts || {};
    const behavioralWeighting = populationModel.behavioral_weighting || {};

    let numerator = 0;
    let denominator = 0;

    const cohortWeightMap = {
        '1.5-2.5_years': behavioralWeighting.young_toddlers_weight,
        '2.5-3.5_years': behavioralWeighting.preschoolers_weight,
        '3.5-5_years': behavioralWeighting.pre_k_weight
    };

    Object.entries(ageDistribution).forEach(([cohortKey, share]) => {
        if (!Number.isFinite(share) || share <= 0) {
            return;
        }

        const cohortConfig = ageCohorts[cohortKey] || {};
        const cohortAdjustment = Number.isFinite(cohortConfig.concurrent_ratio_adjustment) ? cohortConfig.concurrent_ratio_adjustment : 1;
        const behaviorWeight = Number.isFinite(cohortWeightMap[cohortKey]) ? cohortWeightMap[cohortKey] : 1;

        numerator += share * cohortAdjustment * behaviorWeight;
        denominator += share * behaviorWeight;
    });

    if (denominator === 0) {
        return 1;
    }

    return numerator / denominator;
}

const householdProfileAdjustments = {
    daycare_routine: hour => {
        if (hour >= 9 && hour < 16) return 0.55;
        if (hour >= 16 && hour < 20) return 1.25;
        return 0.9;
    },
    stay_at_home: hour => {
        if (hour >= 9 && hour < 12) return 1.1;
        if (hour >= 12 && hour < 14) return 1.0;
        if (hour >= 14 && hour < 16) return 0.75;
        if (hour >= 18 && hour < 21) return 1.2;
        return 1.0;
    },
    mixed_schedule: hour => {
        if (hour >= 9 && hour < 16) return 0.85;
        if (hour >= 16 && hour < 20) return 1.15;
        return 1.0;
    }
};

function computeHouseholdScheduleFactor(populationModel, hour) {
    const distribution = populationModel.household_schedule_distribution || {};
    let weightedFactor = 0;
    let totalShare = 0;

    Object.entries(distribution).forEach(([scheduleKey, share]) => {
        if (!Number.isFinite(share) || share <= 0) {
            return;
        }

        const adjustmentFunction = householdProfileAdjustments[scheduleKey];
        const factor = adjustmentFunction ? adjustmentFunction(hour) : 1.0;
        weightedFactor += share * factor;
        totalShare += share;
    });

    if (totalShare === 0) {
        return 1.0;
    }

    return weightedFactor / totalShare;
}

function applyParentalStressMultipliers(value, multipliersConfig, hour) {
    if (!multipliersConfig) {
        return value;
    }

    let adjustedValue = value;

    const applyEntries = entries => {
        if (!entries) {
            return;
        }

        Object.values(entries).forEach(entry => {
            if (!entry || entry.multiplier === undefined) {
                return;
            }

            const multiplier = entry.multiplier;

            if (entry.time_windows && Array.isArray(entry.time_windows)) {
                entry.time_windows.forEach(window => {
                    const coverage = getCoverageFraction(window, hour);
                    if (coverage > 0) {
                        adjustedValue *= 1 + ((multiplier - 1) * coverage);
                    }
                });
            }

            if (entry.distributed) {
                // Apply a gentle distribution across the full day
                adjustedValue *= Math.pow(multiplier, 1 / 24);
            }
        });
    };

    applyEntries(multipliersConfig.high_stress_periods);
    applyEntries(multipliersConfig.low_stress_periods);

    return adjustedValue;
}

function buildChildLocalPatterns(config) {
    const childModel = config.child_usage_model;
    if (!childModel) {
        return null;
    }

    const populationModel = childModel.population_model || {};
    const ageFactor = computeAgeAdjustmentFactor(childModel);

    const computeSeriesForRoutine = routine => {
        const series = {};
        let maxValue = 0;

        for (let hour = 0; hour < 24; hour++) {
            const baseScheduleMultiplier = computeScheduleMultiplier(routine, hour);
            let value = baseScheduleMultiplier * ageFactor;
            value *= computeHouseholdScheduleFactor(populationModel, hour);
            value = applyParentalStressMultipliers(value, childModel.parental_stress_multipliers, hour);

            if (!Number.isFinite(value) || value <= 0) {
                value = 0.01;
            }

            series[hour.toString()] = value;
            maxValue = Math.max(maxValue, value);
        }

        if (maxValue <= 0) {
            Object.keys(series).forEach(hourKey => {
                series[hourKey] = 0.01;
            });
            return series;
        }

        Object.keys(series).forEach(hourKey => {
            const normalized = series[hourKey] / maxValue;
            const clamped = Math.max(0.01, normalized);
            series[hourKey] = parseFloat(clamped.toFixed(3));
        });

        return series;
    };

    const weekdayRoutine = childModel.schedule_patterns ? childModel.schedule_patterns.weekday_routine : null;
    const weekendRoutine = childModel.schedule_patterns ? childModel.schedule_patterns.weekend_routine : null;

    return {
        weekday: computeSeriesForRoutine(weekdayRoutine),
        weekend: computeSeriesForRoutine(weekendRoutine)
    };
}

function applyChildPatternsToConfig(config) {
    if (!config || !config.child_usage_model || !config.child_usage_model.enabled) {
        return;
    }

    const computedPatterns = buildChildLocalPatterns(config);
    if (!computedPatterns) {
        return;
    }

    config.child_usage_model.computed_patterns = computedPatterns;
}

function getActiveHourlyPatterns(config) {
    const childEnabled = config && config.child_usage_model && config.child_usage_model.enabled;
    const childPatterns = childEnabled && config.child_usage_model && config.child_usage_model.computed_patterns
        ? config.child_usage_model.computed_patterns
        : null;

    const weekdayPattern = childPatterns && childPatterns.weekday
        ? childPatterns.weekday
        : (config.time_zone_patterns && config.time_zone_patterns.weekday_pattern
            ? config.time_zone_patterns.weekday_pattern.hours
            : null);

    const weekendPattern = childPatterns && childPatterns.weekend
        ? childPatterns.weekend
        : (config.time_zone_patterns && config.time_zone_patterns.weekend_pattern
            ? config.time_zone_patterns.weekend_pattern.hours
            : null);

    return { weekdayPattern, weekendPattern };
}

function sumPatternValues(pattern) {
    if (!pattern) {
        return 0;
    }

    return Object.values(pattern).reduce((total, value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue) || numericValue <= 0) {
            return total;
        }
        return total + numericValue;
    }, 0);
}

function getUsagePatternStats(config) {
    const { weekdayPattern, weekendPattern } = getActiveHourlyPatterns(config);
    const weekdaySum = sumPatternValues(weekdayPattern);
    const weekendSum = sumPatternValues(weekendPattern);

    const weekdaysPerMonth = 22;
    const weekendsPerMonth = 8;
    const totalDays = weekdaysPerMonth + weekendsPerMonth;

    let weightedDailySum = 0;
    if (totalDays > 0 && (weekdaySum > 0 || weekendSum > 0)) {
        weightedDailySum = ((weekdaySum * weekdaysPerMonth) + (weekendSum * weekendsPerMonth)) / totalDays;
    }

    const averageHourlyMultiplier = weightedDailySum / 24;

    return {
        weekdayPattern,
        weekendPattern,
        weekdaySum,
        weekendSum,
        weightedDailySum,
        averageHourlyMultiplier
    };
}

function deriveMinutesFromRatio(ratio, averageHourlyMultiplier) {
    if (!Number.isFinite(ratio) || ratio <= 0) {
        return 0;
    }

    if (!Number.isFinite(averageHourlyMultiplier) || averageHourlyMultiplier <= 0) {
        return 0;
    }

    return ratio * averageHourlyMultiplier * 60 * 24;
}

function computeChildDailyMinutes(childModel) {
    if (!childModel) {
        return 0;
    }

    const populationModel = childModel.population_model || {};
    const ageDistribution = populationModel.age_distribution || {};
    const ageCohorts = childModel.age_cohorts || {};
    const optimalSettings = populationModel.optimal_settings || {};
    const durationCap = Number(optimalSettings.session_duration_cap_minutes);
    const behavioralModel = childModel.behavioral_model || {};

    const fallbackDuration = Number(behavioralModel.attention_span_minutes);
    const fallbackSessions = Number(behavioralModel.session_frequency_per_day);

    const applyCap = minutes => {
        if (!Number.isFinite(minutes) || minutes <= 0) {
            return 0;
        }
        if (Number.isFinite(durationCap) && durationCap > 0) {
            return Math.min(minutes, durationCap);
        }
        return minutes;
    };

    let totalMinutes = 0;
    let totalShare = 0;

    Object.entries(ageDistribution).forEach(([cohortKey, shareValue]) => {
        const share = Number(shareValue);
        if (!Number.isFinite(share) || share <= 0) {
            return;
        }

        const cohort = ageCohorts[cohortKey] || {};
        let sessionMinutes = Number(cohort.session_duration_minutes);
        if (!Number.isFinite(sessionMinutes) || sessionMinutes <= 0) {
            sessionMinutes = fallbackDuration;
        }

        let sessionsPerDay = Number(cohort.sessions_per_day);
        if (!Number.isFinite(sessionsPerDay) || sessionsPerDay <= 0) {
            sessionsPerDay = fallbackSessions;
        }

        sessionMinutes = applyCap(sessionMinutes);

        if (!Number.isFinite(sessionMinutes) || sessionMinutes <= 0) {
            return;
        }

        if (!Number.isFinite(sessionsPerDay) || sessionsPerDay <= 0) {
            return;
        }

        totalMinutes += share * sessionMinutes * sessionsPerDay;
        totalShare += share;
    });

    if (totalShare > 0) {
        return totalMinutes / totalShare;
    }

    const fallbackMinutes = applyCap(fallbackDuration);
    if (!Number.isFinite(fallbackMinutes) || fallbackMinutes <= 0) {
        return 0;
    }

    if (!Number.isFinite(fallbackSessions) || fallbackSessions <= 0) {
        return 0;
    }

    return fallbackMinutes * fallbackSessions;
}

function computeAverageDailyMinutesPerUser(config, usageStats) {
    const stats = usageStats || getUsagePatternStats(config);
    const dailyPatternSum = stats.weightedDailySum;

    const childEnabled = config.child_usage_model && config.child_usage_model.enabled;
    let minutesPerUser = 0;

    if (childEnabled) {
        minutesPerUser = computeChildDailyMinutes(config.child_usage_model);
    }

    if (!Number.isFinite(minutesPerUser) || minutesPerUser <= 0) {
        const fallbackRatio = childEnabled
            ? ((config.child_usage_model && config.child_usage_model.behavioral_model && config.child_usage_model.behavioral_model.base_concurrent_ratio)
                || (config.real_data_baseline && config.real_data_baseline.peak_concurrent_ratio))
            : (config.real_data_baseline && config.real_data_baseline.peak_concurrent_ratio);

        minutesPerUser = deriveMinutesFromRatio(fallbackRatio, stats.averageHourlyMultiplier);
    }

    return {
        minutesPerUser,
        usagePatternAverage: stats.averageHourlyMultiplier,
        weekdaySum: stats.weekdaySum,
        weekendSum: stats.weekendSum,
        weightedDailySum: dailyPatternSum
    };
}

const hourlyPatternInputs = {
    weekday: {},
    weekend: {}
};

const patternGraphState = {};
let patternGraphDragState = null;
let patternGraphHandlersAttached = false;

function populateInstanceTypeOptions(selectElement, infrastructureSpecs) {
    if (!selectElement || !infrastructureSpecs || !infrastructureSpecs.instance_types) {
        return;
    }

    const instanceEntries = Object.entries(infrastructureSpecs.instance_types);
    instanceEntries.sort((a, b) => {
        const nameA = (a[1].display_name || a[0] || '').toLowerCase();
        const nameB = (b[1].display_name || b[0] || '').toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    const previouslySelected = infrastructureSpecs.selected_instance_type || selectElement.value;
    selectElement.innerHTML = '';

    instanceEntries.forEach(([key, specs]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = specs.display_name || key;
        option.dataset.description = specs.description || '';
        option.dataset.ratePerStream = specs.hourly_rate_per_stream || specs.hourly_rate || '';
        option.dataset.streamClass = specs.stream_class || '';
        option.dataset.gpu = specs.gpu || '';
        option.dataset.region = specs.pricing_region || '';
        selectElement.appendChild(option);
    });

    const validSelection = instanceEntries.some(([key]) => key === previouslySelected)
        ? previouslySelected
        : (instanceEntries.length ? instanceEntries[0][0] : '');

    if (validSelection) {
        selectElement.value = validSelection;
        infrastructureSpecs.selected_instance_type = validSelection;
    }

    updateInstanceTypeDetails(selectElement.value, infrastructureSpecs);
}

function updateInstanceTypeDetails(selectedKey, infrastructureSpecs) {
    const container = document.getElementById('instance_type_details');
    if (!container) {
        return;
    }

    const instances = infrastructureSpecs && infrastructureSpecs.instance_types
        ? infrastructureSpecs.instance_types
        : null;

    const specs = instances && selectedKey ? instances[selectedKey] : null;

    if (!specs) {
        container.innerHTML = '<div class="instance-detail-line">No instance selected.</div>';
        return;
    }

    const detailLines = [];

    detailLines.push(`<div class="instance-detail-line"><strong>Description:</strong> ${escapeTooltipText(specs.description || '—')}</div>`);

    const ratePerStream = specs.hourly_rate_per_stream || specs.hourly_rate || 0;
    detailLines.push(`<div class="instance-detail-line"><strong>Cost per Stream:</strong> $${Number(ratePerStream).toFixed(4)}/hour (${escapeTooltipText(specs.pricing_region || 'region unknown')})</div>`);

    if (specs.stream_class) {
        detailLines.push(`<div class="instance-detail-line"><strong>Stream Class:</strong> ${escapeTooltipText(specs.stream_class)}</div>`);
    }
    if (specs.gpu) {
        detailLines.push(`<div class="instance-detail-line"><strong>GPU:</strong> ${escapeTooltipText(specs.gpu)}</div>`);
    }

    container.innerHTML = detailLines.join('');
}

function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.min(max, Math.max(min, value));
}

function escapeTooltipText(text) {
    if (typeof text !== 'string') {
        return '';
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDaysInMonth(month) {
    const index = (month - 1) % 12;
    return daysInEachMonth[index] || 30;
}

function calculateMonthlyStreamingMinutes(userData, month) {
    if (!userData) {
        return null;
    }

    const perUserDailyMinutes = Number(userData.expected_daily_minutes_per_user);
    const totalUsers = Number(userData.total_users);
    if (!Number.isFinite(perUserDailyMinutes) || perUserDailyMinutes <= 0) {
        return null;
    }

    if (!Number.isFinite(totalUsers) || totalUsers <= 0) {
        return null;
    }

    const days = getDaysInMonth(month);
    return perUserDailyMinutes * totalUsers * days;
}

function formatMinutesAsHoursMinutes(totalMinutes) {
    if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
        return '0h 0m';
    }

    const rounded = Math.round(totalMinutes);
    const hours = Math.floor(rounded / 60);
    const minutes = rounded % 60;
    const hoursText = hours.toLocaleString('en-US');
    return `${hoursText}h ${minutes}m`;
}

function ensurePatternGraphHandlers() {
    if (patternGraphHandlersAttached) {
        return;
    }

    window.addEventListener('pointermove', handlePatternGraphPointerMove);
    window.addEventListener('pointerup', handlePatternGraphPointerUp);
    window.addEventListener('pointercancel', handlePatternGraphPointerUp);
    patternGraphHandlersAttached = true;
}

function initializePatternGraph(patternType) {
    ensurePatternGraphHandlers();

    const container = document.getElementById(`${patternType}_graph`);
    const inputs = hourlyPatternInputs[patternType];

    if (!container || !inputs) {
        return;
    }

    const measuredWidth = Math.max(container.clientWidth || container.offsetWidth || 0, 640);
    const measuredHeight = Math.max(container.clientHeight || 0, 240);

    container.innerHTML = '';

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    const width = measuredWidth;
    const height = measuredHeight;
    const padding = 32;
    const plotWidth = Math.max(width - padding * 2, 1);
    const plotHeight = Math.max(height - padding * 2, 1);
    const step = plotWidth / 23;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const gridGroup = document.createElementNS(svgNS, 'g');
    for (let i = 0; i <= 4; i++) {
        const ratio = i / 4;
        const y = padding + ratio * plotHeight;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', padding);
        line.setAttribute('x2', width - padding);
        line.setAttribute('y1', y);
        line.setAttribute('y2', y);
        line.classList.add('graph-grid-line');
        line.setAttribute('pointer-events', 'none');
        gridGroup.appendChild(line);

        const label = document.createElementNS(svgNS, 'text');
        label.textContent = (1 - ratio).toFixed(2);
        label.setAttribute('x', padding - 12);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'end');
        label.classList.add('graph-grid-label');
        label.setAttribute('pointer-events', 'none');
        gridGroup.appendChild(label);
    }

    svg.appendChild(gridGroup);

    const labelGroup = document.createElementNS(svgNS, 'g');
    const hourLabels = [];
    for (let hour = 0; hour < 24; hour += 2) {
        const text = document.createElementNS(svgNS, 'text');
        text.textContent = formatTimeLocal(hour).replace(' Local', '');
        text.classList.add('graph-hour-label');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('pointer-events', 'none');
        labelGroup.appendChild(text);
        hourLabels.push({ hour, element: text });
    }
    svg.appendChild(labelGroup);

    const area = document.createElementNS(svgNS, 'polygon');
    area.classList.add('graph-area');
    svg.appendChild(area);

    const line = document.createElementNS(svgNS, 'polyline');
    line.classList.add('graph-line');
    svg.appendChild(line);

    const circles = [];
    const values = [];

    for (let hour = 0; hour < 24; hour++) {
        const input = inputs[hour];
        let value = 0;
        if (input) {
            value = clamp(parseFloat(input.value), 0, 1);
            input.value = value.toFixed(3);
        }
        values[hour] = value;

        const point = document.createElementNS(svgNS, 'circle');
        point.classList.add('graph-point');
        point.dataset.hour = hour.toString();
        point.setAttribute('r', '6');
        circles.push(point);
        svg.appendChild(point);
    }

    svg.addEventListener('pointerdown', event => {
        const pointerType = event.pointerType || 'mouse';
        if (pointerType === 'mouse' && event.button !== 0) {
            return;
        }
        const datasetHour = event.target && event.target.dataset ? Number(event.target.dataset.hour) : NaN;
        const forcedHour = Number.isFinite(datasetHour) ? datasetHour : undefined;
        handlePatternGraphPointerDown(patternType, event, forcedHour);
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.display = 'none';

    container.appendChild(svg);
    container.appendChild(tooltip);

    patternGraphState[patternType] = {
        svg,
        area,
        line,
        circles,
        values,
        inputs,
        width,
        height,
        padding,
        plotWidth,
        plotHeight,
        step,
        tooltip,
        hourLabels,
        activeHour: null
    };

    updatePatternGraphVisual(patternType);
}

function refreshPatternGraph(patternType) {
    const inputs = hourlyPatternInputs[patternType];
    if (!inputs) {
        return;
    }

    if (!patternGraphState[patternType]) {
        initializePatternGraph(patternType);
    }

    const state = patternGraphState[patternType];
    if (!state) {
        return;
    }

    for (let hour = 0; hour < 24; hour++) {
        const input = inputs[hour];
        if (!input) {
            continue;
        }
        let value = clamp(parseFloat(input.value), 0, 1);
        input.value = value.toFixed(3);
        state.values[hour] = value;
    }

    updatePatternGraphVisual(patternType);
}

function updatePatternGraphValue(patternType, hour, value) {
    const state = patternGraphState[patternType];
    if (!state) {
        return 0;
    }

    const normalized = clamp(value, 0, 1);
    state.values[hour] = normalized;

    const input = state.inputs ? state.inputs[hour] : null;
    if (input) {
        input.value = normalized.toFixed(3);
    }

    updatePatternGraphVisual(patternType);
    return normalized;
}

function updatePatternGraphVisual(patternType) {
    const state = patternGraphState[patternType];
    if (!state) {
        return;
    }

    const { values, area, line, circles, width, padding, plotWidth, plotHeight, hourLabels, step } = state;
    const bottomY = padding + plotHeight;
    const pointStrings = [];

    for (let hour = 0; hour < values.length; hour++) {
        const x = padding + (hour * step);
        const y = padding + (1 - values[hour]) * plotHeight;
        pointStrings.push(`${x},${y}`);
        const circle = circles[hour];
        if (circle) {
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
        }
    }

    if (line) {
        line.setAttribute('points', pointStrings.join(' '));
    }

    if (area) {
        const areaPoints = [`${padding},${bottomY}`, ...pointStrings, `${padding + plotWidth},${bottomY}`];
        area.setAttribute('points', areaPoints.join(' '));
    }

    if (hourLabels) {
        hourLabels.forEach(({ hour, element }) => {
            const x = padding + (hour * step);
            const y = bottomY + 16;
            element.setAttribute('x', x);
            element.setAttribute('y', y);
        });
    }
}

function resolvePatternGraphCoordinates(state, event) {
    const rect = state.svg.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, state.padding, state.width - state.padding);
    const y = clamp(event.clientY - rect.top, state.padding, state.height - state.padding);
    const relativeX = (x - state.padding) / state.plotWidth;
    const hourFloat = relativeX * 23;
    const normalizedValue = 1 - ((y - state.padding) / state.plotHeight);

    return {
        hourFloat,
        value: clamp(normalizedValue, 0, 1)
    };
}

function handlePatternGraphPointerDown(patternType, event, forcedHour) {
    const state = patternGraphState[patternType];
    if (!state) {
        return;
    }

    event.preventDefault();

    const coords = resolvePatternGraphCoordinates(state, event);
    const targetHour = typeof forcedHour === 'number' ? forcedHour : clamp(Math.round(coords.hourFloat), 0, 23);

    patternGraphDragState = {
        patternType,
        hour: targetHour,
        pointerId: event.pointerId
    };

    try {
        state.svg.setPointerCapture(event.pointerId);
    } catch (error) {
        // Ignore capture errors in unsupported browsers
    }

    setActiveGraphPoint(patternType, targetHour);
    const normalized = updatePatternGraphValue(patternType, targetHour, coords.value);
    showPatternGraphTooltip(patternType, targetHour, normalized);
}

function handlePatternGraphPointerMove(event) {
    if (!patternGraphDragState || patternGraphDragState.pointerId !== event.pointerId) {
        return;
    }

    const state = patternGraphState[patternGraphDragState.patternType];
    if (!state) {
        return;
    }

    const coords = resolvePatternGraphCoordinates(state, event);
    const normalized = updatePatternGraphValue(patternGraphDragState.patternType, patternGraphDragState.hour, coords.value);
    showPatternGraphTooltip(patternGraphDragState.patternType, patternGraphDragState.hour, normalized);
}

function handlePatternGraphPointerUp(event) {
    if (!patternGraphDragState || patternGraphDragState.pointerId !== event.pointerId) {
        return;
    }

    const state = patternGraphState[patternGraphDragState.patternType];
    if (state && state.svg) {
        try {
            state.svg.releasePointerCapture(event.pointerId);
        } catch (error) {
            // Ignore release errors
        }
    }

    hidePatternGraphTooltip(patternGraphDragState.patternType);
    clearActiveGraphPoint(patternGraphDragState.patternType);
    patternGraphDragState = null;
}

function setActiveGraphPoint(patternType, hour) {
    const state = patternGraphState[patternType];
    if (!state) {
        return;
    }

    if (typeof state.activeHour === 'number' && state.circles[state.activeHour]) {
        state.circles[state.activeHour].classList.remove('active');
    }

    state.activeHour = hour;
    if (state.circles[hour]) {
        state.circles[hour].classList.add('active');
    }
}

function clearActiveGraphPoint(patternType) {
    const state = patternGraphState[patternType];
    if (!state) {
        return;
    }

    if (typeof state.activeHour === 'number' && state.circles[state.activeHour]) {
        state.circles[state.activeHour].classList.remove('active');
    }
    state.activeHour = null;
}

function showPatternGraphTooltip(patternType, hour, value) {
    const state = patternGraphState[patternType];
    if (!state || !state.tooltip) {
        return;
    }

    const tooltip = state.tooltip;
    tooltip.style.display = 'block';
    const timeLabel = formatTimeLocal(hour).replace(' Local', '');
    tooltip.textContent = `${timeLabel} • ${value.toFixed(2)}`;

    const x = state.padding + (hour * state.step);
    const y = state.padding + (1 - value) * state.plotHeight;
    tooltip.style.left = `${(x / state.width) * 100}%`;
    tooltip.style.top = `${(y / state.height) * 100}%`;
}

function hidePatternGraphTooltip(patternType) {
    const state = patternGraphState[patternType];
    if (!state || !state.tooltip) {
        return;
    }

    state.tooltip.style.display = 'none';
}

let currentResults = null;
let currentMonth = 1;
let currentConfig = null;

async function loadInstanceTypesFromConfig() {
    // PERSISTENCE STRATEGY:
    // - config.json: Source of truth, NEVER modified, always loads fresh defaults
    // - localStorage: Stores user changes (survives page reload)
    // - User changes ONLY exist in localStorage, config.json remains pristine
    try {
        const response = await fetch('config.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const externalConfig = await response.json();
        if (!externalConfig) {
            return;
        }

        // Load game mode models
        if (externalConfig.game_mode) {
            defaultConfig.game_mode = externalConfig.game_mode;
        }
        if (externalConfig.cocomelon_model) {
            defaultConfig.cocomelon_model = externalConfig.cocomelon_model;
        }
        if (externalConfig.all_games_model) {
            defaultConfig.all_games_model = externalConfig.all_games_model;
        }

        const infrastructure = externalConfig.infrastructure_specs || {};
        const externalInstances = infrastructure.instance_types;

        if (externalInstances && typeof externalInstances === 'object') {
            Object.entries(externalInstances).forEach(([key, value]) => {
                defaultConfig.infrastructure_specs.instance_types[key] = Object.assign({}, value);
            });
        }

        if (typeof infrastructure.selected_instance_type === 'string' && infrastructure.selected_instance_type.length > 0) {
            defaultConfig.infrastructure_specs.selected_instance_type = infrastructure.selected_instance_type;
        }
    } catch (error) {
        console.warn('Unable to load config from config.json:', error.message);
    }
}

// Time formatting function
function formatTimeLocal(hour) {
    const timeLabels = [
        "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
        "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
        "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
        "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
    ];
    return timeLabels[hour] + " Local";
}

// Check if hour is peak time
function isPeakHour(hour, isWeekend) {
    if (isWeekend) {
        // Weekend peaks: 8 AM - 6 PM (cartoon time)
        return hour >= 8 && hour <= 18;
    } else {
        // Weekday peaks: 7-8 AM (before school), 3-7 PM (after school)
        return (hour >= 7 && hour <= 8) || (hour >= 15 && hour <= 19);
    }
}

// Initialize the interface
async function initializeInterface() {
    await loadInstanceTypesFromConfig();
    applyChildPatternsToConfig(defaultConfig);

    // First, load any saved configuration from previous session
    const hadSavedConfig = loadSavedConfig();

    loadDefaultValues();
    createHourlyPatternInputs();
    createMonthTabs();

    // Show notification if we loaded saved config
    if (hadSavedConfig) {
        showConfigLoadedNotification();
    }
}

function showConfigLoadedNotification() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.innerHTML = '📂 Loaded your saved settings from previous session';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function loadDefaultValues() {
    // Load basic values
    document.getElementById('current_dau').value = defaultConfig.real_data_baseline.current_dau;
    document.getElementById('household_percentage').value = defaultConfig.real_data_baseline.household_percentage;
    document.getElementById('peak_concurrent_ratio').value = defaultConfig.real_data_baseline.peak_concurrent_ratio;
    document.getElementById('monthly_growth_rate').value = defaultConfig.growth_assumptions.monthly_growth_rate;
    document.getElementById('user_retention_rate').value = defaultConfig.marketing_acquisition.retention_curve.month_1;

    const gameModeSelect = document.getElementById('game_mode_selector');
    if (gameModeSelect) {
        const gameMode = defaultConfig.game_mode || 'cocomelon';
        gameModeSelect.value = gameMode;
        // Trigger change event to load correct patterns
        loadPatternsForGameMode(gameMode);
    }

    // Marketing acquisition values are now fixed at 1.0 (simplified model)

    // Load monthly targets
    for (let month = 1; month <= 12; month++) {
        const targetKey = `month_${month}`;
        const targetValue = defaultConfig.marketing_acquisition.new_user_monthly_targets[targetKey];
        document.getElementById(`target_month_${month}`).value = targetValue;
    }

    // Load capacity planning
    document.getElementById('peak_buffer_percentage').value = defaultConfig.infrastructure_specs.capacity_planning.peak_buffer_percentage;
    document.getElementById('storage_gb_required').value = defaultConfig.infrastructure_specs.capacity_planning.storage_gb_required;
    document.getElementById('storage_cost_per_gb_month').value = defaultConfig.infrastructure_specs.capacity_planning.storage_cost_per_gb_month;

    const instanceSelect = document.getElementById('instance_type_select');
    if (instanceSelect) {
        populateInstanceTypeOptions(instanceSelect, defaultConfig.infrastructure_specs);
    }

    // Load timezone distribution values if they exist in config and elements exist
    if (defaultConfig.child_usage_model &&
        defaultConfig.child_usage_model.timezone_awareness &&
        defaultConfig.child_usage_model.timezone_awareness.timezone_distribution) {

        const timezoneDistribution = defaultConfig.child_usage_model.timezone_awareness.timezone_distribution;

        if (document.getElementById('timezone_eastern') && timezoneDistribution.eastern) {
            document.getElementById('timezone_eastern').value = timezoneDistribution.eastern.percentage;
        }
        if (document.getElementById('timezone_central') && timezoneDistribution.central) {
            document.getElementById('timezone_central').value = timezoneDistribution.central.percentage;
        }
        if (document.getElementById('timezone_mountain') && timezoneDistribution.mountain) {
            document.getElementById('timezone_mountain').value = timezoneDistribution.mountain.percentage;
        }
        if (document.getElementById('timezone_pacific') && timezoneDistribution.pacific) {
            document.getElementById('timezone_pacific').value = timezoneDistribution.pacific.percentage;
        }
    }

    // Update display values and set up event listeners
    updateDisplayValues();
    setupEventListeners();
}

function updateDisplayValues() {
    // Update the dynamic display spans in the Growth Logic Explanation
    const householdPercentage = parseFloat(document.getElementById('household_percentage').value) * 100;
    const retentionRate = parseFloat(document.getElementById('user_retention_rate').value) * 100;

    document.getElementById('household_display').textContent = householdPercentage.toFixed(0);
    document.getElementById('retention_display').textContent = retentionRate.toFixed(0);
}

function setupEventListeners() {
    // Add event listeners to update display values when inputs change
    document.getElementById('household_percentage').addEventListener('input', updateDisplayValues);
    document.getElementById('user_retention_rate').addEventListener('input', updateDisplayValues);

    // Add event listener for game mode toggle to update hourly patterns and UI
    const gameModeSelect = document.getElementById('game_mode_selector');
    if (gameModeSelect) {
        gameModeSelect.addEventListener('change', function() {
            const gameMode = this.value; // 'cocomelon' or 'all_games'

            // Update explanation boxes visibility
            const cocoExplanation = document.getElementById('cocomelon_explanation');
            const allGamesExplanation = document.getElementById('all_games_explanation');
            if (cocoExplanation && allGamesExplanation) {
                if (gameMode === 'cocomelon') {
                    cocoExplanation.style.display = 'block';
                    allGamesExplanation.style.display = 'none';
                } else {
                    cocoExplanation.style.display = 'none';
                    allGamesExplanation.style.display = 'block';
                }
            }

            // Load appropriate patterns from config
            loadPatternsForGameMode(gameMode);
            autoSaveConfig();
        });
    }

    const instanceSelect = document.getElementById('instance_type_select');
    if (instanceSelect) {
        instanceSelect.addEventListener('change', function() {
            const infrastructure = defaultConfig.infrastructure_specs;
            if (!infrastructure) {
                return;
            }

            infrastructure.selected_instance_type = this.value;
            updateInstanceTypeDetails(this.value, infrastructure);
            autoSaveConfig();
        });
    }
}

function createHourlyPatternInputs() {
    // Use the same local-time patterns for both models
    // These patterns represent universal local-time behavior (5 PM = 1.0 peak anywhere)
    let weekdayDefaults = defaultConfig.time_zone_patterns.weekday_pattern.hours;
    let weekendDefaults = defaultConfig.time_zone_patterns.weekend_pattern.hours;

    if (defaultConfig.child_usage_model && defaultConfig.child_usage_model.enabled && defaultConfig.child_usage_model.computed_patterns) {
        weekdayDefaults = defaultConfig.child_usage_model.computed_patterns.weekday;
        weekendDefaults = defaultConfig.child_usage_model.computed_patterns.weekend;
    }

    const weekdayContainer = document.getElementById('weekday_pattern');
    const weekendContainer = document.getElementById('weekend_pattern');

    if (!weekdayContainer || !weekendContainer) {
        return;
    }

    weekdayContainer.innerHTML = '';
    weekendContainer.innerHTML = '';

    hourlyPatternInputs.weekday = {};
    hourlyPatternInputs.weekend = {};

    for (let hour = 0; hour < 24; hour++) {
        const weekdayBlock = document.createElement('div');
        weekdayBlock.className = 'hour-block';

        const isWeekdayPeak = isPeakHour(hour, false);
        const weekdayLabelClass = isWeekdayPeak ? 'hour-label peak' : 'hour-label off-peak';
        const weekdayInputClass = isWeekdayPeak ? 'hourly-input peak' : 'hourly-input off-peak';

        const weekdayRawValue = Number(weekdayDefaults[hour.toString()]);
        const weekdaySafeValue = clamp(Number.isFinite(weekdayRawValue) ? weekdayRawValue : 0.01, 0, 1);

        weekdayBlock.innerHTML = `
            <div class="${weekdayLabelClass}">${formatTimeLocal(hour)}</div>
            <input type="number" class="${weekdayInputClass}" id="weekday_${hour}"
                   value="${weekdaySafeValue.toFixed(3)}"
                   min="0" max="1" step="0.001" title="Local time usage multiplier for ${formatTimeLocal(hour)} on weekdays">
        `;

        const weekdayInput = weekdayBlock.querySelector('input');
        hourlyPatternInputs.weekday[hour] = weekdayInput;
        weekdayInput.addEventListener('input', () => {
            let value = parseFloat(weekdayInput.value);
            value = clamp(Number.isFinite(value) ? value : 0, 0, 1);
            weekdayInput.value = value.toFixed(3);
            updatePatternGraphValue('weekday', hour, value);
        });

        weekdayContainer.appendChild(weekdayBlock);
    }

    for (let hour = 0; hour < 24; hour++) {
        const weekendBlock = document.createElement('div');
        weekendBlock.className = 'hour-block';

        const isWeekendPeak = isPeakHour(hour, true);
        const weekendLabelClass = isWeekendPeak ? 'hour-label peak' : 'hour-label off-peak';
        const weekendInputClass = isWeekendPeak ? 'hourly-input peak' : 'hourly-input off-peak';

        const weekendRawValue = Number(weekendDefaults[hour.toString()]);
        const weekendSafeValue = clamp(Number.isFinite(weekendRawValue) ? weekendRawValue : 0.01, 0, 1);

        weekendBlock.innerHTML = `
            <div class="${weekendLabelClass}">${formatTimeLocal(hour)}</div>
            <input type="number" class="${weekendInputClass}" id="weekend_${hour}"
                   value="${weekendSafeValue.toFixed(3)}"
                   min="0" max="1" step="0.001" title="Local time usage multiplier for ${formatTimeLocal(hour)} on weekends">
        `;

        const weekendInput = weekendBlock.querySelector('input');
        hourlyPatternInputs.weekend[hour] = weekendInput;
        weekendInput.addEventListener('input', () => {
            let value = parseFloat(weekendInput.value);
            value = clamp(Number.isFinite(value) ? value : 0, 0, 1);
            weekendInput.value = value.toFixed(3);
            updatePatternGraphValue('weekend', hour, value);
        });

        weekendContainer.appendChild(weekendBlock);
    }

    initializePatternGraph('weekday');
    initializePatternGraph('weekend');
}

function loadPatternsForGameMode(gameMode) {
    // Load patterns from config based on selected game mode
    let weekdayPatternValues, weekendPatternValues;

    // Safety check - ensure models are loaded
    if (!defaultConfig.cocomelon_model || !defaultConfig.all_games_model) {
        console.warn('Game mode models not yet loaded, skipping pattern load');
        return;
    }

    if (gameMode === 'cocomelon') {
        weekdayPatternValues = defaultConfig.cocomelon_model.time_zone_patterns.weekday_pattern.hours;
        weekendPatternValues = defaultConfig.cocomelon_model.time_zone_patterns.weekend_pattern.hours;
    } else if (gameMode === 'all_games') {
        weekdayPatternValues = defaultConfig.all_games_model.time_zone_patterns.weekday_pattern.hours;
        weekendPatternValues = defaultConfig.all_games_model.time_zone_patterns.weekend_pattern.hours;
    }

    // Update the hourly pattern inputs
    for (let hour = 0; hour < 24; hour++) {
        const weekdayInput = document.getElementById(`weekday_${hour}`);
        if (weekdayInput && weekdayPatternValues) {
            const value = weekdayPatternValues[hour.toString()];
            const numericValue = Number(value);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0.01;
            weekdayInput.value = safeValue.toFixed(3);
        }

        const weekendInput = document.getElementById(`weekend_${hour}`);
        if (weekendInput && weekendPatternValues) {
            const value = weekendPatternValues[hour.toString()];
            const numericValue = Number(value);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0.01;
            weekendInput.value = safeValue.toFixed(3);
        }
    }

    // Update the graphs
    initializePatternGraph('weekday');
    initializePatternGraph('weekend');
}

function updateHourlyPatternInputs(useChildModel) {
    const activeConfig = currentConfig || defaultConfig;

    if (useChildModel) {
        applyChildPatternsToConfig(activeConfig);
    }

    const childPatterns = activeConfig.child_usage_model && activeConfig.child_usage_model.computed_patterns
        ? activeConfig.child_usage_model.computed_patterns
        : null;

    const weekdayPatternValues = useChildModel && childPatterns
        ? childPatterns.weekday
        : genericTimePatterns.weekday_pattern.hours;

    const weekendPatternValues = useChildModel && childPatterns
        ? childPatterns.weekend
        : genericTimePatterns.weekend_pattern.hours;

    for (let hour = 0; hour < 24; hour++) {
        const weekdayInput = document.getElementById(`weekday_${hour}`);
        if (weekdayInput && weekdayPatternValues) {
            const value = weekdayPatternValues[hour.toString()];
            const numericValue = Number(value);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0.01;
            weekdayInput.value = safeValue.toFixed(3);
        }

        const weekendInput = document.getElementById(`weekend_${hour}`);
        if (weekendInput && weekendPatternValues) {
            const value = weekendPatternValues[hour.toString()];
            const numericValue = Number(value);
            const safeValue = Number.isFinite(numericValue) ? numericValue : 0.01;
            weekendInput.value = safeValue.toFixed(3);
        }
    }

    refreshPatternGraph('weekday');
    refreshPatternGraph('weekend');
}

function createMonthTabs() {
    const tabsContainer = document.getElementById('month_tabs');
    for (let month = 1; month <= 12; month++) {
        const button = document.createElement('button');
        button.className = 'month-tab';
        button.textContent = `M${month}`;
        button.onclick = () => selectMonth(month);
        if (month === 1) button.classList.add('active');
        tabsContainer.appendChild(button);
    }
}

function selectMonth(month) {
    currentMonth = month;

    // Update tab styling
    document.querySelectorAll('.month-tab').forEach((tab, index) => {
        tab.classList.toggle('active', index + 1 === month);
    });

    // Update results display
    if (currentResults) {
        displayResults(currentResults);
    }
}

function gatherConfiguration() {
    // Gather all form values into config structure (removed business model)
    const config = JSON.parse(JSON.stringify(defaultConfig)); // Deep clone

    const instanceSelect = document.getElementById('instance_type_select');
    if (instanceSelect) {
        config.infrastructure_specs.selected_instance_type = instanceSelect.value;
    }

    // Update basic values - read current_dau from DOM
    config.real_data_baseline.current_dau = parseInt(document.getElementById('current_dau').value);

    // Update game mode configuration
    const gameModeSelect = document.getElementById('game_mode_selector');
    const gameMode = gameModeSelect ? gameModeSelect.value : 'cocomelon';
    config.game_mode = gameMode;

    // Copy model-specific baseline configuration (peak_concurrent_ratio, household_percentage)
    const isCocomelon = (gameMode === 'cocomelon');
    const sourceModel = isCocomelon ? config.cocomelon_model : config.all_games_model;

    if (sourceModel && sourceModel.real_data_baseline) {
        config.real_data_baseline.peak_concurrent_ratio = sourceModel.real_data_baseline.peak_concurrent_ratio;
        config.real_data_baseline.household_percentage = sourceModel.real_data_baseline.household_percentage;
    }

    const childModelEnabled = isCocomelon;
    if (childModelEnabled) {
        // Apply hardcoded population-level child behavioral patterns automatically
        const populationModel = config.child_usage_model.population_model.optimal_settings;

        config.child_usage_model.behavioral_model.base_concurrent_ratio = populationModel.base_concurrent_ratio;
        config.child_usage_model.behavioral_model.attention_span_minutes = populationModel.average_attention_span_minutes;
        config.child_usage_model.behavioral_model.age_range = "2.5-3.5"; // Use balanced reference group
        config.child_usage_model.behavioral_model.schedule_type = populationModel.primary_schedule_type;
        config.child_usage_model.behavioral_model.nap_time_window = populationModel.default_nap_window;
    }

    config.growth_assumptions.monthly_growth_rate = parseFloat(document.getElementById('monthly_growth_rate').value);
    config.marketing_acquisition.retention_curve.month_1 = parseFloat(document.getElementById('user_retention_rate').value);

    // Marketing acquisition values are fixed at 1.0 (simplified model - no UI controls needed)

    // Update monthly targets
    for (let month = 1; month <= 12; month++) {
        const targetKey = `month_${month}`;
        const newValue = parseInt(document.getElementById(`target_month_${month}`).value);
        config.marketing_acquisition.new_user_monthly_targets[targetKey] = newValue;
    }

    // Update capacity planning
    config.infrastructure_specs.capacity_planning.peak_buffer_percentage = parseFloat(document.getElementById('peak_buffer_percentage').value);
    config.infrastructure_specs.capacity_planning.storage_gb_required = parseInt(document.getElementById('storage_gb_required').value);
    config.infrastructure_specs.capacity_planning.storage_cost_per_gb_month = parseFloat(document.getElementById('storage_cost_per_gb_month').value);

    const userWeekdayPattern = {};
    const userWeekendPattern = {};

    for (let hour = 0; hour < 24; hour++) {
        const weekdayValue = parseFloat(document.getElementById(`weekday_${hour}`).value);
        const weekendValue = parseFloat(document.getElementById(`weekend_${hour}`).value);
        userWeekdayPattern[hour.toString()] = weekdayValue;
        userWeekendPattern[hour.toString()] = weekendValue;
        config.time_zone_patterns.weekday_pattern.hours[hour.toString()] = weekdayValue;
        config.time_zone_patterns.weekend_pattern.hours[hour.toString()] = weekendValue;
    }

    // Update timezone distribution when child model is enabled
    if (childModelEnabled) {
        const eastern = parseFloat(document.getElementById('timezone_eastern').value) || 0.47;
        const central = parseFloat(document.getElementById('timezone_central').value) || 0.29;
        const mountain = parseFloat(document.getElementById('timezone_mountain').value) || 0.07;
        const pacific = parseFloat(document.getElementById('timezone_pacific').value) || 0.17;

        // Update timezone distribution in child usage model
        config.child_usage_model.timezone_awareness.timezone_distribution = {
            "eastern": { "percentage": eastern, "utc_offset": -5 },
            "central": { "percentage": central, "utc_offset": -6 },
            "mountain": { "percentage": mountain, "utc_offset": -7 },
            "pacific": { "percentage": pacific, "utc_offset": -8 }
        };

        applyChildPatternsToConfig(config);

        const computedPatterns = config.child_usage_model.computed_patterns || {};
        const computedWeekday = computedPatterns.weekday || {};
        const computedWeekend = computedPatterns.weekend || {};

        const normalizedWeekday = {};
        const normalizedWeekend = {};
        let maxWeekday = 0;
        let maxWeekend = 0;

        for (let hour = 0; hour < 24; hour++) {
            const key = hour.toString();
            const fallbackWeekday = Number(computedWeekday[key]) || 0.01;
            const fallbackWeekend = Number(computedWeekend[key]) || 0.01;

            const userWeekday = Number(userWeekdayPattern[key]);
            const userWeekend = Number(userWeekendPattern[key]);

            const chosenWeekday = Number.isFinite(userWeekday) && userWeekday > 0 ? userWeekday : fallbackWeekday;
            const chosenWeekend = Number.isFinite(userWeekend) && userWeekend > 0 ? userWeekend : fallbackWeekend;

            normalizedWeekday[key] = chosenWeekday;
            normalizedWeekend[key] = chosenWeekend;

            maxWeekday = Math.max(maxWeekday, chosenWeekday);
            maxWeekend = Math.max(maxWeekend, chosenWeekend);
        }

        const normalizeSeries = (series, fallbackSeries, maxValue) => {
            if (!Number.isFinite(maxValue) || maxValue <= 0) {
                return Object.assign({}, fallbackSeries);
            }

            const result = {};
            Object.entries(series).forEach(([hourKey, value]) => {
                const numericValue = Number(value);
                const normalized = numericValue / maxValue;
                const safeValue = Number.isFinite(normalized) && normalized > 0 ? normalized : (fallbackSeries[hourKey] || 0.01);
                result[hourKey] = parseFloat(safeValue.toFixed(3));
            });
            return result;
        };

        config.time_zone_patterns.weekday_pattern.hours = normalizeSeries(normalizedWeekday, computedWeekday, maxWeekday);
        config.time_zone_patterns.weekend_pattern.hours = normalizeSeries(normalizedWeekend, computedWeekend, maxWeekend);
    }

    // Update ability to persist selected instance type
    if (config.infrastructure_specs && typeof config.infrastructure_specs.selected_instance_type !== 'string') {
        config.infrastructure_specs.selected_instance_type = 'gen4n_mid';
    }

    return config;
}

function calculateResults() {
    try {
        const config = gatherConfiguration();

        // Save user changes to localStorage only (config.json remains pristine)
        saveConfigToLocalStorage(config);

        const results = runCalculations(config);
        currentConfig = config;
        currentResults = results;
        displayResults(results);
    } catch (error) {
        document.getElementById('results_content').innerHTML =
            `<div class="error">Calculation Error: ${error.message}</div>`;
    }
}

function saveConfigToLocalStorage(config) {
    try {
        // IMPORTANT: config.json file remains pristine and is never modified
        // User changes are ONLY saved to browser localStorage for session persistence
        localStorage.setItem('cocomelon-calculator-config', JSON.stringify(config));

        // Update the in-memory defaultConfig so current session uses new values
        Object.assign(defaultConfig, config);

        console.log('💾 Settings saved to browser localStorage (config.json remains unchanged).');

    } catch (error) {
        console.warn('Could not save settings to localStorage:', error.message);
    }
}


function autoSaveConfig() {
    try {
        // Lightweight auto-save for immediate settings changes
        const currentConfig = JSON.parse(JSON.stringify(defaultConfig)); // Start with current config

        // Update basic values that might have changed
        if (document.getElementById('current_dau')) {
            currentConfig.real_data_baseline.current_dau = parseInt(document.getElementById('current_dau').value);
        }
        if (document.getElementById('user_retention_rate')) {
            currentConfig.marketing_acquisition.retention_curve.month_1 = parseFloat(document.getElementById('user_retention_rate').value);
        }

        // Update game mode settings
        const gameModeSelect = document.getElementById('game_mode_selector');
        const gameMode = gameModeSelect ? gameModeSelect.value : 'cocomelon';
        currentConfig.game_mode = gameMode;

        // Copy model-specific baseline configuration
        const childModelEnabled = (gameMode === 'cocomelon');
        const sourceModel = childModelEnabled ? currentConfig.cocomelon_model : currentConfig.all_games_model;

        if (sourceModel && sourceModel.real_data_baseline) {
            currentConfig.real_data_baseline.peak_concurrent_ratio = sourceModel.real_data_baseline.peak_concurrent_ratio;
            currentConfig.real_data_baseline.household_percentage = sourceModel.real_data_baseline.household_percentage;
        }

        currentConfig.child_usage_model.enabled = childModelEnabled;

    currentConfig.infrastructure_specs.selected_instance_type = defaultConfig.infrastructure_specs.selected_instance_type;

        if (childModelEnabled) {
            // Apply hardcoded population-level settings automatically (no user configuration)
            const populationModel = currentConfig.child_usage_model.population_model.optimal_settings;

            currentConfig.child_usage_model.behavioral_model.base_concurrent_ratio = populationModel.base_concurrent_ratio;
            currentConfig.child_usage_model.behavioral_model.attention_span_minutes = populationModel.average_attention_span_minutes;
            currentConfig.child_usage_model.behavioral_model.age_range = "2.5-3.5"; // Balanced reference group
            currentConfig.child_usage_model.behavioral_model.schedule_type = populationModel.primary_schedule_type;
            currentConfig.child_usage_model.behavioral_model.nap_time_window = populationModel.default_nap_window;

            // Save timezone distribution settings if inputs exist
            if (document.getElementById('timezone_eastern')) {
                const eastern = parseFloat(document.getElementById('timezone_eastern').value) || 0.47;
                const central = parseFloat(document.getElementById('timezone_central').value) || 0.29;
                const mountain = parseFloat(document.getElementById('timezone_mountain').value) || 0.07;
                const pacific = parseFloat(document.getElementById('timezone_pacific').value) || 0.17;

                currentConfig.child_usage_model.timezone_awareness.timezone_distribution = {
                    "eastern": { "percentage": eastern, "utc_offset": -5 },
                    "central": { "percentage": central, "utc_offset": -6 },
                    "mountain": { "percentage": mountain, "utc_offset": -7 },
                    "pacific": { "percentage": pacific, "utc_offset": -8 }
                };
            }

            applyChildPatternsToConfig(currentConfig);
        }

        // Save to localStorage
        localStorage.setItem('cocomelon-calculator-config', JSON.stringify(currentConfig));

        // Update in-memory config
        Object.assign(defaultConfig, currentConfig);

        // Update dynamic display elements
        updateDynamicDisplays(currentConfig);

        console.log('💾 Settings auto-saved');

        return true;
    } catch (error) {
        console.warn('Auto-save failed:', error.message);
        return false;
    }
}

function updateDynamicDisplays(config) {
    // Update household percentage display
    const householdDisplay = document.getElementById('household_display');
    if (householdDisplay) {
        householdDisplay.textContent = Math.round(config.real_data_baseline.household_percentage * 100);
    }

    // Update retention display
    const retentionDisplay = document.getElementById('retention_display');
    if (retentionDisplay) {
        retentionDisplay.textContent = Math.round(config.marketing_acquisition.retention_curve.month_1 * 100);
    }

    const instanceSelect = document.getElementById('instance_type_select');
    if (instanceSelect) {
        populateInstanceTypeOptions(instanceSelect, config.infrastructure_specs);
    }
}

function loadSavedConfig() {
    try {
        const savedConfig = localStorage.getItem('cocomelon-calculator-config');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            const externalInstanceTypes = defaultConfig.infrastructure_specs
                ? defaultConfig.infrastructure_specs.instance_types
                : null;

            // Merge saved config with default config
            Object.assign(defaultConfig, parsedConfig);

            if (!defaultConfig.infrastructure_specs) {
                defaultConfig.infrastructure_specs = {};
            }

            if (externalInstanceTypes) {
                defaultConfig.infrastructure_specs.instance_types = externalInstanceTypes;
            }

            if (parsedConfig.infrastructure_specs && typeof parsedConfig.infrastructure_specs.selected_instance_type === 'string') {
                defaultConfig.infrastructure_specs.selected_instance_type = parsedConfig.infrastructure_specs.selected_instance_type;
            }

            if (parsedConfig.time_zone_patterns && parsedConfig.time_zone_patterns.weekday_pattern && parsedConfig.time_zone_patterns.weekday_pattern.hours) {
                genericTimePatterns.weekday_pattern.hours = Object.assign({}, parsedConfig.time_zone_patterns.weekday_pattern.hours);
            }
            if (parsedConfig.time_zone_patterns && parsedConfig.time_zone_patterns.weekend_pattern && parsedConfig.time_zone_patterns.weekend_pattern.hours) {
                genericTimePatterns.weekend_pattern.hours = Object.assign({}, parsedConfig.time_zone_patterns.weekend_pattern.hours);
            }
            applyChildPatternsToConfig(defaultConfig);

            console.log('📂 Loaded saved configuration from previous session');
            return true;
        }
    } catch (error) {
        console.warn('Could not load saved config:', error.message);
    }
    return false;
}

function runCalculations(config) {
    // JavaScript implementation of the calculator logic (removed business model calculations)
    const results = {};

    if (config && config.infrastructure_specs && config.infrastructure_specs.selected_instance_type) {
        defaultConfig.infrastructure_specs.selected_instance_type = config.infrastructure_specs.selected_instance_type;
    }

    // Calculate monthly users
    const monthlyUsers = calculateMonthlyUsers(config);

    // Calculate costs for each month
    for (let month = 1; month <= 12; month++) {
        const users = monthlyUsers[month];
        const costs = calculateHourlyCosts(month, users, config);

        results[month] = {
            users: users,
            costs: costs
        };
    }

    return results;
}

function getRetentionFactorForAge(age, retentionCurve, defaultRetention) {
    if (age <= 0) return 1;
    if (age === 1 && retentionCurve.month_1 !== undefined) return retentionCurve.month_1;
    if (age === 2 && retentionCurve.month_2 !== undefined) return retentionCurve.month_2;
    if (age === 3 && retentionCurve.month_3 !== undefined) return retentionCurve.month_3;
    if (retentionCurve.steady_state !== undefined) return retentionCurve.steady_state;
    return defaultRetention !== undefined ? defaultRetention : 1;
}

function applyRetentionToCohorts(cohorts, retentionCurve, defaultRetention) {
    let retainedUsers = 0;

    for (let index = cohorts.length - 1; index >= 0; index--) {
        const cohort = cohorts[index];
        cohort.age += 1;

        const retentionFactor = getRetentionFactorForAge(cohort.age, retentionCurve, defaultRetention);
        cohort.size *= retentionFactor;

        if (cohort.size < 1) {
            cohorts.splice(index, 1);
            continue;
        }

        retainedUsers += cohort.size;
    }

    return retainedUsers;
}

function calculateMonthlyUsers(config) {
    const baseline = config.real_data_baseline;
    const growth = config.growth_assumptions;
    const marketing = config.marketing_acquisition;
    const seasonalMultipliers = growth.seasonal_multipliers;

    const monthlyData = {};
    const monthNames = Object.keys(seasonalMultipliers);
    const cohorts = [];
    const retentionCurve = marketing.retention_curve || {};
    const defaultRetention = growth.existing_user_retention;

    // Detect game mode - use baseline peak_concurrent_ratio which is now set correctly by gatherConfiguration()
    const gameMode = config.game_mode || 'cocomelon';
    const childModelEnabled = (gameMode === 'cocomelon');
    const childPeakRatio = childModelEnabled
        ? (config.child_usage_model.behavioral_model.base_concurrent_ratio || baseline.peak_concurrent_ratio)
        : baseline.peak_concurrent_ratio;

    const usageStats = getUsagePatternStats(config);
    const { minutesPerUser: averageDailyMinutesPerUser, usagePatternAverage: averageHourlyMultiplier, weightedDailySum } = computeAverageDailyMinutesPerUser(config, usageStats);
    const derivedPeakRatio = (Number.isFinite(averageDailyMinutesPerUser) && averageDailyMinutesPerUser > 0 &&
        Number.isFinite(weightedDailySum) && weightedDailySum > 0)
        ? (averageDailyMinutesPerUser / (60 * weightedDailySum))
        : null;

    for (let month = 1; month <= 12; month++) {
        const targetKey = `month_${month}`;
        const marketingNewUsers = marketing.new_user_monthly_targets[targetKey] || 0;

        let retainedUsers = 0;
        let organicGrowth = 0;

        if (month > 1) {
            retainedUsers = applyRetentionToCohorts(cohorts, retentionCurve, defaultRetention);
        }

        let activeUsers = retainedUsers;

        if (month === 1) {
            const existingCocomelon = baseline.current_dau * baseline.household_percentage;
            if (existingCocomelon > 0) {
                cohorts.push({ size: existingCocomelon, age: 0, label: 'baseline_households' });
                activeUsers += existingCocomelon;
            }
        } else {
            organicGrowth = retainedUsers * growth.monthly_growth_rate;
            if (organicGrowth > 0) {
                cohorts.push({ size: organicGrowth, age: 0, label: `organic_growth_m${month}` });
                activeUsers += organicGrowth;
            }
        }

        if (marketingNewUsers > 0) {
            cohorts.push({ size: marketingNewUsers, age: 0, label: `marketing_m${month}` });
            activeUsers += marketingNewUsers;
        }

        const seasonalMonth = monthNames[(month - 1) % 12];
        const seasonalMultiplier = seasonalMultipliers[seasonalMonth] || 1;
        const adjustedUsers = activeUsers * seasonalMultiplier;

        let peakRatioForMonth = derivedPeakRatio;
        if (!Number.isFinite(peakRatioForMonth) || peakRatioForMonth <= 0) {
            peakRatioForMonth = childPeakRatio;
        }

        const peakConcurrentExact = adjustedUsers * peakRatioForMonth;

        monthlyData[month] = {
            total_users: Math.floor(adjustedUsers),
            peak_concurrent: Math.ceil(peakConcurrentExact),
            peak_concurrent_exact: peakConcurrentExact,
            peak_concurrent_ratio: peakRatioForMonth,
            seasonal_multiplier: seasonalMultiplier,
            is_month_1: month === 1,
            base_users_before_seasonal: Math.floor(activeUsers),
            retained_users: Math.floor(retainedUsers),
            expected_daily_minutes_per_user: averageDailyMinutesPerUser,
            marketing_details: {
                new_users: marketingNewUsers,
                organic_growth: Math.floor(organicGrowth)
            }
        };
    }

    return monthlyData;
}

function getOptimalInstanceType(month, config) {
    const instances = config.infrastructure_specs.instance_types;
    const selectedType = config.infrastructure_specs.selected_instance_type;

    if (selectedType && instances[selectedType]) {
        return selectedType;
    }

    const availableTypes = [];

    for (const [name, specs] of Object.entries(instances)) {
        if (month >= specs.available_from_month) {
            availableTypes.push([name, specs]);
        }
    }

    if (availableTypes.length === 0) {
        throw new Error(`No instance types available for month ${month}`);
    }

    // Choose lowest per-stream cost (most cost-efficient)
    const bestType = availableTypes.reduce((best, current) => {
        const bestRate = best[1].hourly_rate_per_stream || best[1].hourly_rate || Infinity;
        const currentRate = current[1].hourly_rate_per_stream || current[1].hourly_rate || Infinity;
        return currentRate < bestRate ? current : best;
    });

    return bestType[0];
}

// Helper function to get multiplier for a specific hour in a routine
function getMultiplierForHour(hour, routine) {
    // Find which time window this hour falls into
    for (const [timeWindow, patternData] of Object.entries(routine)) {
        const [startTime, endTime] = timeWindow.split('-');
        const [startHour] = startTime.split(':').map(Number);
        const [endHour] = endTime.split(':').map(Number);

        // Handle overnight periods (e.g., 20:00-06:00)
        if (startHour > endHour) {
            if (hour >= startHour || hour < endHour) {
                return patternData.multiplier;
            }
        } else {
            if (hour >= startHour && hour < endHour) {
                return patternData.multiplier;
            }
        }
    }

    // Default fallback if no pattern matches
    return 0.01;
}

function calculateChildUsageMultiplier(hour, isWeekend, config) {
    const childModel = config.child_usage_model;
    const patterns = childModel.schedule_patterns;
    const routineType = isWeekend ? 'weekend_routine' : 'weekday_routine';
    const routine = patterns[routineType];

    // Get timezone distribution configuration
    const timezoneAwareness = childModel.timezone_awareness;

    // If timezone awareness is disabled, use old behavior for all users in EST
    if (!timezoneAwareness || !timezoneAwareness.local_time_calculation) {
        return getMultiplierForHour(hour, routine);
    }

    const timezoneDistribution = timezoneAwareness.timezone_distribution;
    let weightedMultiplier = 0;

    // Calculate weighted average across all timezones
    for (const [, zoneData] of Object.entries(timezoneDistribution)) {
        // Convert EST hour to local time for this timezone
        // EST is UTC-5, so we need to adjust by the difference in UTC offsets
        const hourOffset = (-5) - zoneData.utc_offset; // EST(UTC-5) to target timezone
        const localHour = (hour + hourOffset + 24) % 24; // Ensure positive hour

        // Get the multiplier for this timezone's local hour
        const multiplier = getMultiplierForHour(localHour, routine);

        // Add weighted contribution to total
        weightedMultiplier += zoneData.percentage * multiplier;
    }

    return weightedMultiplier;
}

function calculateTimezoneAwareMultiplier(estHour, localTimePattern, config) {
    // Apply user's local-time patterns across all timezones
    // localTimePattern represents universal local time behavior (17:00 = 5 PM local anywhere)

    const timezoneDistribution = config.child_usage_model.timezone_awareness.timezone_distribution;
    let weightedMultiplier = 0;
    let weightTotal = 0;

    Object.values(timezoneDistribution).forEach(zoneData => {
        const weight = zoneData.percentage !== undefined ? zoneData.percentage : (zoneData.share || 0);
        const offset = zoneData.utc_offset !== undefined ? zoneData.utc_offset : (zoneData.offset || -5);
        if (!Number.isFinite(weight) || weight <= 0) {
            return;
        }

        const localHour = (estHour + ((-5) - offset) + 24) % 24;
        const multiplier = localTimePattern[localHour.toString()] || 0;

        weightedMultiplier += weight * multiplier;
        weightTotal += weight;
    });

    if (weightTotal === 0) {
        return localTimePattern[estHour.toString()] || 0;
    }

    return weightedMultiplier / weightTotal;
}

function calculateHourlyCosts(month, monthlyUsers, config) {
    const totalUsers = monthlyUsers.total_users;
    const peakConcurrent = monthlyUsers.peak_concurrent_exact !== undefined ?
        monthlyUsers.peak_concurrent_exact : monthlyUsers.peak_concurrent;

    // Get optimal instance type
    const instanceType = getOptimalInstanceType(month, config);
    const instanceSpecs = config.infrastructure_specs.instance_types[instanceType];

    // AWS GameLift Streams charges per stream, not per server
    const hourlyRatePerStream = instanceSpecs.hourly_rate_per_stream || instanceSpecs.hourly_rate || 0;
    const selectedInstanceMetadata = {
        name: instanceType,
        display_name: instanceSpecs.display_name || instanceType,
        description: instanceSpecs.description || '',
        stream_class: instanceSpecs.stream_class || instanceType,
        gpu: instanceSpecs.gpu || '',
        pricing_region: instanceSpecs.pricing_region || ''
    };

    // Always use user's hourly pattern inputs regardless of model type
    // The model type only affects what default patterns are loaded into the inputs
    // IMPORTANT: These patterns represent LOCAL TIME behavior (17:00 = 5 PM local anywhere)
    const childModelEnabled = config.child_usage_model && config.child_usage_model.enabled;
    const timezoneAware = childModelEnabled && config.child_usage_model.timezone_awareness;
    const childComputedPatterns = childModelEnabled && config.child_usage_model ? config.child_usage_model.computed_patterns : null;

    const weekdayPattern = childComputedPatterns && childComputedPatterns.weekday
        ? childComputedPatterns.weekday
        : config.time_zone_patterns.weekday_pattern.hours;

    const weekendPattern = childComputedPatterns && childComputedPatterns.weekend
        ? childComputedPatterns.weekend
        : config.time_zone_patterns.weekend_pattern.hours;

    // Calculate capacity planning
    const capacityConfig = config.infrastructure_specs.capacity_planning;
    const peakBuffer = capacityConfig.peak_buffer_percentage;
    const alwaysOnPercentage = capacityConfig.always_on_percentage || 0;
    const peakMultiplierThreshold = 0.5;

    // Baseline streams calculation - always-on capacity floor
    const baselineStreams = Math.ceil(peakConcurrent * alwaysOnPercentage);

    const hourlyCosts = {
        instance_type: instanceType,
        hourly_rate_per_stream: hourlyRatePerStream,
        weekday_hours: {},
        weekend_hours: {},
        selected_instance: selectedInstanceMetadata,
        peak_hours_info: {
            weekday_peak_hours: [],
            weekend_peak_hours: [],
            max_streams_needed: 0
        },
        baseline_streams: baselineStreams
    };

    // Calculate costs for each hour
    let weekdayDailyCost = 0;
    let weekendDailyCost = 0;
    let maxStreamsNeeded = 0;

    for (let hour = 0; hour < 24; hour++) {
        const weekdayMultiplier = timezoneAware
            ? calculateTimezoneAwareMultiplier(hour, weekdayPattern, config)
            : (weekdayPattern[hour.toString()] || 0);

        const weekdayConcurrent = peakConcurrent * (Number.isFinite(weekdayMultiplier) ? weekdayMultiplier : 0);
        let weekdayStreams = Math.max(Math.ceil(weekdayConcurrent), baselineStreams);

        const isWeekdayPeak = weekdayMultiplier >= peakMultiplierThreshold && weekdayStreams > 0;
        if (isWeekdayPeak) {
            weekdayStreams = weekdayStreams + Math.ceil(weekdayStreams * peakBuffer);
        }

        if (isWeekdayPeak) {
            hourlyCosts.peak_hours_info.weekday_peak_hours.push({
                hour: hour,
                time: formatTimeLocal(hour),
                streams: weekdayStreams,
                concurrent: Math.round(weekdayConcurrent)
            });
        }

        maxStreamsNeeded = Math.max(maxStreamsNeeded, weekdayStreams);
        const weekdayHourlyCost = weekdayStreams * hourlyRatePerStream;
        weekdayDailyCost += weekdayHourlyCost;

        hourlyCosts.weekday_hours[hour] = {
            concurrent_users: Math.round(weekdayConcurrent),
            streams_needed: weekdayStreams,
            hourly_cost: weekdayHourlyCost,
            time_local: formatTimeLocal(hour),
            multiplier: weekdayMultiplier
        };

        const weekendMultiplier = timezoneAware
            ? calculateTimezoneAwareMultiplier(hour, weekendPattern, config)
            : (weekendPattern[hour.toString()] || 0);

        const weekendConcurrent = peakConcurrent * (Number.isFinite(weekendMultiplier) ? weekendMultiplier : 0);
        let weekendStreams = Math.max(Math.ceil(weekendConcurrent), baselineStreams);

        const isWeekendPeak = weekendMultiplier >= peakMultiplierThreshold && weekendStreams > 0;
        if (isWeekendPeak) {
            weekendStreams = weekendStreams + Math.ceil(weekendStreams * peakBuffer);
        }

        if (isWeekendPeak) {
            hourlyCosts.peak_hours_info.weekend_peak_hours.push({
                hour: hour,
                time: formatTimeLocal(hour),
                streams: weekendStreams,
                concurrent: Math.round(weekendConcurrent)
            });
        }

        maxStreamsNeeded = Math.max(maxStreamsNeeded, weekendStreams);
        const weekendHourlyCost = weekendStreams * hourlyRatePerStream;
        weekendDailyCost += weekendHourlyCost;

        hourlyCosts.weekend_hours[hour] = {
            concurrent_users: Math.round(weekendConcurrent),
            streams_needed: weekendStreams,
            hourly_cost: weekendHourlyCost,
            time_local: formatTimeLocal(hour),
            multiplier: weekendMultiplier
        };
    }

    hourlyCosts.peak_hours_info.max_streams_needed = maxStreamsNeeded;

    // Calculate monthly totals
    const weekdaysPerMonth = 22;
    const weekendsPerMonth = 8;
    const monthlyCost = (weekdayDailyCost * weekdaysPerMonth) + (weekendDailyCost * weekendsPerMonth);
    const storageCost = capacityConfig.storage_cost_per_gb_month * capacityConfig.storage_gb_required;

    hourlyCosts.monthly_totals = {
        infrastructure_cost: monthlyCost,
        storage_cost: storageCost,
        total_monthly_cost: monthlyCost + storageCost,
        cost_per_user: (monthlyCost + storageCost) / totalUsers,
        weekday_daily_cost: weekdayDailyCost,
        weekend_daily_cost: weekendDailyCost
    };

    return hourlyCosts;
}

function displayResults(results) {
    const monthData = results[currentMonth];
    if (!monthData) return;

    const content = `
        <div class="results-grid">
            <div class="result-card">
                <h4>👥 User & Capacity Metrics</h4>
                <div class="metric">
                    <span class="metric-label">Total Users</span>
                    <span class="metric-value">${monthData.users.total_users.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Peak Concurrent Users</span>
                    <span class="metric-value">${monthData.users.peak_concurrent.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Max Streams Needed</span>
                    <span class="metric-value">${monthData.costs.peak_hours_info.max_streams_needed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Seasonal Multiplier</span>
                    <span class="metric-value">${monthData.users.seasonal_multiplier.toFixed(2)}x</span>
                </div>
            </div>

            <div class="result-card">
                <h4>💻 Server Configuration</h4>
                <div class="metric">
                    <span class="metric-label">Stream Class</span>
                    <span class="metric-value" data-tooltip="${escapeTooltipText(`GPU: ${monthData.costs.selected_instance.gpu}\nRegion: ${monthData.costs.selected_instance.pricing_region}`)}">${monthData.costs.selected_instance.display_name}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Cost per Stream</span>
                    <span class="metric-value">$${monthData.costs.hourly_rate_per_stream.toFixed(4)}/hour</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Always-On Streams</span>
                    <span class="metric-value">${monthData.costs.baseline_streams}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Peak Streams Needed</span>
                    <span class="metric-value">${monthData.costs.peak_hours_info.max_streams_needed}</span>
                </div>
            </div>

            <div class="result-card">
                <h4>💰 Infrastructure Costs</h4>
                <div class="metric">
                    <span class="metric-label">Daily Cost (Weekdays)</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Daily Cost (Weekends)</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Monthly Infrastructure</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.infrastructure_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Storage Cost</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.storage_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="metric">
                    <span class="metric-label"><strong>Total Monthly Cost</strong></span>
                    <span class="metric-value"><strong>$${monthData.costs.monthly_totals.total_monthly_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong></span>
                </div>
            </div>

            <div class="result-card">
                <h4>📈 Cost Efficiency</h4>
                <div class="metric">
                    <span class="metric-label">Cost per User</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.cost_per_user.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Cost per Concurrent User</span>
                    <span class="metric-value">$${(monthData.costs.monthly_totals.total_monthly_cost / monthData.users.peak_concurrent).toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Infrastructure % of Total</span>
                    <span class="metric-value">${((monthData.costs.monthly_totals.infrastructure_cost / monthData.costs.monthly_totals.total_monthly_cost) * 100).toFixed(1)}%</span>
                </div>
            </div>

            <div class="result-card revenue-analysis">
                <h4>💰 Revenue vs Infrastructure Cost</h4>
                <div class="metric">
                    <span class="metric-label">Monthly Revenue per User</span>
                    <span class="metric-value">$12.99</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Infrastructure Cost per User</span>
                    <span class="metric-value">$${monthData.costs.monthly_totals.cost_per_user.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Infrastructure % of Revenue</span>
                    <span class="metric-value">${((monthData.costs.monthly_totals.cost_per_user / 12.99) * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Gross Margin per User</span>
                    <span class="metric-value">$${(12.99 - monthData.costs.monthly_totals.cost_per_user).toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Monthly Revenue</span>
                    <span class="metric-value">$${(monthData.users.total_users * 12.99).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
            </div>
        </div>

        <div class="cost-highlight">
            <h4>💡 Key Infrastructure Insights for Month ${currentMonth}</h4>
            <div class="metric">
                <span class="metric-label">Peak weekday streams need</span>
                <span class="metric-value">${monthData.costs.peak_hours_info.max_streams_needed} streams (${monthData.costs.peak_hours_info.weekday_peak_hours.length} hours)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Peak weekend streams need</span>
                <span class="metric-value">${monthData.costs.peak_hours_info.max_streams_needed} streams (${monthData.costs.peak_hours_info.weekend_peak_hours.length} hours)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Total stream-hours per month</span>
                <span class="metric-value">${Math.round(monthData.costs.monthly_totals.infrastructure_cost / monthData.costs.hourly_rate_per_stream).toLocaleString()} hours</span>
            </div>
        </div>

        <div class="chart-container">
            <h4>📊 12-Month Trends Overview</h4>
            <div class="chart-scroll">
                <div class="chart-scroll-inner">
                    ${generateTrendsChart(results)}
                </div>
            </div>
        </div>

        <div class="chart-container">
            <h4>🧮 Calculation Methodology (Month ${currentMonth} Example)</h4>
            ${generateCalculationBreakdown(monthData, currentMonth, results)}
        </div>

        <div class="chart-container">
            <h4>📈 12-Month Infrastructure Progression</h4>
            <div class="results-grid">
                ${generateYearOverview(results)}
            </div>
        </div>

        <div class="chart-container">
            <h4>💰 12-Month Revenue Analysis ($12.99/user/month)</h4>
            ${generateRevenueAnalysis(results)}
        </div>
    `;

    document.getElementById('results_content').innerHTML = content;
}

function generateCalculationBreakdown(monthData, month, allResults) {
    const users = monthData.users;
    const costs = monthData.costs;
    const config = currentConfig || defaultConfig;
    const gameMode = config.game_mode || 'cocomelon';
    const isCocomelon = gameMode === 'cocomelon';
    const growthRatePercent = (config.growth_assumptions.monthly_growth_rate * 100).toFixed(1);
    const ratioFromUsers = Number.isFinite(users.peak_concurrent_ratio)
        ? users.peak_concurrent_ratio
        : (users.total_users > 0 && Number.isFinite(users.peak_concurrent_exact)
            ? users.peak_concurrent_exact / users.total_users
            : 0);
    const peakRatioPercent = Number.isFinite(ratioFromUsers) && ratioFromUsers > 0
        ? (ratioFromUsers * 100).toFixed(1)
        : '0.0';
    const perUserMinutes = Number.isFinite(users.expected_daily_minutes_per_user)
        ? users.expected_daily_minutes_per_user
        : null;

    // Load timezone info for both game modes
    let timezoneSummary = '';
    const modelConfig = isCocomelon ? config.cocomelon_model : config.all_games_model;
    if (modelConfig && modelConfig.time_zone_patterns && modelConfig.time_zone_patterns.timezone_distribution) {
        const distribution = modelConfig.time_zone_patterns.timezone_distribution;
        const parts = Object.entries(distribution).map(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            const weight = value.percentage !== undefined ? value.percentage : (value.share || 0);
            return `${label} ${(weight * 100).toFixed(0)}%`;
        });
        timezoneSummary = parts.length ? parts.join(', ') : '';
    }

    // Find a peak hour for example calculation
    const peakHour = Object.keys(costs.weekday_hours).find(hour =>
        costs.weekday_hours[hour].concurrent_users > users.peak_concurrent * 0.8
    ) || "17"; // Default to 5 PM

    const peakHourData = costs.weekday_hours[peakHour];
    const peakTime = formatTimeLocal(parseInt(peakHour));

    // Find an off-peak hour for comparison
    const offPeakHour = Object.keys(costs.weekday_hours).find(hour =>
        costs.weekday_hours[hour].concurrent_users < users.peak_concurrent * 0.1
    ) || "3"; // Default to 3 AM

    const offPeakData = costs.weekday_hours[offPeakHour];
    const offPeakTime = formatTimeLocal(parseInt(offPeakHour));

    return `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
            <h5 style="color: #155724; margin-bottom: 15px;">📋 Step-by-Step Cost Calculation</h5>

            <div style="margin-bottom: 20px;">
                <strong>Step 1: User Base & Peak Concurrent</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    ${month === 1 ?
                        (() => {
                            const baselineUsers = Math.max(users.base_users_before_seasonal - users.marketing_details.new_users, 0);
                            const userLabel = isCocomelon ? 'Household Base' : 'User Base';
                            const userUnit = isCocomelon ? 'homes' : 'users';
                            return `• Launch ${userLabel}: <strong>${Math.round(baselineUsers).toLocaleString()}</strong> ${userUnit}<br>
                                    • Launch Marketing Adds: <strong>${users.marketing_details.new_users.toLocaleString()}</strong><br>
                                    • Pre-seasonal Active Base: <strong>${users.base_users_before_seasonal.toLocaleString()}</strong><br>`;
                        })() :
                        `• Retained from Month ${month - 1}: <strong>${users.retained_users.toLocaleString()}</strong><br>
                         • Organic Growth (${growthRatePercent}% of retained): <strong>${users.marketing_details.organic_growth.toLocaleString()}</strong><br>
                         • Marketing Adds: <strong>${users.marketing_details.new_users.toLocaleString()}</strong><br>
                         • Pre-seasonal Active Base: <strong>${users.base_users_before_seasonal.toLocaleString()}</strong><br>`
                    }
                    • Seasonal Adjustment: <strong>${users.seasonal_multiplier.toFixed(2)}x</strong> → <strong>${users.total_users.toLocaleString()}</strong> active users<br>
                    ${perUserMinutes !== null ? `• Expected Playtime per User: <strong>${perUserMinutes.toFixed(0)} minutes/day</strong><br>` : ''}
                    • Peak Concurrent (~${peakRatioPercent}%): <strong>${users.peak_concurrent.toLocaleString()} users online simultaneously</strong>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 2: Stream Configuration</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Stream Class: <strong>${costs.instance_type}</strong><br>
                    • Cost per Stream: <strong>$${costs.hourly_rate_per_stream.toFixed(4)}/hour</strong><br>
                    • AWS charges per active stream, not per server
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 3: Timezone-Aware Usage Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    ${isCocomelon ?
                        `<strong>🧸 CoComelon Model - Child Streaming with Local Time Patterns:</strong><br>
                         • <strong>Pattern Logic:</strong> Hourly patterns represent LOCAL TIME behavior (6 PM = dinner time local anywhere)<br>
                         • <strong>Behavioral Inputs:</strong> Nap times, bedtime routines, age-appropriate schedules, parental supervision patterns<br>
                         ${timezoneSummary ? `• <strong>Timezone Distribution:</strong> ${timezoneSummary}<br>` : ''}
                         • <strong>Example:</strong> Peak at 6 PM local applies to 6 PM in each timezone<br>
                         • <strong>Natural Staggering:</strong> Peak usage spreads across 4 hours (6 PM Eastern → 6 PM Pacific)<br>
                         • <strong>Peak Concurrent:</strong> ${users.peak_concurrent.toLocaleString()} users online simultaneously (~8% of DAU)<br>
                         • <strong>Max Streams Needed:</strong> ${costs.peak_hours_info.max_streams_needed} streams @ $${costs.hourly_rate_per_stream.toFixed(4)}/hour per stream<br>
                         • <em>Cost savings from timezone staggering of child-focused usage patterns</em>` :
                        `<strong>🎮 All Games Model - Adult Gaming with Local Time Patterns:</strong><br>
                         • <strong>Pattern Logic:</strong> Hourly patterns represent LOCAL TIME behavior (4 PM = afternoon gaming local anywhere)<br>
                         • <strong>Behavioral Inputs:</strong> Real production data from Amplitude analytics (Sept 30 - Oct 7, 2025)<br>
                         ${timezoneSummary ? `• <strong>Timezone Distribution:</strong> ${timezoneSummary}<br>` : ''}
                         • <strong>Example:</strong> Peak at 4 PM local applies to 4 PM in each timezone<br>
                         • <strong>Natural Staggering:</strong> Peak usage spreads across 4 hours (4 PM Eastern → 4 PM Pacific)<br>
                         • <strong>Peak Concurrent:</strong> ${users.peak_concurrent.toLocaleString()} users online simultaneously (~15% of DAU)<br>
                         • <strong>Max Streams Needed:</strong> ${costs.peak_hours_info.max_streams_needed} streams @ $${costs.hourly_rate_per_stream.toFixed(4)}/hour per stream<br>
                         • <em>Cost savings from timezone staggering of adult gaming patterns with higher engagement</em>`
                    }
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 4: Hourly Demand Examples</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
                    <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #dc3545;">
                        <strong>Peak Hour (${peakTime})</strong><br>
                        • Users Online: <strong>${peakHourData.concurrent_users.toLocaleString()}</strong><br>
                        • Streams Needed: <strong>${peakHourData.streams_needed}</strong><br>
                        • Hourly Cost: <strong>$${peakHourData.hourly_cost.toFixed(0)}</strong>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #007bff;">
                        <strong>Off-Peak (${offPeakTime})</strong><br>
                        • Users Online: <strong>${offPeakData.concurrent_users.toLocaleString()}</strong><br>
                        • Streams Needed: <strong>${offPeakData.streams_needed}</strong><br>
                        • Hourly Cost: <strong>$${offPeakData.hourly_cost.toFixed(0)}</strong>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 5: Daily Cost Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Weekday Daily Cost: <strong>$${costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong> (sum of all 24 hours)<br>
                    • Weekend Daily Cost: <strong>$${costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong> (sum of all 24 hours)
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 6: Monthly Total Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Weekdays: $${costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})} × 22 days = <strong>$${(costs.monthly_totals.weekday_daily_cost * 22).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong><br>
                    • Weekends: $${costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})} × 8 days = <strong>$${(costs.monthly_totals.weekend_daily_cost * 8).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong><br>
                    • Storage: <strong>$${costs.monthly_totals.storage_cost.toFixed(0)}</strong><br>
                    • <strong>Total Monthly Cost: $${costs.monthly_totals.total_monthly_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
                </div>
            </div>
        </div>
    `;
}

function generateHourlyBreakdown(hourlyData, peakConcurrent, sessionsPerHost, hourlyRate, dayType) {
    // Show key hours with calculations for verification
    const keyHours = dayType === 'weekday'
        ? ['7', '8', '12', '15', '17', '18', '19', '3'] // School day pattern
        : ['9', '12', '13', '17', '18', '20', '3']; // Weekend pattern

    let breakdown = '';
    let totalCost = 0;

    keyHours.forEach(hour => {
        const data = hourlyData[hour];
        if (data) {
            const multiplier = data.concurrent_users / peakConcurrent;
            const servers = Math.ceil(data.concurrent_users / sessionsPerHost);
            const cost = servers * hourlyRate;
            totalCost += cost;

            breakdown += `${formatTimeLocal(parseInt(hour))}: ${data.concurrent_users.toLocaleString()} users × ${multiplier.toFixed(3)} = ${servers} servers × $${hourlyRate} = $${cost.toFixed(2)}<br>`;
        }
    });

    const remaining = Object.keys(hourlyData).length - keyHours.length;
    breakdown += `... (${remaining} more hours)<br>`;

    return breakdown;
}

function generateYearOverview(results) {
    let overview = '';
    for (let month = 1; month <= 12; month++) {
        const data = results[month];
        if (data) {
            const isCurrentMonth = month === currentMonth;
            const cardClass = 'result-card';
            const style = isCurrentMonth ? 'border-left: 4px solid #ff6b6b;' : 'border-left: 4px solid #ddd; opacity: 0.7;';
            const totalStreamingMinutes = calculateMonthlyStreamingMinutes(data.users, month);
            const totalStreamingText = totalStreamingMinutes !== null
                ? formatMinutesAsHoursMinutes(totalStreamingMinutes)
                : '—';

            const baseUsers = Number(data.users.base_users_before_seasonal) || 0;
            const seasonalMultiplier = Number(data.users.seasonal_multiplier) || 1;
            const totalUsers = Number(data.users.total_users) || 0;
            const retainedUsers = Number(data.users.retained_users) || 0;
            const marketingNew = data.users.marketing_details ? Number(data.users.marketing_details.new_users) || 0 : 0;
            const marketingOrganic = data.users.marketing_details ? Number(data.users.marketing_details.organic_growth) || 0 : 0;
            const perUserDailyMinutes = Number(data.users.expected_daily_minutes_per_user) || 0;
            const daysInMonth = getDaysInMonth(month);
            const peakConcurrent = Number(data.users.peak_concurrent) || 0;
            const peakRatio = Number(data.users.peak_concurrent_ratio);
            const ratioText = Number.isFinite(peakRatio) ? `${(peakRatio * 100).toFixed(2)}%` : 'derived';

            const hourlyRatePerStream = Number(data.costs.hourly_rate_per_stream) || 0;
            const baselineStreams = Number(data.costs.baseline_streams) || 0;
            const maxStreams = Number(data.costs.peak_hours_info.max_streams_needed) || 0;
            const rawPeakStreams = Math.ceil(peakConcurrent) || 0;

            const weekdayDailyCost = Number(data.costs.monthly_totals.weekday_daily_cost) || 0;
            const weekendDailyCost = Number(data.costs.monthly_totals.weekend_daily_cost) || 0;
            const storageCost = Number(data.costs.monthly_totals.storage_cost) || 0;
            const totalMonthlyCost = Number(data.costs.monthly_totals.total_monthly_cost) || 0;
            const costPerUser = Number(data.costs.monthly_totals.cost_per_user) || 0;

            const usersTooltip = escapeTooltipText(
                `Base active users ${baseUsers.toLocaleString()} × seasonal multiplier ${seasonalMultiplier.toFixed(2)} = ${totalUsers.toLocaleString()} total users\nRetained: ${retainedUsers.toLocaleString()} • Marketing: ${marketingNew.toLocaleString()} • Organic: ${marketingOrganic.toLocaleString()}`
            );

            const peakTooltip = escapeTooltipText(
                `${totalUsers.toLocaleString()} users × ${ratioText} peak ratio = ${peakConcurrent.toLocaleString()} concurrent users`);

            const instanceTooltip = escapeTooltipText(
                `${data.costs.instance_type}: $${hourlyRatePerStream.toFixed(4)}/hour per stream`);

            const maxStreamsTooltip = escapeTooltipText(
                `Peak concurrent users: ${peakConcurrent.toLocaleString()}\nBaseline floor: ${baselineStreams.toLocaleString()} • Final with buffer: ${maxStreams.toLocaleString()}`);

            const watchTimeTooltip = totalStreamingMinutes !== null
                ? escapeTooltipText(
                    `Per-user daily minutes ${perUserDailyMinutes.toFixed(1)} × ${daysInMonth} days × ${totalUsers.toLocaleString()} users = ${(Math.round(totalStreamingMinutes)).toLocaleString()} minutes`)
                : '';

            const monthlyCostTooltip = escapeTooltipText(
                `Weekdays: $${weekdayDailyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} × 22 = $${(weekdayDailyCost * 22).toLocaleString('en-US', { maximumFractionDigits: 0 })}\nWeekends: $${weekendDailyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} × 8 = $${(weekendDailyCost * 8).toLocaleString('en-US', { maximumFractionDigits: 0 })}\nStorage: $${storageCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}\nTotal: $${totalMonthlyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);

            const costPerUserTooltip = totalUsers > 0
                ? escapeTooltipText(`$${totalMonthlyCost.toLocaleString('en-US', { maximumFractionDigits: 0 })} ÷ ${totalUsers.toLocaleString()} users = $${costPerUser.toFixed(2)} per user`)
                : '';

            overview += `
                <div class="${cardClass}" style="${style}" onclick="selectMonth(${month})" title="Click to view Month ${month} details">
                    <h5 style="cursor: pointer;">Month ${month}</h5>
                    <div class="metric" data-tooltip="${usersTooltip}">
                        <span class="metric-label">Users</span>
                        <span class="metric-value">${data.users.total_users.toLocaleString()}</span>
                    </div>
                    <div class="metric" data-tooltip="${peakTooltip}">
                        <span class="metric-label">Peak Concurrent</span>
                        <span class="metric-value">${data.users.peak_concurrent.toLocaleString()}</span>
                    </div>
                    <div class="metric" data-tooltip="${instanceTooltip}">
                        <span class="metric-label">Stream Class</span>
                        <span class="metric-value">${data.costs.instance_type}</span>
                    </div>
                    <div class="metric" data-tooltip="${maxStreamsTooltip}">
                        <span class="metric-label">Max Streams</span>
                        <span class="metric-value">${data.costs.peak_hours_info.max_streams_needed}</span>
                    </div>
                    <div class="metric" data-tooltip="${watchTimeTooltip}">
                        <span class="metric-label">Total Watch Time</span>
                        <span class="metric-value">${totalStreamingText}</span>
                    </div>
                    <div class="metric" data-tooltip="${monthlyCostTooltip}">
                        <span class="metric-label">Monthly Cost</span>
                        <span class="metric-value">$${data.costs.monthly_totals.total_monthly_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="metric" data-tooltip="${costPerUserTooltip}">
                        <span class="metric-label">Cost/User</span>
                        <span class="metric-value">$${data.costs.monthly_totals.cost_per_user.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    }
    return overview;
}

function generateTrendsChart(results) {
    const chartWidth = 800;
    const chartHeight = 400;
    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    // Extract data for all 12 months
    const months = [];
    const users = [];
    const costs = [];
    const costPerUser = [];

    for (let month = 1; month <= 12; month++) {
        const data = results[month];
        if (data) {
            months.push(month);
            users.push(data.users.total_users);
            costs.push(data.costs.monthly_totals.total_monthly_cost);
            costPerUser.push(data.costs.monthly_totals.cost_per_user);
        }
    }

    // Find data ranges for scaling
    const maxUsers = Math.max(...users);
    const maxCost = Math.max(...costs);
    const maxCostPerUser = Math.max(...costPerUser);
    const minCostPerUser = Math.min(...costPerUser);

    // Scale functions
    const scaleX = (month) => margin.left + ((month - 1) / 11) * plotWidth;
    const scaleYUsers = (value) => margin.top + plotHeight - (value / maxUsers) * plotHeight;
    const scaleYCost = (value) => margin.top + plotHeight - (value / maxCost) * plotHeight;
    const scaleYCostPerUser = (value) => margin.top + plotHeight - ((value - minCostPerUser) / (maxCostPerUser - minCostPerUser)) * plotHeight;

    // Generate SVG paths
    const usersPath = months.map((month, i) =>
        `${i === 0 ? 'M' : 'L'} ${scaleX(month)} ${scaleYUsers(users[i])}`
    ).join(' ');

    const costsPath = months.map((month, i) =>
        `${i === 0 ? 'M' : 'L'} ${scaleX(month)} ${scaleYCost(costs[i])}`
    ).join(' ');

    const costPerUserPath = months.map((month, i) =>
        `${i === 0 ? 'M' : 'L'} ${scaleX(month)} ${scaleYCostPerUser(costPerUser[i])}`
    ).join(' ');

    // Generate grid lines and labels
    let gridLines = '';
    let xLabels = '';
    let yLabelsLeft = '';
    let yLabelsRight = '';

    // X-axis grid and labels
    for (let month = 1; month <= 12; month++) {
        const x = scaleX(month);
        gridLines += `<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${chartHeight - margin.bottom}" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>`;
        xLabels += `<text x="${x}" y="${chartHeight - margin.bottom + 20}" text-anchor="middle" font-size="12" fill="#64748b">M${month}</text>`;
    }

    // Y-axis grid and labels (Users - left side)
    for (let i = 0; i <= 5; i++) {
        const value = (maxUsers / 5) * i;
        const y = scaleYUsers(value);
        if (i > 0) {
            gridLines += `<line x1="${margin.left}" y1="${y}" x2="${chartWidth - margin.right}" y2="${y}" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>`;
        }
        yLabelsLeft += `<text x="${margin.left - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#64748b">${Math.round(value).toLocaleString()}</text>`;
    }

    // Y-axis grid and labels (Cost - right side)
    for (let i = 0; i <= 5; i++) {
        const value = (maxCost / 5) * i;
        const y = scaleYCost(value);
        yLabelsRight += `<text x="${chartWidth - margin.right + 10}" y="${y + 4}" text-anchor="start" font-size="11" fill="#64748b">$${Math.round(value / 1000)}K</text>`;
    }

    // Data points with tooltips
    let dataPoints = '';
    months.forEach((month, i) => {
        const x = scaleX(month);
        const yUsers = scaleYUsers(users[i]);
        const yCost = scaleYCost(costs[i]);
        const yCostPerUser = scaleYCostPerUser(costPerUser[i]);

        // User points (blue circles) with tooltip
        dataPoints += `
            <circle cx="${x}" cy="${yUsers}" r="4" fill="#3b82f6" stroke="white" stroke-width="2"
                    style="cursor: pointer; transition: all 0.2s ease;"
                    onmouseover="this.setAttribute('r', '6'); showTooltip(event, 'Month ${month}: ${users[i].toLocaleString()} Users')"
                    onmouseout="this.setAttribute('r', '4'); hideTooltip()"/>`;

        // Cost points (green squares) with tooltip
        dataPoints += `
            <rect x="${x-3}" y="${yCost-3}" width="6" height="6" fill="#10b981" stroke="white" stroke-width="2"
                  style="cursor: pointer; transition: all 0.2s ease;"
                  onmouseover="this.setAttribute('width', '8'); this.setAttribute('height', '8'); this.setAttribute('x', '${x-4}'); this.setAttribute('y', '${yCost-4}'); showTooltip(event, 'Month ${month}: $${Math.round(costs[i]).toLocaleString()} Monthly Cost')"
                  onmouseout="this.setAttribute('width', '6'); this.setAttribute('height', '6'); this.setAttribute('x', '${x-3}'); this.setAttribute('y', '${yCost-3}'); hideTooltip()"/>`;

        // Cost per user points (orange triangles) with tooltip
        dataPoints += `
            <polygon points="${x},${yCostPerUser-4} ${x-4},${yCostPerUser+3} ${x+4},${yCostPerUser+3}" fill="#f59e0b" stroke="white" stroke-width="2"
                     style="cursor: pointer; transition: all 0.2s ease;"
                     onmouseover="this.setAttribute('transform', 'scale(1.3) translate(${(x-x*1.3)/1.3}, ${(yCostPerUser-yCostPerUser*1.3)/1.3})'); showTooltip(event, 'Month ${month}: $${costPerUser[i].toFixed(2)} per User')"
                     onmouseout="this.setAttribute('transform', 'scale(1)'); hideTooltip()"/>`;
    });

    return `
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; min-width: ${chartWidth}px;">
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                <div style="display: flex; gap: 30px; font-size: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%;"></div>
                        <span>Total Users</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #10b981;"></div>
                        <span>Monthly Cost</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 14px solid #f59e0b;"></div>
                        <span>Cost per User</span>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: center;">
                <svg width="${chartWidth}" height="${chartHeight}" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <!-- Grid lines -->
                    ${gridLines}

                    <!-- Chart axes -->
                    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${chartHeight - margin.bottom}" stroke="#64748b" stroke-width="2"/>
                    <line x1="${margin.left}" y1="${chartHeight - margin.bottom}" x2="${chartWidth - margin.right}" y2="${chartHeight - margin.bottom}" stroke="#64748b" stroke-width="2"/>
                    <line x1="${chartWidth - margin.right}" y1="${margin.top}" x2="${chartWidth - margin.right}" y2="${chartHeight - margin.bottom}" stroke="#64748b" stroke-width="2"/>

                    <!-- Chart lines -->
                    <path d="${usersPath}" stroke="#3b82f6" stroke-width="3" fill="none" opacity="0.8"/>
                    <path d="${costsPath}" stroke="#10b981" stroke-width="3" fill="none" opacity="0.8"/>
                    <path d="${costPerUserPath}" stroke="#f59e0b" stroke-width="3" fill="none" opacity="0.8"/>

                    <!-- Data points -->
                    ${dataPoints}

                    <!-- Labels -->
                    ${xLabels}
                    ${yLabelsLeft}
                    ${yLabelsRight}

                    <!-- Axis titles -->
                    <text x="${margin.left - 50}" y="${chartHeight / 2}" text-anchor="middle" transform="rotate(-90, ${margin.left - 50}, ${chartHeight / 2})" font-size="13" font-weight="bold" fill="#374151">Total Users</text>
                    <text x="${chartWidth - margin.right + 50}" y="${chartHeight / 2}" text-anchor="middle" transform="rotate(90, ${chartWidth - margin.right + 50}, ${chartHeight / 2})" font-size="13" font-weight="bold" fill="#374151">Monthly Cost ($)</text>
                    <text x="${chartWidth / 2}" y="${chartHeight - 10}" text-anchor="middle" font-size="13" font-weight="bold" fill="#374151">Month</text>
                </svg>
            </div>

            <div style="margin-top: 15px; background: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 13px; color: #374151;">
                <strong>📈 Key Trends:</strong><br>
                • <strong>User Growth:</strong> ${users[0].toLocaleString()} → ${users[11].toLocaleString()} users (${((users[11]/users[0] - 1) * 100).toFixed(0)}% growth)<br>
                • <strong>Cost Scaling:</strong> $${Math.round(costs[0]).toLocaleString()} → $${Math.round(costs[11]).toLocaleString()} monthly (${((costs[11]/costs[0] - 1) * 100).toFixed(0)}% increase)<br>
                • <strong>Efficiency Gain:</strong> $${costPerUser[0].toFixed(2)} → $${costPerUser[11].toFixed(2)} per user (${costPerUser[11] < costPerUser[0] ? 'improved' : 'reduced'} by ${Math.abs(((costPerUser[11]/costPerUser[0] - 1) * 100)).toFixed(0)}%)<br>
                • <strong>Optimal Months:</strong> Months ${months.filter((_, i) => costPerUser[i] >= 0.90 && costPerUser[i] <= 1.10).join(', ')} achieve target $0.90-1.10 per user range
            </div>
        </div>
    `;
}

// Tooltip functions for chart interactivity
function showTooltip(event, text) {
    // Remove existing tooltip
    hideTooltip();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'chart-tooltip';
    tooltip.innerHTML = text;
    tooltip.style.cssText = `
        position: fixed;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        white-space: nowrap;
    `;

    document.body.appendChild(tooltip);

    // Position tooltip near cursor
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = (event.clientX - rect.width / 2) + 'px';
    tooltip.style.top = (event.clientY - rect.height - 10) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function generateRevenueAnalysis(results) {
    const MONTHLY_REVENUE_PER_USER = 12.99;

    let analysisTable = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 12px;">
                <thead>
                    <tr style="background: #e9ecef; border-bottom: 2px solid #28a745;">
                        <th style="padding: 8px; text-align: left; border-right: 1px solid #ddd;">Month</th>
                        <th style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">Users</th>
                        <th style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">Revenue</th>
                        <th style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">Infra Cost</th>
                        <th style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">Cost/User</th>
                        <th style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">% of Revenue</th>
                        <th style="padding: 8px; text-align: right;">Gross Margin</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let totalRevenue = 0;
    let totalInfraCost = 0;
    let totalUsers = 0;

    for (let month = 1; month <= 12; month++) {
        const data = results[month];
        if (data) {
            const users = data.users.total_users;
            const monthlyRevenue = users * MONTHLY_REVENUE_PER_USER;
            const infraCost = data.costs.monthly_totals.total_monthly_cost;
            const costPerUser = data.costs.monthly_totals.cost_per_user;
            const infraPercentage = (costPerUser / MONTHLY_REVENUE_PER_USER) * 100;
            const grossMargin = monthlyRevenue - infraCost;
            const grossMarginPercent = (grossMargin / monthlyRevenue) * 100;

            totalRevenue += monthlyRevenue;
            totalInfraCost += infraCost;
            totalUsers += users;

            // Color coding based on infrastructure percentage
            let rowStyle = '';
            if (infraPercentage <= 8) {
                rowStyle = 'background: #d4edda;'; // Green - excellent margins
            } else if (infraPercentage <= 15) {
                rowStyle = 'background: #fff3cd;'; // Yellow - good margins
            } else {
                rowStyle = 'background: #f8d7da;'; // Red - concerning margins
            }

            analysisTable += `
                <tr style="${rowStyle}">
                    <td style="padding: 8px; border-right: 1px solid #ddd; font-weight: bold;">${month}</td>
                    <td style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">${users.toLocaleString()}</td>
                    <td style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">$${monthlyRevenue.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                    <td style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">$${infraCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                    <td style="padding: 8px; text-align: right; border-right: 1px solid #ddd;">$${costPerUser.toFixed(2)}</td>
                    <td style="padding: 8px; text-align: right; border-right: 1px solid #ddd; font-weight: bold;">${infraPercentage.toFixed(1)}%</td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">$${grossMargin.toLocaleString('en-US', {maximumFractionDigits: 0})} (${grossMarginPercent.toFixed(1)}%)</td>
                </tr>
            `;
        }
    }

    // Add totals row
    const avgCostPerUser = totalInfraCost / totalUsers;
    const totalInfraPercentage = (avgCostPerUser / MONTHLY_REVENUE_PER_USER) * 100;
    const totalGrossMargin = totalRevenue - totalInfraCost;
    const totalGrossMarginPercent = (totalGrossMargin / totalRevenue) * 100;

    analysisTable += `
                </tbody>
                <tfoot>
                    <tr style="background: #343a40; color: white; font-weight: bold; border-top: 3px solid #28a745;">
                        <td style="padding: 12px; border-right: 1px solid #666;">YEAR TOTAL</td>
                        <td style="padding: 12px; text-align: right; border-right: 1px solid #666;">${(totalUsers / 12).toLocaleString('en-US', {maximumFractionDigits: 0})} avg</td>
                        <td style="padding: 12px; text-align: right; border-right: 1px solid #666;">$${totalRevenue.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                        <td style="padding: 12px; text-align: right; border-right: 1px solid #666;">$${totalInfraCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                        <td style="padding: 12px; text-align: right; border-right: 1px solid #666;">$${avgCostPerUser.toFixed(2)}</td>
                        <td style="padding: 12px; text-align: right; border-right: 1px solid #666;">${totalInfraPercentage.toFixed(1)}%</td>
                        <td style="padding: 12px; text-align: right;">$${totalGrossMargin.toLocaleString('en-US', {maximumFractionDigits: 0})} (${totalGrossMarginPercent.toFixed(1)}%)</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="results-grid" style="margin-top: 20px;">
            <div class="result-card" style="border-left: 4px solid #28a745;">
                <h5>📊 Key Revenue Insights</h5>
                <div class="metric">
                    <span class="metric-label">Average Infrastructure % of Revenue</span>
                    <span class="metric-value">${totalInfraPercentage.toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Year 1 Gross Margin</span>
                    <span class="metric-value">${totalGrossMarginPercent.toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Revenue (Year 1)</span>
                    <span class="metric-value">$${totalRevenue.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Infrastructure Cost</span>
                    <span class="metric-value">$${totalInfraCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                </div>
            </div>

            <div class="result-card" style="border-left: 4px solid #ffc107;">
                <h5>🎯 Margin Analysis</h5>
                <div style="background: #d4edda; padding: 10px; border-radius: 4px; margin: 5px 0; font-size: 0.9em;">
                    <strong>🟢 Excellent (≤8%):</strong> Months with infrastructure costs ≤8% of revenue
                </div>
                <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin: 5px 0; font-size: 0.9em;">
                    <strong>🟡 Good (8-15%):</strong> Healthy margins with room for other costs
                </div>
                <div style="background: #f8d7da; padding: 10px; border-radius: 4px; margin: 5px 0; font-size: 0.9em;">
                    <strong>🟠 Concerning (>15%):</strong> High infrastructure costs relative to revenue
                </div>
            </div>
        </div>
    `;

    return analysisTable;
}

// Initialize interface when page loads
window.onload = initializeInterface;
