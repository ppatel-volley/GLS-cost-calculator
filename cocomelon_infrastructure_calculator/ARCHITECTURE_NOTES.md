# CoComelon Infrastructure Calculator - Architecture

## File Structure

This calculator comes in two versions to address your architecture concern:

### Option 1: Single-File Version (Original)
- **File**: `calculator_frontend.html` (1,283 lines)
- **Architecture**: All JavaScript embedded directly in HTML
- **Pros**: 
  - Single file, easy to share and deploy
  - No external dependencies or file loading issues
  - Works offline immediately
- **Cons**: 
  - Poor separation of concerns (714 lines of JS mixed with HTML)
  - Harder to maintain and debug
  - Not following web development best practices

### Option 2: Separated Version (Improved)
- **Files**: 
  - `calculator_frontend_separated.html` (571 lines) - HTML + CSS only
  - `calculator.js` (712 lines) - Pure JavaScript
- **Architecture**: Proper separation of concerns
- **Pros**:
  - Clean separation of HTML structure and JavaScript logic
  - Easier to maintain and debug
  - Follows web development best practices
  - Better for version control and collaboration
- **Cons**:
  - Requires both files to be in same directory
  - Requires web server for proper testing (or file:// protocol with some browsers)

## JavaScript Architecture

Both versions use the same core JavaScript logic:

### Core Components
1. **Configuration Management** (lines 1-112)
   - `defaultConfig` object with all CoComelon parameters
   - JSON structure matches backend Python calculator

2. **UI Initialization** (lines 113-225)
   - Dynamic form generation for 24-hour patterns
   - Instance type configuration interfaces
   - Month selection tabs

3. **Calculator Engine** (lines 263-462)
   - `calculateMonthlyUsers()` - Growth calculations with seasonality
   - `getOptimalInstanceType()` - Cost efficiency selection
   - `calculateHourlyCosts()` - Hour-by-hour infrastructure needs

4. **Results Display** (lines 464-712)
   - Dynamic HTML generation for results
   - Step-by-step calculation breakdown
   - 12-month progression overview

### Data Flow
```
User Input → gatherConfiguration() → runCalculations() → displayResults()
    ↓              ↓                      ↓                   ↓
Form Values → Config Object → Results Object → Dynamic HTML
```

### Key Functions
- `formatTimeEST(hour)` - Converts 0-23 to "3 PM EST" format
- `isPeakHour(hour, isWeekend)` - Identifies peak usage times
- `calculateHourlyCosts()` - Core cost calculation per hour
- `generateCalculationBreakdown()` - Stakeholder presentation format

## Recommendation

**Use the separated version** (`calculator_frontend_separated.html` + `calculator.js`) for:
- Better code maintainability
- Professional development practices  
- Easier debugging and future enhancements
- Cleaner separation of concerns

**Use the single-file version** (`calculator_frontend.html`) only if:
- You need maximum portability (single file sharing)
- You're not planning to modify the code
- You need guaranteed offline functionality without file dependencies

## Testing Both Versions

Both versions produce identical results and have the same functionality. Test by:

1. **Single-file**: Double-click `calculator_frontend.html`
2. **Separated**: Double-click `calculator_frontend_separated.html` (requires `calculator.js` in same folder)

Both will load the same configuration from `config/cocomelon_assumptions.json` if available, or fall back to hardcoded defaults.