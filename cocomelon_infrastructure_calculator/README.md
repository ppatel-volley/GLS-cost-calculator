# CoComelon Infrastructure Cost Calculator

A complete infrastructure cost modeling tool for CoComelon streaming platform with configurable assumptions and real-time calculations.

## Quick Start

### Option 1: Web Interface (Recommended)
1. **Open the calculator**: Double-click `calculator_frontend.html` or open in any web browser
2. **Configure parameters**: Adjust values in the left panel (all have helpful tooltips)
3. **Calculate costs**: Click "🚀 Calculate Infrastructure Costs"
4. **Explore results**: Use month tabs to see progression and detailed breakdowns

### Option 2: Python Backend
```bash
# Run full analysis
python3 cocomelon_interactive_calculator.py

# Run tests
python3 test_calculator.py
```

## What's Included

### Core Files
- **`calculator_frontend.html`** - Complete web interface (no installation required)
- **`cocomelon_interactive_calculator.py`** - Python backend calculator
- **`config/cocomelon_assumptions.json`** - All configurable parameters
- **`test_calculator.py`** - Comprehensive test suite

### Key Features

**✅ Pure Infrastructure Focus**
- User growth → Server capacity → Real costs
- No revenue/business model distractions
- Hour-by-hour cost modeling

**✅ Real AWS GameLift Pricing** (Verified against original GLS calculator)
- **gen4n_high**: $0.50/hour, 2 sessions/host (NVIDIA T4)
- **gen5n_high**: $0.77/hour, 4 sessions/host (NVIDIA A10G) 
- **g6n_high**: $1.50/hour, 8 sessions/host (NVIDIA L4)

**✅ Optimized Timeline**
- **Months 1-2**: gen5n_high (5.19 streams/$, most efficient available)
- **Months 3-12**: g6n_high (5.33 streams/$, maximum efficiency)

**✅ User-Friendly Interface**
- Real times: "3 PM EST" instead of confusing numbers
- Hover tooltips explaining every parameter
- Color-coded peak vs off-peak hours
- Step-by-step calculation breakdowns

**✅ Fully Configurable**
- Hourly usage patterns (adjustable if research differs)
- Instance types and availability timeline
- Growth rates and capacity planning
- All parameters editable through UI

## Configuration Guide

### Real Data Baseline
- **DAU**: Starting daily active users (currently 4,140)
- **Peak Concurrent**: What % are online simultaneously (typically 10% for kids content)
- **Growth Rate**: Monthly user growth (10% = doubles every 7 months)

### Hourly Usage Patterns
**Peak Hours (Need More Servers)**:
- **Weekdays**: 7-8 AM (before school), 3-7 PM (after school)  
- **Weekends**: 8 AM-6 PM (cartoon time)

**Off-Peak Hours (Minimal Servers)**:
- Late night/early morning when kids are sleeping

**Multipliers**: 1.0 = 100% of peak concurrent online, 0.5 = 50% online

### Instance Types
Each server type handles different numbers of simultaneous streams:
- **Better Efficiency**: More streams per server = lower cost per user
- **Higher Hourly Cost**: More powerful servers cost more per hour
- **Net Effect**: Better servers often reduce total costs despite higher hourly rates

## Cost Methodology 

### Step-by-Step Calculation
1. **Users**: 4,471 total → 447 peak concurrent (10%)
2. **Servers Needed**: 447 concurrent ÷ 4 streams/server = 112 servers at peak
3. **Hourly Costs**: 5 PM needs 112 servers × $0.77 = $86/hour
4. **Daily Costs**: Sum all 24 hours = $780 weekdays, $420 weekends  
5. **Monthly Total**: $780 × 22 weekdays + $420 × 8 weekends + storage = **$20,559**

### Key Formula
```
Servers Needed = CEIL(Concurrent Users × Hour Multiplier ÷ Sessions per Server)
```

**Example**: At 5 PM EST, 447 peak × 1.0 multiplier ÷ 4 streams = 112 servers

## Results Interpretation

### Month-by-Month View
- **Users**: Growth progression with seasonal adjustments
- **Instance Type**: Automatic selection of most cost-efficient option
- **Costs**: Infrastructure + storage breakdown
- **Efficiency**: Cost per user trends (should decrease with better instances)

### Key Insights
- **Month 3 Improvement**: Despite g6n_high costing $1.50/hour vs gen5n_high's $0.77/hour, cost per user decreases due to 8 vs 4 streams per server
- **Peak Hour Impact**: Most costs come from after-school hours (3-7 PM EST)
- **Weekend Patterns**: Different usage means different capacity needs

## Validation & Testing

### Accuracy Verification
✅ **Pricing**: Matches original AWS GameLift Streams pricing  
✅ **Logic**: Instance selection uses cost-efficiency (streams per dollar)  
✅ **Math**: ROUNDUP(concurrent/capacity) formula verified  
✅ **Tests**: Comprehensive test suite covers all scenarios  

### Running Tests
```bash
python3 test_calculator.py
```

Expected output: "✅ All tests passed! Calculator is working correctly."

## Customization

### Scenario Testing
1. **Conservative Growth**: Lower monthly growth to 5-8%
2. **Aggressive Growth**: Increase to 15-20% monthly 
3. **Different Usage**: Adjust hourly patterns based on actual data
4. **Instance Availability**: Change when new hardware becomes available

### Adding New Instances
1. Edit `config/cocomelon_assumptions.json`
2. Add new instance with sessions_per_host, hourly_rate, available_from_month
3. Calculator automatically selects most efficient option

### Adjusting Patterns
- **Research Changes**: Update hourly multipliers if actual usage differs
- **Seasonal Effects**: Modify seasonal multipliers for holidays/school schedules  
- **Time Zones**: Currently optimized for US East Coast peak times

## Technical Details

### Browser Compatibility  
- Works in any modern web browser (Chrome, Firefox, Safari, Edge)
- No internet connection required
- Mobile-friendly responsive design

### Python Requirements
- Python 3.6+
- Standard library only (no external dependencies)

### File Structure
```
cocomelon_infrastructure_calculator/
├── calculator_frontend.html          # Main web interface
├── cocomelon_interactive_calculator.py  # Python backend
├── test_calculator.py                # Test suite
├── config/
│   └── cocomelon_assumptions.json   # All parameters
└── README.md                         # This file
```

## Support & Development

### Troubleshooting
- **Frontend not loading**: Open directly in browser, check JavaScript console
- **Wrong calculations**: Verify parameters match your expected values
- **Python errors**: Check Python version (3.6+ required)

### Making Changes
1. **UI Changes**: Edit parameters in web interface  
2. **Config Changes**: Modify `config/cocomelon_assumptions.json`
3. **Logic Changes**: Update Python files (run tests after changes)

---

*This calculator provides mathematically accurate infrastructure cost modeling based on real AWS GameLift Streams pricing and children's viewing behavior research. Perfect for capacity planning, investment presentations, and operational budgeting.*