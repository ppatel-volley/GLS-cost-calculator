// Default configuration data (business model elements removed)
// NOTE: Month 1 filters current DAU by household percentage (only households with kids want CoComelon)
// Growth assumes all new users are CoComelon-interested (no household filtering after month 1)
const defaultConfig = {
    real_data_baseline: {
        current_dau: 4140,
        household_percentage: 0.45, // Research: Lower than expected - most users are individual accounts
        peak_concurrent_ratio: 0.10
    },
    growth_assumptions: {
        monthly_growth_rate: 0.10,
        existing_user_retention: 0.88,
        seasonal_multipliers: {
            january: 0.95, february: 0.98, march: 1.05, april: 1.08,
            may: 1.12, june: 1.15, july: 1.18, august: 1.15,
            september: 1.08, october: 1.05, november: 1.10, december: 1.20
        }
    },
    marketing_acquisition: {
        comment: "New user acquisition patterns that marketing can control",
        new_user_monthly_targets: {
            month_1: 500,   // Launch month - conservative
            month_2: 1200,  // Ramp up marketing
            month_3: 2000,  // Full campaign
            month_4: 2500,  // Peak acquisition
            month_5: 2200,  // Sustained growth
            month_6: 2000,  // Market saturation
            month_7: 1800,  // Organic + referrals
            month_8: 1600,  // Steady state
            month_9: 1500,  // Holiday prep
            month_10: 1400, // Maintenance
            month_11: 1800, // Holiday boost
            month_12: 2200  // Year-end push
        },
        new_user_cocomelon_interest: 1.0, // All new users are CoComelon users (for capacity planning)
        referral_multiplier: 1.0, // Direct new user inputs - no referral complexity
        retention_curve: {
            month_1: 0.88, // 88% stay after first month
            month_2: 0.82, // 82% stay after second month  
            month_3: 0.79, // 79% stay after third month
            steady_state: 0.76 // Long-term retention rate
        }
    },
    time_zone_patterns: {
        weekday_pattern: {
            hours: {
                "0": 0.006, "1": 0.006, "2": 0.006, "3": 0.006, "4": 0.006,
                "5": 0.010, "6": 0.050, "7": 0.250, "8": 0.030, "9": 0.010,
                "10": 0.010, "11": 0.010, "12": 0.010, "13": 0.010, "14": 0.010,
                "15": 0.020, "16": 0.050, "17": 1.000, "18": 1.000, "19": 0.600,
                "20": 0.100, "21": 0.006, "22": 0.006, "23": 0.006
            }
        },
        weekend_pattern: {
            hours: {
                "0": 0.002, "1": 0.002, "2": 0.002, "3": 0.002, "4": 0.002,
                "5": 0.002, "6": 0.010, "7": 0.150, "8": 0.350, "9": 0.500,
                "10": 0.600, "11": 0.650, "12": 0.700, "13": 0.750, "14": 0.700,
                "15": 0.650, "16": 0.700, "17": 0.750, "18": 0.700, "19": 0.550,
                "20": 0.250, "21": 0.002, "22": 0.002, "23": 0.002
            }
        }
    },
    infrastructure_specs: {
        instance_types: {
            gen4n_high: {
                description: "NVIDIA T4 - Cost optimized launch option",
                sessions_per_host: 2,
                hourly_rate: 0.50,
                available_from_month: 1
            },
            gen5n_high: {
                description: "NVIDIA A10G - Performance balanced",
                sessions_per_host: 4,
                hourly_rate: 0.77,
                available_from_month: 1
            },
            g6n_high: {
                description: "NVIDIA L4 - High capacity",
                sessions_per_host: 8,
                hourly_rate: 1.50,
                available_from_month: 3
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
    loadDefaultValues();
    createHourlyPatternInputs();
    createInstanceConfigs();
    createMonthTabs();
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

function createInstanceConfigs() {
    const container = document.getElementById('instance_configs');
    const instances = defaultConfig.infrastructure_specs.instance_types;

    Object.keys(instances).forEach(instanceKey => {
        const instance = instances[instanceKey];
        const div = document.createElement('div');
        div.className = 'instance-config';
        div.innerHTML = `
            <h5>${instanceKey} - ${instance.description}</h5>
            <div class="instance-row">
                <div class="form-group">
                    <div class="label-with-tooltip">
                        <label>Sessions/Host</label>
                        <div class="tooltip">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltiptext">How many kids can stream simultaneously from one server. Higher = more efficient but more expensive servers.</span>
                        </div>
                    </div>
                    <input type="number" id="${instanceKey}_sessions" value="${instance.sessions_per_host}" min="1">
                </div>
                <div class="form-group">
                    <div class="label-with-tooltip">
                        <label>Hourly Rate ($)</label>
                        <div class="tooltip">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltiptext">Cost per server per hour. AWS GameLift pricing for this instance type.</span>
                        </div>
                    </div>
                    <input type="number" id="${instanceKey}_rate" value="${instance.hourly_rate}" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <div class="label-with-tooltip">
                        <label>Available Month</label>
                        <div class="tooltip">
                            <span class="tooltip-icon">?</span>
                            <span class="tooltiptext">Which month this server type becomes available. Earlier = available sooner for cost optimization.</span>
                        </div>
                    </div>
                    <input type="number" id="${instanceKey}_month" value="${instance.available_from_month}" min="1">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
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
    config.real_data_baseline.peak_concurrent_ratio = parseFloat(document.getElementById('peak_concurrent_ratio').value);
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

    // Update instance configurations
    Object.keys(config.infrastructure_specs.instance_types).forEach(instanceKey => {
        config.infrastructure_specs.instance_types[instanceKey].sessions_per_host = 
            parseInt(document.getElementById(`${instanceKey}_sessions`).value);
        config.infrastructure_specs.instance_types[instanceKey].hourly_rate = 
            parseFloat(document.getElementById(`${instanceKey}_rate`).value);
        config.infrastructure_specs.instance_types[instanceKey].available_from_month = 
            parseInt(document.getElementById(`${instanceKey}_month`).value);
    });

    return config;
}

function calculateResults() {
    try {
        const config = gatherConfiguration();
        const results = runCalculations(config);
        currentResults = results;
        displayResults(results);
    } catch (error) {
        document.getElementById('results_content').innerHTML = 
            `<div class="error">Calculation Error: ${error.message}</div>`;
    }
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
        
        // Calculate concurrent users
        const peakConcurrent = adjustedUsers * baseline.peak_concurrent_ratio;
        
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

function calculateHourlyCosts(month, monthlyUsers, config) {
    const totalUsers = monthlyUsers.total_users;
    const peakConcurrent = monthlyUsers.peak_concurrent;
    
    // Get optimal instance type
    const instanceType = getOptimalInstanceType(month, config);
    const instanceSpecs = config.infrastructure_specs.instance_types[instanceType];
    
    const sessionsPerHost = instanceSpecs.sessions_per_host;
    const hourlyRate = instanceSpecs.hourly_rate;
    
    // Get usage patterns
    const weekdayPattern = config.time_zone_patterns.weekday_pattern.hours;
    const weekendPattern = config.time_zone_patterns.weekend_pattern.hours;
    
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
                    • Peak Concurrent (10%): <strong>${users.peak_concurrent.toLocaleString()} users online simultaneously</strong><br>
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
                <strong>Example:</strong> At ${peakTime}, ${users.peak_concurrent.toLocaleString()} peak × 1.0 multiplier ÷ ${costs.sessions_per_host} streams = ${Math.ceil(users.peak_concurrent / costs.sessions_per_host)} servers needed
            </div>
        </div>
    `;
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
