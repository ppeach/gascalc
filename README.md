# Gas Concentration Calculator

## Project Overview
The Gas Concentration Calculator is a web application that visualizes the concentration of a gas in a confined space over time. It considers the space volume, gas input flow rate, and ventilation rate to calculate and display the gas concentration evolution.

## Mathematical Model
### Core Equations
- The concentration change is modeled using mass balance principles.
- \[ \frac{dC}{dt} = \left(\frac{Q_{in}}{V}\right) - \left(\frac{Q_{out}}{V}\right) \cdot C \]
  where:
  - \( C \) = Concentration (ppm)
  - \( t \) = Time (minutes)
  - \( Q_{in} \) = Input flow rate (L/min)
  - \( Q_{out} \) = Ventilation rate (L/min)
  - \( V \) = Space volume (m³)

### Assumptions
- Perfect mixing of gas in the space.
- Constant temperature and pressure.
- Initial concentration is zero.
- No chemical reactions or absorption.
- Steady input and ventilation rates.

### Units and Conversions
- Space volume: cubic meters (m³)
- Flow rates: liters per minute (L/min)
- Concentration: parts per million (ppm)
- Time: minutes
- Flow rate conversion: 1 m³ = 1000 L

## User Interface Requirements
### Input Fields
- Space volume (m³)
- Gas input flow rate (L/min)
- Ventilation rate (L/min)
- Simulation duration (up to 6 hours)

### Output Display
- Interactive graph showing:
  - X-axis: Time (minutes)
  - Y-axis: Concentration (ppm)
- Real-time calculation updates
- Clear visualization of concentration changes

## Functional Requirements
### Core Functions
- Input validation for all user entries.
- Calculation of concentration at 5-minute intervals.
- Dynamic graph generation and updates.
- Error handling and user feedback.

### Data Processing
- Calculate concentration values for each time step.
- Store calculated values for plotting.
- Update graph in real-time.

### Validation Rules
- All input values must be positive numbers.
- Volume must be > 0 m³.
- Flow rates must be ≥ 0 L/min.
- Maximum simulation time: 6 hours (360 minutes).

## Technical Specifications
### Technologies
- Frontend: HTML5, CSS3, JavaScript
- Graphing: Chart.js or similar library
- No backend required (client-side calculations).

### Performance Requirements
- Calculations completed within 1 second.
- Smooth graph updates.
- Responsive design for various screen sizes.

### Browser Compatibility
- Support for modern browsers (Chrome, Firefox, Safari, Edge).
- Mobile-responsive design.

## Future Considerations
- Additional gas types.
- Variable flow rates.
- Temperature and pressure effects.
- Multiple gas sources.
- Export data functionality.
- Save/load simulation scenarios.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/gascalc.git
   cd gascalc
   ```
2. Open `index.html` in a modern web browser to use the application.
