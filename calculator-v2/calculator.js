// Default configuration data (business model elements removed)
// NOTE: Month 1 filters current DAU by household percentage (only households with kids want CoComelon)
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
function formatTimeEST(hour) {
    const timeLabels = [
        "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
        "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
        "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
        "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
    ];
    return timeLabels[hour] + " EST";
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
}

function createHourlyPatternInputs() {
    // Create weekday pattern inputs
    const weekdayContainer = document.getElementById('weekday_pattern');
    for (let hour = 0; hour < 24; hour++) {
        const div = document.createElement('div');
        div.className = 'hour-block';
        
        const isPeak = isPeakHour(hour, false);
        const labelClass = isPeak ? 'hour-label peak' : 'hour-label off-peak';
        const inputClass = isPeak ? 'hourly-input peak' : 'hourly-input off-peak';
        
        div.innerHTML = `
            <div class="${labelClass}">${formatTimeEST(hour)}</div>
            <input type="number" class="${inputClass}" id="weekday_${hour}" 
                   value="${defaultConfig.time_zone_patterns.weekday_pattern.hours[hour.toString()]}"
                   min="0" max="1" step="0.001" title="Usage multiplier for ${formatTimeEST(hour)} on weekdays">
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
            <div class="${labelClass}">${formatTimeEST(hour)}</div>
            <input type="number" class="${inputClass}" id="weekend_${hour}" 
                   value="${defaultConfig.time_zone_patterns.weekend_pattern.hours[hour.toString()]}"
                   min="0" max="1" step="0.001" title="Usage multiplier for ${formatTimeEST(hour)} on weekends">
        `;
        weekendContainer.appendChild(div);
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
            // Month 1: Apply household filter to current DAU + first month's marketing targets
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

function calculateChildUsageMultiplier(hour, isWeekend, config) {
    // Convert hour to time string for pattern matching
    const childModel = config.child_usage_model;
    const patterns = childModel.schedule_patterns;
    const routineType = isWeekend ? 'weekend_routine' : 'weekday_routine';
    const routine = patterns[routineType];

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

function calculateHourlyCosts(month, monthlyUsers, config) {
    const totalUsers = monthlyUsers.total_users;
    const peakConcurrent = monthlyUsers.peak_concurrent;

    // Get optimal instance type
    const instanceType = getOptimalInstanceType(month, config);
    const instanceSpecs = config.infrastructure_specs.instance_types[instanceType];

    const sessionsPerHost = instanceSpecs.sessions_per_host;
    const hourlyRate = instanceSpecs.hourly_rate;

    // Get usage patterns - use child model if enabled, otherwise generic patterns
    let weekdayPattern, weekendPattern;

    if (config.child_usage_model && config.child_usage_model.enabled) {
        // Create child usage patterns by calculating multipliers for each hour
        weekdayPattern = {};
        weekendPattern = {};

        for (let hour = 0; hour < 24; hour++) {
            weekdayPattern[hour.toString()] = calculateChildUsageMultiplier(hour, false, config);
            weekendPattern[hour.toString()] = calculateChildUsageMultiplier(hour, true, config);
        }
    } else {
        // Use generic patterns
        weekdayPattern = config.time_zone_patterns.weekday_pattern.hours;
        weekendPattern = config.time_zone_patterns.weekend_pattern.hours;
    }
    
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
        // Weekday calculations - use research-backed hourly usage patterns
        const weekdayMultiplier = weekdayPattern[hour.toString()] || 0;
        const weekdayConcurrent = peakConcurrent * weekdayMultiplier;
        const weekdayHosts = Math.max(1, Math.ceil(weekdayConcurrent / sessionsPerHost));

        // Track peak hours for reporting (>50% usage)
        if (weekdayMultiplier > 0.5) {
            hourlyCosts.peak_hours_info.weekday_peak_hours.push({
                hour: hour,
                time: formatTimeEST(hour),
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
            time_est: formatTimeEST(hour)
        };

        // Weekend calculations - use research-backed hourly usage patterns
        const weekendMultiplier = weekendPattern[hour.toString()] || 0;
        const weekendConcurrent = peakConcurrent * weekendMultiplier;
        const weekendHosts = Math.max(1, Math.ceil(weekendConcurrent / sessionsPerHost));

        // Track peak hours for reporting (>50% usage)
        if (weekendMultiplier > 0.5) {
            hourlyCosts.peak_hours_info.weekend_peak_hours.push({
                hour: hour,
                time: formatTimeEST(hour),
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
            time_est: formatTimeEST(hour)
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
            <h4>🧮 Calculation Methodology (Month ${currentMonth} Example)</h4>
            ${generateCalculationBreakdown(monthData, currentMonth, results)}
        </div>
        
        <div class="chart-container">
            <h4>📈 12-Month Infrastructure Progression</h4>
            <div class="results-grid">
                ${generateYearOverview(results)}
            </div>
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
    const peakTime = formatTimeEST(parseInt(peakHour));
    
    // Find an off-peak hour for comparison
    const offPeakHour = Object.keys(costs.weekday_hours).find(hour => 
        costs.weekday_hours[hour].concurrent_users < users.peak_concurrent * 0.1
    ) || "3"; // Default to 3 AM
    
    const offPeakData = costs.weekday_hours[offPeakHour];
    const offPeakTime = formatTimeEST(parseInt(offPeakHour));
    
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
                <strong>Step 3: Hourly Demand Examples</strong>
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
                <strong>Step 4: Daily Cost Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Weekday Daily Cost: <strong>$${costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong> (sum of all 24 hours)<br>
                    • Weekend Daily Cost: <strong>$${costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong> (sum of all 24 hours)
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Step 5: Monthly Total Calculation</strong>
                <div style="padding: 10px; background: white; border-radius: 4px; margin: 10px 0;">
                    • Weekdays: $${costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})} × 22 days = <strong>$${(costs.monthly_totals.weekday_daily_cost * 22).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong><br>
                    • Weekends: $${costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})} × 8 days = <strong>$${(costs.monthly_totals.weekend_daily_cost * 8).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong><br>
                    • Storage: <strong>$${costs.monthly_totals.storage_cost.toFixed(0)}</strong><br>
                    • <strong>Total Monthly Cost: $${costs.monthly_totals.total_monthly_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
                </div>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
                <strong>💡 Key Formula:</strong><br>
                <code style="background: white; padding: 5px; border-radius: 3px;">
                    Servers Needed per Hour = CEIL(Concurrent Users × Hour Multiplier ÷ Sessions per Server)
                </code><br><br>
                <strong>Weekday Example:</strong> At ${peakTime}, ${users.peak_concurrent.toLocaleString()} peak × 1.0 multiplier ÷ ${costs.sessions_per_host} streams = ${Math.ceil(users.peak_concurrent / costs.sessions_per_host)} servers needed<br>
                <strong>Weekend Example:</strong> At 1:00 PM, ${users.peak_concurrent.toLocaleString()} peak × 0.75 multiplier ÷ ${costs.sessions_per_host} streams = ${Math.ceil(users.peak_concurrent * 0.75 / costs.sessions_per_host)} servers needed
            </div>

            <div style="background: #f0f8ff; padding: 15px; border-radius: 6px; border-left: 4px solid #4a90e2; margin-top: 15px;">
                <strong>🔍 Daily Calculation Verification</strong><br><br>
                <strong>Weekday (School Day Pattern):</strong><br>
                <div style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; margin: 8px 0;">
                    ${generateHourlyBreakdown(costs.weekday_hours, users.peak_concurrent, costs.sessions_per_host, costs.hourly_rate, 'weekday')}
                </div>
                <strong>Daily Total: $${costs.monthly_totals.weekday_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong><br><br>

                <strong>Weekend (Flexible Day Pattern):</strong><br>
                <div style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; margin: 8px 0;">
                    ${generateHourlyBreakdown(costs.weekend_hours, users.peak_concurrent, costs.sessions_per_host, costs.hourly_rate, 'weekend')}
                </div>
                <strong>Daily Total: $${costs.monthly_totals.weekend_daily_cost.toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
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

            breakdown += `${formatTimeEST(parseInt(hour))}: ${data.concurrent_users.toLocaleString()} users × ${multiplier.toFixed(3)} = ${servers} servers × $${hourlyRate} = $${cost.toFixed(2)}<br>`;
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

// Initialize interface when page loads
window.onload = initializeInterface;
