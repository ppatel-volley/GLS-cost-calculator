# CoComelon GameLift Streams Cost Calculator - Usage Guide

## Overview
This interactive Excel calculator helps analyze AWS GameLift Streams costs for the CoComelon game deployment. It features fully formula-driven calculations that update automatically when you change parameters.

## Quick Start

### 1. Running the Calculator
```bash
python cocomelon_calculator.py
```

This generates:
- **Excel Calculator**: Interactive spreadsheet with live formulas
- **Analysis Report**: Text summary with recommendations

### 2. Opening the Excel File
The generated Excel file (e.g., `CoComelon_GameLift_Calculator_20250821.xlsx`) contains multiple sheets:

- **📊 Inputs & Controls** - Adjust parameters here
- **🧮 Calculations** - Automatic cost calculations  
- **📈 Cost Dashboard** - Executive summary
- **📊 DAU Sensitivity** - Impact of different user counts

## Using the Interactive Parameters

### Key Parameters You Can Adjust

#### In the "📊 Inputs & Controls" Sheet:

**🎮 Game Configuration:**
- **Daily Active Users (DAU)**: Change B4 to model different user scenarios
- **Peak Concurrent Streams**: Automatically calculates based on DAU (B5)
- **Concurrent Stream % of DAU**: Shows the ratio (typically 0.64%)

**⏰ Usage Patterns:**
- Current settings model East-to-West coast usage
- Weekday peak: 4pm-7pm PT (when kids watch after school)
- Weekend peak: 4am-7pm PT (longer viewing window)

**💰 Cost Parameters:**
- **Always-On Capacity %**: Adjust B16 (default 30%)
- **Storage Cost**: Change B17 if AWS pricing updates
- **Storage Required**: Modify B18 based on game assets

**🖥️ Instance Pricing:**
- Update B22-B24 with latest AWS rates
- gen4n_high: $0.50/hour (2 sessions/host)
- gen5n_high: $0.77/hour (4 sessions/host)  
- g6n_high: $1.50/hour (6 sessions/host)

### Instant Results
All calculations update automatically when you change any input parameter.

## Understanding the Results

### Cost Dashboard (📈 Sheet)

**Monthly Cost Breakdown:**
- **Streaming Cost**: Compute hours for game hosting
- **Storage Cost**: Game asset storage (typically $3/month)
- **Total Monthly Cost**: Complete infrastructure cost

**Per-User Analysis:**
- **Monthly Cost per DAU**: Infrastructure cost divided by user count
- **% of Subscription Revenue**: Cost as percentage of $12.99 subscription

**Annual Projections:**
- Yearly costs with seasonal variations
- Cost savings comparisons between instance types

### DAU Sensitivity Analysis (📊 Sheet)

Test different user scenarios:
- 25,000 to 100,000 DAU range
- See how costs scale with user growth
- Identify break-even points

## Real-World Usage Scenarios

### Scenario 1: Launch Planning
1. Set DAU to conservative estimate (e.g., 25,000)
2. Review monthly costs for each instance type
3. Choose gen4n_high for cost-effective launch

### Scenario 2: Growth Modeling  
1. Test DAU scenarios: 35k, 55k, 75k users
2. Compare cost-per-user ratios
3. Plan infrastructure scaling strategy

### Scenario 3: Instance Type Comparison
1. Keep DAU constant
2. Compare monthly costs across gen4n_high, gen5n_high, g6n_high
3. Evaluate cost vs. performance trade-offs

### Scenario 4: Pricing Updates
1. Update hourly rates in Inputs sheet (B22-B24)
2. All calculations refresh automatically
3. Re-evaluate optimal instance choice

## Key Insights from the Calculator

### Cost Efficiency
- **Multi-tenancy is critical**: 6:1 sessions (g6n_high) vs 2:1 (gen4n_high)
- **Always-On + On-Demand**: 30% always-on reduces costs significantly
- **Time-zone modeling**: East-to-West usage pattern optimizes resource allocation

### Business Metrics
- Infrastructure costs typically <5% of subscription revenue
- Cost per user ranges from $0.50-$2.00 monthly depending on instance type
- Economies of scale improve with higher DAU

### Recommendations
1. **Start with gen4n_high**: Most cost-effective for initial launch
2. **Scale to gen5n_high**: Better multi-tenancy at moderate scale
3. **Consider g6n_high**: Maximum efficiency at high scale (early access required)

## Customization Options

### Adjusting Usage Patterns
To modify time zones or peak hours:
1. Update usage pattern parameters in the Inputs sheet
2. The calculator automatically recalculates hourly costs

### Adding New Instance Types
To add future GameLift instance types:
1. Add new rows to the Inputs sheet pricing section
2. Copy formula patterns from existing calculations
3. Update the Dashboard comparisons

### Regional Pricing
For different AWS regions:
1. Research regional GameLift Streams pricing  
2. Update hourly rates in the Inputs sheet
3. All costs recalculate automatically

## Troubleshooting

### Common Issues

**Formula Errors (#REF!)**
- Ensure all sheet names match exactly
- Check that cell references point to correct rows

**Unexpected Costs**
- Verify DAU and concurrent stream assumptions
- Check that usage patterns align with your game's audience

**Pricing Discrepancies**  
- Validate AWS GameLift Streams current pricing
- Update hourly rates if AWS pricing has changed

### Getting Help
- Review the generated Analysis Report for recommendations
- Check formula logic in the Calculations sheet
- Verify input parameters in the Inputs & Controls sheet

## Best Practices

### Regular Updates
1. **Monthly**: Check AWS pricing for updates
2. **Quarterly**: Review DAU growth assumptions
3. **Annually**: Evaluate new GameLift instance types

### Scenario Planning
- Always model 3 scenarios: conservative, target, optimistic
- Test different DAU levels before major launches
- Consider seasonal usage variations

### Documentation
- Save different Excel versions for different scenarios
- Document assumptions and decisions in the spreadsheet
- Share results with engineering and business teams

## Advanced Usage

### Custom Formulas
The calculator uses Excel formulas extensively. Key formula patterns:

**Host Calculation**: `=ROUNDUP(concurrent_streams/sessions_per_host, 0)`
**Daily Cost**: `=(peak_hours * peak_hosts + off_peak_hours * always_on_hosts) * hourly_rate`
**Monthly Cost**: `=(weekday_cost * 5 + weekend_cost * 2) * 4.33`

### Integration with Business Planning
- Export monthly costs to financial planning models
- Use cost-per-user metrics for unit economics analysis
- Align infrastructure costs with subscription revenue projections

This calculator provides a comprehensive foundation for CoComelon's GameLift Streams cost planning and ongoing optimization.