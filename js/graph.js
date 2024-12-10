/**
 * Graph Handler
 * Manages the visualization of gas concentration data using Chart.js
 */

class ConcentrationGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.chart = null;
        this.initialize();
    }

    /**
     * Initialize the chart with empty data
     */
    initialize() {
        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Gas Concentration',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Gas Concentration Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Concentration: ${context.parsed.y.toFixed(2)} ppm`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (minutes)'
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Concentration (ppm)'
                        },
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    /**
     * Update the chart with new data points
     * @param {Array} dataPoints - Array of {time, concentration} objects
     */
    updateData(dataPoints) {
        const times = dataPoints.map(point => point.time);
        const concentrations = dataPoints.map(point => point.concentration);

        this.chart.data.labels = times;
        this.chart.data.datasets[0].data = concentrations;

        // Update y-axis scale based on maximum concentration
        const maxConcentration = Math.max(...concentrations);
        this.chart.options.scales.y.max = this.calculateYAxisMax(maxConcentration);

        this.chart.update();
    }

    /**
     * Calculate appropriate y-axis maximum value
     * @param {number} maxValue - Maximum concentration value
     * @returns {number} - Calculated y-axis maximum
     */
    calculateYAxisMax(maxValue) {
        // Round up to next nice number for y-axis maximum
        const pow = Math.floor(Math.log10(maxValue));
        const unit = Math.pow(10, pow);
        return Math.ceil(maxValue / unit) * unit;
    }

    /**
     * Clear the chart data
     */
    clear() {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
    }

    /**
     * Update chart title
     * @param {string} title - New chart title
     */
    updateTitle(title) {
        this.chart.options.plugins.title.text = title;
        this.chart.update();
    }

    /**
     * Add steady state line to the graph
     * @param {number} steadyState - Steady state concentration value
     */
    addSteadyStateLine(steadyState) {
        // Remove any existing steady state line
        this.chart.data.datasets = this.chart.data.datasets.filter(
            dataset => dataset.label !== 'Steady State'
        );

        // Add new steady state line
        this.chart.data.datasets.push({
            label: 'Steady State',
            data: Array(this.chart.data.labels.length).fill(steadyState),
            borderColor: 'rgba(231, 76, 60, 0.8)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
        });

        this.chart.update();
    }
}
