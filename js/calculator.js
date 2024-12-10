/**
 * Gas Concentration Calculator
 * Implements the mathematical model for calculating gas concentration over time
 */

class GasCalculator {
    constructor(volume, inputFlow, ventilationRate) {
        // Convert volume to liters for consistent units
        this.volume = volume * 1000; // m³ to L
        this.inputFlow = inputFlow; // L/min
        this.ventilationRate = ventilationRate; // L/min
        this.timeStep = 5; // minutes
    }

    /**
     * Calculate concentration at a specific time point
     * @param {number} time - Time in minutes
     * @returns {number} - Concentration in ppm
     */
    calculateConcentrationAtTime(time) {
        // Using the analytical solution to the differential equation:
        // dC/dt = (Qin/V) - (Qout*C/V)
        // C(t) = (Qin/Qout) * (1 - e^(-Qout*t/V))
        
        if (this.ventilationRate === 0) {
            // Special case: no ventilation
            // Linear increase in concentration
            return (this.inputFlow * time * 1000000) / this.volume;
        }

        const steadyState = this.calculateSteadyState();
        const exponent = -this.ventilationRate * time / this.volume;
        return steadyState * (1 - Math.exp(exponent));
    }

    /**
     * Calculate steady state concentration
     * @returns {number} - Steady state concentration in ppm
     */
    calculateSteadyState() {
        if (this.ventilationRate === 0) {
            return Infinity;
        }
        // Steady state occurs when dC/dt = 0
        // Therefore: Qin/V = Qout*C/V
        // C = Qin/Qout * 1,000,000 (convert to ppm)
        // Note: Both flow rates are in L/min, so units cancel out
        return (this.inputFlow / this.ventilationRate) * 1000000;
    }

    /**
     * Calculate time to reach percentage of steady state
     * @param {number} percentage - Percentage of steady state (0-100)
     * @returns {number} - Time in minutes
     */
    calculateTimeToReachPercentage(percentage) {
        if (this.ventilationRate === 0) {
            return Infinity;
        }
        // Solve C(t) = p * Css for t
        // t = -V/Qout * ln(1 - p)
        const p = percentage / 100;
        return (-this.volume / this.ventilationRate) * Math.log(1 - p);
    }

    /**
     * Generate concentration data points for plotting
     * @param {number} duration - Total duration in minutes
     * @returns {Array} - Array of {time, concentration} objects
     */
    generateDataPoints(duration) {
        const dataPoints = [];
        for (let time = 0; time <= duration; time += this.timeStep) {
            const concentration = this.calculateConcentrationAtTime(time);
            dataPoints.push({
                time,
                concentration: Math.round(concentration * 100) / 100 // Round to 2 decimal places
            });
        }
        return dataPoints;
    }

    /**
     * Calculate maximum concentration for a given duration
     * @param {number} duration - Duration in minutes
     * @returns {number} - Maximum concentration in ppm
     */
    calculateMaxConcentration(duration) {
        const steadyState = this.calculateSteadyState();
        const finalConcentration = this.calculateConcentrationAtTime(duration);
        return Math.min(steadyState, finalConcentration);
    }

    /**
     * Validate input parameters
     * @returns {Object} - Object containing validation result and error message
     */
    static validateInputs(volume, inputFlow, ventilationRate, duration) {
        if (volume <= 0) {
            return { isValid: false, error: "Volume must be greater than 0" };
        }
        if (inputFlow < 0) {
            return { isValid: false, error: "Input flow rate cannot be negative" };
        }
        if (ventilationRate < 0) {
            return { isValid: false, error: "Ventilation rate cannot be negative" };
        }
        if (duration < 5 || duration > 360) {
            return { isValid: false, error: "Duration must be between 5 and 360 minutes" };
        }
        return { isValid: true, error: null };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GasCalculator;
}
