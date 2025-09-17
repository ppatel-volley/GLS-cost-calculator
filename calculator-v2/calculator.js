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
        instance_types: {
            gen4n_mid: {
                description: "NVIDIA T4 - Mid capacity",
                sessions_per_host: 6,
                hourly_rate: 0.77,
                available_from_month: 1
            }
        },
        capacity_planning: {
            always_on_percentage: 0.30,
            peak_buffer_percentage: 0.15,
            storage_cost_per_gb_month: 0.03,
            storage_gb_required: 100
        }
    }
};

let currentResults = null;
let currentMonth = 1;

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
function initializeInterface() {
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

    // Add event listener for child model toggle to update hourly patterns
    const childModelSelect = document.getElementById('child_model_enabled');
    if (childModelSelect) {
        childModelSelect.addEventListener('change', function() {
            const useChildModel = this.value === 'true';
            updateHourlyPatternInputs(useChildModel);
        });
    }
}

function createHourlyPatternInputs() {
    // Use the same local-time patterns for both models
    // These patterns represent universal local-time behavior (5 PM = 1.0 peak anywhere)
    let weekdayDefaults = defaultConfig.time_zone_patterns.weekday_pattern.hours;
    let weekendDefaults = defaultConfig.time_zone_patterns.weekend_pattern.hours;

    // Create weekday pattern inputs
    const weekdayContainer = document.getElementById('weekday_pattern');
    for (let hour = 0; hour < 24; hour++) {
        const div = document.createElement('div');
        div.className = 'hour-block';

        const isPeak = isPeakHour(hour, false);
        const labelClass = isPeak ? 'hour-label peak' : 'hour-label off-peak';
        const inputClass = isPeak ? 'hourly-input peak' : 'hourly-input off-peak';

        div.innerHTML = `
            <div class="${labelClass}">${formatTimeLocal(hour)}</div>
            <input type="number" class="${inputClass}" id="weekday_${hour}"
                   value="${weekdayDefaults[hour.toString()]}"
                   min="0" max="1" step="0.001" title="Local time usage multiplier for ${formatTimeLocal(hour)} on weekdays">
        `;
        weekdayContainer.appendChild(div);
    }

    // Create weekend pattern inputs
    const weekendContainer = document.getElementById('weekend_pattern');
    for (let hour = 0; hour < 24; hour++) {
        const div = document.createElement('div');
        div.className = 'hour-block';

        const isPeak = isPeakHour(hour, true);
        const labelClass = isPeak ? 'hour-label peak' : 'hour-label off-peak';
        const inputClass = isPeak ? 'hourly-input peak' : 'hourly-input off-peak';

        div.innerHTML = `
            <div class="${labelClass}">${formatTimeLocal(hour)}</div>
            <input type="number" class="${inputClass}" id="weekend_${hour}"
                   value="${weekendDefaults[hour.toString()]}"
                   min="0" max="1" step="0.001" title="Local time usage multiplier for ${formatTimeLocal(hour)} on weekends">
        `;
        weekendContainer.appendChild(div);
    }
}

function updateHourlyPatternInputs(useChildModel) {
    // Both models now use the same local-time pattern defaults
    // The model type only affects concurrent ratio (8% vs 10%) and timezone awareness

    // Update weekday pattern inputs with local-time defaults
    for (let hour = 0; hour < 24; hour++) {
        const input = document.getElementById(`weekday_${hour}`);
        if (input) {
            const newValue = defaultConfig.time_zone_patterns.weekday_pattern.hours[hour.toString()];
            input.value = newValue.toFixed(3);
        }
    }

    // Update weekend pattern inputs with local-time defaults
    for (let hour = 0; hour < 24; hour++) {
        const input = document.getElementById(`weekend_${hour}`);
        if (input) {
            const newValue = defaultConfig.time_zone_patterns.weekend_pattern.hours[hour.toString()];
            input.value = newValue.toFixed(3);
        }
    }
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

    // Update basic values
    config.real_data_baseline.current_dau = parseInt(document.getElementById('current_dau').value);
    config.real_data_baseline.household_percentage = parseFloat(document.getElementById('household_percentage').value);

    // Update child usage model configuration
    const childModelEnabled = document.getElementById('child_model_enabled').value === 'true';
    config.child_usage_model.enabled = childModelEnabled;

    if (childModelEnabled) {
        // Apply hardcoded population-level child behavioral patterns automatically
        const populationModel = config.child_usage_model.population_model.optimal_settings;

        config.child_usage_model.behavioral_model.base_concurrent_ratio = populationModel.base_concurrent_ratio;
        config.child_usage_model.behavioral_model.attention_span_minutes = populationModel.average_attention_span_minutes;
        config.child_usage_model.behavioral_model.age_range = "2.5-3.5"; // Use balanced reference group
        config.child_usage_model.behavioral_model.schedule_type = populationModel.primary_schedule_type;
        config.child_usage_model.behavioral_model.nap_time_window = populationModel.default_nap_window;

        // Set generic fallback ratio (not used when child model is enabled)
        config.real_data_baseline.peak_concurrent_ratio = 0.10;
    } else {
        // Use generic model with 10% concurrent ratio
        config.real_data_baseline.peak_concurrent_ratio = 0.10;
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

    // Update hourly patterns
    for (let hour = 0; hour < 24; hour++) {
        const weekdayValue = parseFloat(document.getElementById(`weekday_${hour}`).value);
        const weekendValue = parseFloat(document.getElementById(`weekend_${hour}`).value);
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
    }

    // Instance configuration is now fixed (gen4n_mid only)

    return config;
}

function calculateResults() {
    try {
        const config = gatherConfiguration();

        // Save user changes to config.json
        saveConfigToFile(config);

        const results = runCalculations(config);
        currentResults = results;
        displayResults(results);
    } catch (error) {
        document.getElementById('results_content').innerHTML =
            `<div class="error">Calculation Error: ${error.message}</div>`;
    }
}

function saveConfigToFile(config) {
    try {
        // Auto-save user changes to localStorage for persistence
        localStorage.setItem('cocomelon-calculator-config', JSON.stringify(config));

        // Also update the defaultConfig in memory so current session uses new values
        Object.assign(defaultConfig, config);

        console.log('💾 Config auto-saved with user changes. Will persist on page reload.');

    } catch (error) {
        console.warn('Could not save config:', error.message);
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
        if (document.getElementById('household_percentage')) {
            currentConfig.real_data_baseline.household_percentage = parseFloat(document.getElementById('household_percentage').value);
        }
        if (document.getElementById('user_retention_rate')) {
            currentConfig.marketing_acquisition.retention_curve.month_1 = parseFloat(document.getElementById('user_retention_rate').value);
        }

        // Update child model settings - simplified to just read toggle
        const childModelEnabled = document.getElementById('child_model_enabled') &&
                                 document.getElementById('child_model_enabled').value === 'true';

        currentConfig.child_usage_model.enabled = childModelEnabled;

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
        } else {
            // Generic model uses 10% concurrent ratio
            currentConfig.real_data_baseline.peak_concurrent_ratio = 0.10;
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
}

function loadSavedConfig() {
    try {
        const savedConfig = localStorage.getItem('cocomelon-calculator-config');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);

            // Merge saved config with default config
            Object.assign(defaultConfig, parsedConfig);

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

function calculateMonthlyUsers(config) {
    const baseline = config.real_data_baseline;
    const growth = config.growth_assumptions;
    const marketing = config.marketing_acquisition;
    const seasonalMultipliers = growth.seasonal_multipliers;
    
    const monthlyData = {};
    const monthNames = Object.keys(seasonalMultipliers);
    let cumulativeUsers = 0;
    
    for (let month = 1; month <= 12; month++) {
        let monthUsers;
        
        if (month === 1) {
            // Month 1: Apply household filter to starting DAU + first month's marketing targets
            const existingCocomelon = baseline.current_dau * baseline.household_percentage;
            const targetKey = `month_${month}`;
            const newUsers = marketing.new_user_monthly_targets[targetKey] || 0;
            
            monthUsers = existingCocomelon + newUsers;
            cumulativeUsers = monthUsers;
        } else {
            // Month 2+: Previous users (with churn applied) + new marketing acquisitions
            const previousMonth = monthlyData[month - 1];
            const retention = marketing.retention_curve.month_1; // Apply churn rate to all users
            const retainedUsers = previousMonth.base_users_before_seasonal * retention;
            
            const targetKey = `month_${month}`;
            const newUsers = marketing.new_user_monthly_targets[targetKey] || 0;
            
            monthUsers = retainedUsers + newUsers;
        }
        
        // Apply seasonal adjustment
        const seasonalMonth = monthNames[(month - 1) % 12];
        const seasonalMultiplier = seasonalMultipliers[seasonalMonth];
        const adjustedUsers = monthUsers * seasonalMultiplier;
        
        // Calculate concurrent users using child model if enabled
        let peakConcurrent;
        if (config.child_usage_model && config.child_usage_model.enabled) {
            // Use child model base concurrent ratio
            peakConcurrent = adjustedUsers * config.child_usage_model.behavioral_model.base_concurrent_ratio;
        } else {
            // Use generic model
            peakConcurrent = adjustedUsers * baseline.peak_concurrent_ratio;
        }
        
        monthlyData[month] = {
            total_users: Math.floor(adjustedUsers),
            peak_concurrent: Math.floor(peakConcurrent),
            seasonal_multiplier: seasonalMultiplier,
            is_month_1: month === 1,
            base_users_before_seasonal: Math.floor(monthUsers),
            marketing_details: {
                new_users: marketing.new_user_monthly_targets[`month_${month}`] || 0
            }
        };
    }
    
    return monthlyData;
}

function getOptimalInstanceType(month, config) {
    const instances = config.infrastructure_specs.instance_types;
    const availableTypes = [];
    
    for (const [name, specs] of Object.entries(instances)) {
        if (month >= specs.available_from_month) {
            availableTypes.push([name, specs]);
        }
    }
    
    if (availableTypes.length === 0) {
        throw new Error(`No instance types available for month ${month}`);
    }
    
    // Choose most cost-efficient (best sessions per dollar)
    const bestType = availableTypes.reduce((best, current) => {
        const bestEfficiency = best[1].sessions_per_host / best[1].hourly_rate;
        const currentEfficiency = current[1].sessions_per_host / current[1].hourly_rate;
        return currentEfficiency > bestEfficiency ? current : best;
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
    for (const [zoneName, zoneData] of Object.entries(timezoneDistribution)) {
        // Convert EST hour to local time for this timezone
        // EST is UTC-5, so we need to adjust by the difference in UTC offsets
        const hourOffset = zoneData.utc_offset - (-5); // Difference from EST (UTC-5)
        const localHour = (hour + hourOffset + 24) % 24; // Ensure positive hour

        // Get the multiplier for this timezone's local hour
        const multiplier = getMultiplierForHour(localHour, routine);

        // Add weighted contribution to total
        weightedMultiplier += zoneData.percentage * multiplier;
    }

    return weightedMultiplier;
}

function calculateTimezoneAwareMultiplier(estHour, isWeekend, localTimePattern, config) {
    // Apply user's local-time patterns across all timezones
    // localTimePattern represents universal local time behavior (17:00 = 5 PM local anywhere)

    const timezoneDistribution = config.child_usage_model.timezone_awareness.timezone_distribution;
    let weightedMultiplier = 0;

    // Calculate weighted average across all timezones
    for (const [zoneName, zoneData] of Object.entries(timezoneDistribution)) {
        // Convert EST hour to local time for this timezone
        const hourOffset = zoneData.utc_offset - (-5); // Difference from EST (UTC-5)
        const localHour = (estHour + hourOffset + 24) % 24; // Ensure positive hour

        // Get the multiplier for this timezone's local hour using user's pattern
        const multiplier = localTimePattern[localHour.toString()] || 0;

        // Add weighted contribution to total
        weightedMultiplier += zoneData.percentage * multiplier;
    }

    return weightedMultiplier;
}

function calculateHourlyCosts(month, monthlyUsers, config) {
    const totalUsers = monthlyUsers.total_users;
    const peakConcurrent = monthlyUsers.peak_concurrent;

    // Get optimal instance type
    const instanceType = getOptimalInstanceType(month, config);
    const instanceSpecs = config.infrastructure_specs.instance_types[instanceType];

    const sessionsPerHost = instanceSpecs.sessions_per_host;
    const hourlyRate = instanceSpecs.hourly_rate;

    // Always use user's hourly pattern inputs regardless of model type
    // The model type only affects what default patterns are loaded into the inputs
    // IMPORTANT: These patterns represent LOCAL TIME behavior (17:00 = 5 PM local anywhere)
    let weekdayPattern = config.time_zone_patterns.weekday_pattern.hours;
    let weekendPattern = config.time_zone_patterns.weekend_pattern.hours;
    
    // Calculate capacity planning
    const capacityConfig = config.infrastructure_specs.capacity_planning;
    const peakBuffer = capacityConfig.peak_buffer_percentage;
    
    const hourlyCosts = {
        instance_type: instanceType,
        sessions_per_host: sessionsPerHost,
        hourly_rate: hourlyRate,
        weekday_hours: {},
        weekend_hours: {},
        peak_hours_info: {
            weekday_peak_hours: [],
            weekend_peak_hours: [],
            max_hosts_needed: 0
        }
    };
    
    // Calculate costs for each hour
    let weekdayDailyCost = 0;
    let weekendDailyCost = 0;
    let maxHostsNeeded = 0;
    
    for (let hour = 0; hour < 24; hour++) {
        // Calculate timezone-aware multiplier for this EST hour
        let weekdayMultiplier;
        if (config.child_usage_model && config.child_usage_model.enabled && config.child_usage_model.timezone_awareness) {
            // Apply timezone-aware calculation: patterns represent LOCAL time behavior
            weekdayMultiplier = calculateTimezoneAwareMultiplier(hour, false, weekdayPattern, config);
        } else {
            // Use pattern as-is (legacy behavior for generic model)
            weekdayMultiplier = weekdayPattern[hour.toString()] || 0;
        }

        const weekdayConcurrent = peakConcurrent * weekdayMultiplier;
        let weekdayHosts = Math.max(1, Math.ceil(weekdayConcurrent / sessionsPerHost));
        // AWS requires minimum 2 servers and servers come in pairs
        weekdayHosts = Math.max(2, weekdayHosts % 2 === 0 ? weekdayHosts : weekdayHosts + 1);

        // Track peak hours for reporting (>50% usage)
        if (weekdayMultiplier > 0.5) {
            hourlyCosts.peak_hours_info.weekday_peak_hours.push({
                hour: hour,
                time: formatTimeLocal(hour),
                hosts: weekdayHosts,
                concurrent: Math.floor(weekdayConcurrent)
            });
        }

        maxHostsNeeded = Math.max(maxHostsNeeded, weekdayHosts);
        const weekdayHourlyCost = weekdayHosts * hourlyRate;
        weekdayDailyCost += weekdayHourlyCost;

        hourlyCosts.weekday_hours[hour] = {
            concurrent_users: Math.floor(weekdayConcurrent),
            hosts_needed: weekdayHosts,
            hourly_cost: weekdayHourlyCost,
            time_local: formatTimeLocal(hour)
        };

        // Calculate timezone-aware weekend multiplier for this EST hour
        let weekendMultiplier;
        if (config.child_usage_model && config.child_usage_model.enabled && config.child_usage_model.timezone_awareness) {
            // Apply timezone-aware calculation: patterns represent LOCAL time behavior
            weekendMultiplier = calculateTimezoneAwareMultiplier(hour, true, weekendPattern, config);
        } else {
            // Use pattern as-is (legacy behavior for generic model)
            weekendMultiplier = weekendPattern[hour.toString()] || 0;
        }

        const weekendConcurrent = peakConcurrent * weekendMultiplier;
        let weekendHosts = Math.max(1, Math.ceil(weekendConcurrent / sessionsPerHost));
        // AWS requires minimum 2 servers and servers come in pairs
        weekendHosts = Math.max(2, weekendHosts % 2 === 0 ? weekendHosts : weekendHosts + 1);

        // Track peak hours for reporting (>50% usage)
        if (weekendMultiplier > 0.5) {
            hourlyCosts.peak_hours_info.weekend_peak_hours.push({
                hour: hour,
                time: formatTimeLocal(hour),
                hosts: weekendHosts,
                concurrent: Math.floor(weekendConcurrent)
            });
        }

        maxHostsNeeded = Math.max(maxHostsNeeded, weekendHosts);
        const weekendHourlyCost = weekendHosts * hourlyRate;
        weekendDailyCost += weekendHourlyCost;

        hourlyCosts.weekend_hours[hour] = {
            concurrent_users: Math.floor(weekendConcurrent),
            hosts_needed: weekendHosts,
            hourly_cost: weekendHourlyCost,
            time_local: formatTimeLocal(hour)
        };
    }
    
    hourlyCosts.peak_hours_info.max_hosts_needed = maxHostsNeeded;
    
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
                    <span class="metric-label">Max Servers Needed</span>
                    <span class="metric-value">${monthData.costs.peak_hours_info.max_hosts_needed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Seasonal Multiplier</span>
                    <span class="metric-value">${monthData.users.seasonal_multiplier.toFixed(2)}x</span>
                </div>
            </div>
            
            <div class="result-card">
                <h4>💻 Server Configuration</h4>
                <div class="metric">
                    <span class="metric-label">Instance Type</span>
                    <span class="metric-value">${monthData.costs.instance_type}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Sessions per Server</span>
                    <span class="metric-value">${monthData.costs.sessions_per_host}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Hourly Rate per Server</span>
                    <span class="metric-value">$${monthData.costs.hourly_rate.toFixed(2)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Cost Efficiency</span>
                    <span class="metric-value">${(monthData.costs.sessions_per_host / monthData.costs.hourly_rate).toFixed(1)} streams/$</span>
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
                <span class="metric-label">Peak weekday hours need</span>
                <span class="metric-value">${monthData.costs.peak_hours_info.max_hosts_needed} servers (${monthData.costs.peak_hours_info.weekday_peak_hours.length} hours)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Peak weekend hours need</span>
                <span class="metric-value">${monthData.costs.peak_hours_info.max_hosts_needed} servers (${monthData.costs.peak_hours_info.weekend_peak_hours.length} hours)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Total server-hours per month</span>
                <span class="metric-value">${Math.round(monthData.costs.monthly_totals.infrastructure_cost / monthData.costs.hourly_rate).toLocaleString()} hours</span>
            </div>
        </div>

        <div class="chart-container">
            <h4>📊 12-Month Trends Overview</h4>
            ${generateTrendsChart(results)}
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

    // Get current configuration values from the form
    const config = gatherConfiguration();
    
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
                        `• Starting DAU: <strong>${config.real_data_baseline.current_dau.toLocaleString()}</strong><br>
                         • Household Filter: <strong>${(config.real_data_baseline.household_percentage * 100).toFixed(0)}%</strong> → ${Math.floor(config.real_data_baseline.current_dau * config.real_data_baseline.household_percentage).toLocaleString()} existing users<br>
                         • New Marketing Users: <strong>${users.marketing_details.new_users.toLocaleString()}</strong> (all CoComelon users)<br>
                         • Month 1 Total: <strong>${users.total_users.toLocaleString()}</strong><br>` :
                        `• Previous Month Retained: <strong>${Math.floor(allResults[month - 1].users.total_users * config.marketing_acquisition.retention_curve.month_1).toLocaleString()}</strong> (${(config.marketing_acquisition.retention_curve.month_1 * 100).toFixed(0)}% retention)<br>
                         • New Marketing Users: <strong>${users.marketing_details.new_users.toLocaleString()}</strong> (all CoComelon users)<br>
                         • Month ${month} Total: <strong>${users.total_users.toLocaleString()}</strong><br>`
                    }
                    • Peak Concurrent (${config.child_usage_model.enabled ? '8%' : '10%'}): <strong>${users.peak_concurrent.toLocaleString()} users online simultaneously</strong><br>
                    • Seasonal Adjustment: <strong>${users.seasonal_multiplier.toFixed(2)}x</strong>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Step 2: Server Configuration</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Instance Type: <strong>${costs.instance_type}</strong><br>
                    • Streams per Server: <strong>${costs.sessions_per_host} simultaneous streams</strong><br>
                    • Cost per Server: <strong>$${costs.hourly_rate.toFixed(2)}/hour</strong>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Step 3: Timezone-Aware Usage Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    ${config.child_usage_model && config.child_usage_model.enabled ?
                        `<strong>Child Model - Local Time Patterns with Timezone Distribution:</strong><br>
                         • <strong>Pattern Logic:</strong> Your hourly patterns represent LOCAL TIME behavior (17:00 = 5 PM local anywhere)<br>
                         • <strong>Timezone Distribution:</strong> Eastern 47%, Central 29%, Mountain 7%, Pacific 17%<br>
                         • <strong>Example:</strong> If you set 5 PM = 1.0, this applies to 5 PM local in each timezone<br>
                         • <strong>Natural Staggering:</strong> Peak usage spreads across 4 hours (5 PM in each timezone)<br>
                         • <strong>Month 1 Peak Concurrent:</strong> ${users.peak_concurrent.toLocaleString()} users online simultaneously<br>
                         • <strong>Max Servers Needed:</strong> ${costs.peak_hours_info.max_hosts_needed} servers (${costs.sessions_per_host} sessions each @ $${costs.hourly_rate}/hour)<br>
                         • <em>Cost savings come from timezone staggering of identical local-time patterns</em>` :
                        `<strong>Generic Model (No Timezone Staggering):</strong><br>
                         • All users treated as Eastern timezone<br>
                         • Peak hours create uniform demand spikes<br>
                         • Higher infrastructure costs due to synchronous peaks`
                    }
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Step 4: Hourly Demand Examples</strong>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0;">
                    <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #dc3545;">
                        <strong>Peak Hour (${peakTime})</strong><br>
                        • Users Online: <strong>${peakHourData.concurrent_users.toLocaleString()}</strong><br>
                        • Servers Needed: <strong>${peakHourData.hosts_needed}</strong><br>
                        • Hourly Cost: <strong>$${peakHourData.hourly_cost.toFixed(0)}</strong>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #007bff;">
                        <strong>Off-Peak (${offPeakTime})</strong><br>
                        • Users Online: <strong>${offPeakData.concurrent_users.toLocaleString()}</strong><br>
                        • Servers Needed: <strong>${offPeakData.hosts_needed}</strong><br>
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

            overview += `
                <div class="${cardClass}" style="${style}" onclick="selectMonth(${month})" title="Click to view Month ${month} details">
                    <h5 style="cursor: pointer;">Month ${month}</h5>
                    <div class="metric">
                        <span class="metric-label">Users</span>
                        <span class="metric-value">${data.users.total_users.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Server Type</span>
                        <span class="metric-value">${data.costs.instance_type}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Max Servers</span>
                        <span class="metric-value">${data.costs.peak_hours_info.max_hosts_needed}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Monthly Cost</span>
                        <span class="metric-value">$${data.costs.monthly_totals.total_monthly_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div class="metric">
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
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
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
