/**
 * Main Application Logic
 * Coordinates between UI, calculator, and graph components
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    let calculator = null;
    let graph = null;

    // Get DOM elements
    const form = document.getElementById('calculatorForm');
    const maxConcentrationElement = document.getElementById('maxConcentration');
    const steadyStateElement = document.getElementById('steadyState');
    const timeToSteadyElement = document.getElementById('timeToSteady');
    const shareButton = document.getElementById('shareButton');
    const shareUrlContainer = document.getElementById('shareUrlContainer');
    const shareUrlInput = document.getElementById('shareUrl');
    const copyButton = document.getElementById('copyButton');

    // Initialize Chart.js
    const initializeGraph = () => {
        console.log('Initializing graph...');
        if (!graph) {
            try {
                graph = new ConcentrationGraph('concentrationGraph');
                console.log('Graph initialized successfully');
            } catch (error) {
                console.error('Error initializing graph:', error);
            }
        }
    };

    // Update statistics display
    const updateStatistics = (maxConc, steadyState, timeToSteady) => {
        console.log('Updating statistics:', { maxConc, steadyState, timeToSteady });
        maxConcentrationElement.textContent = maxConc.toFixed(2);
        steadyStateElement.textContent = steadyState === Infinity ? '∞' : steadyState.toFixed(2);
        timeToSteadyElement.textContent = timeToSteady === Infinity ? '∞' : timeToSteady.toFixed(1);
    };

    // Generate shareable URL
    const generateShareableUrl = (volume, inputFlow, ventilation, duration) => {
        const params = new URLSearchParams();
        params.set('v', volume);
        params.set('i', inputFlow);
        params.set('o', ventilation);
        params.set('d', duration);
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    };

    // Update URL without showing share container
    const updateURL = (volume, inputFlow, ventilation, duration) => {
        const params = new URLSearchParams();
        params.set('v', volume);
        params.set('i', inputFlow);
        params.set('o', ventilation);
        params.set('d', duration);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    };

    // Show share URL
    const showShareUrl = (volume, inputFlow, ventilation, duration) => {
        const shareableUrl = generateShareableUrl(volume, inputFlow, ventilation, duration);
        shareUrlInput.value = shareableUrl;
        shareUrlContainer.style.display = 'flex';
    };

    // Read parameters from URL
    const getURLParameters = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            volume: parseFloat(params.get('v')),
            inputFlow: parseFloat(params.get('i')),
            ventilation: parseFloat(params.get('o')),
            duration: parseInt(params.get('d'))
        };
    };

    // Set form values
    const setFormValues = (values) => {
        document.getElementById('volume').value = values.volume;
        document.getElementById('inputFlow').value = values.inputFlow;
        document.getElementById('ventilation').value = values.ventilation;
        document.getElementById('duration').value = values.duration;
    };

    // Perform calculation
    const performCalculation = (volume, inputFlow, ventilation, duration) => {
        console.log('Performing calculation with:', { volume, inputFlow, ventilation, duration });

        // Validate inputs
        const validation = GasCalculator.validateInputs(volume, inputFlow, ventilation, duration);
        if (!validation.isValid) {
            alert(validation.error);
            return;
        }

        try {
            // Initialize calculator with new values
            calculator = new GasCalculator(volume, inputFlow, ventilation);

            // Generate data points
            const dataPoints = calculator.generateDataPoints(duration);
            console.log('Generated data points:', dataPoints);

            // Calculate statistics
            const maxConcentration = calculator.calculateMaxConcentration(duration);
            const steadyState = calculator.calculateSteadyState();
            const timeToSteady = calculator.calculateTimeToReachPercentage(90);

            console.log('Calculated statistics:', {
                maxConcentration,
                steadyState,
                timeToSteady
            });

            // Initialize graph if needed
            initializeGraph();

            // Update graph with new data
            graph.clear();
            graph.updateData(dataPoints);

            // Add steady state line if applicable
            if (steadyState !== Infinity && steadyState > 0) {
                graph.addSteadyStateLine(steadyState);
            }

            // Update statistics display
            updateStatistics(maxConcentration, steadyState, timeToSteady);

            // Update URL with current parameters
            updateURL(volume, inputFlow, ventilation, duration);

            // Enable share button
            shareButton.disabled = false;

        } catch (error) {
            console.error('Error processing calculation:', error);
            alert('An error occurred while calculating. Please check the console for details.');
        }
    };

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');

        // Get form values
        const volume = parseFloat(document.getElementById('volume').value);
        const inputFlow = parseFloat(document.getElementById('inputFlow').value);
        const ventilation = parseFloat(document.getElementById('ventilation').value);
        const duration = parseInt(document.getElementById('duration').value);

        performCalculation(volume, inputFlow, ventilation, duration);
    });

    // Share button click handler
    shareButton.addEventListener('click', () => {
        const volume = parseFloat(document.getElementById('volume').value);
        const inputFlow = parseFloat(document.getElementById('inputFlow').value);
        const ventilation = parseFloat(document.getElementById('ventilation').value);
        const duration = parseInt(document.getElementById('duration').value);

        showShareUrl(volume, inputFlow, ventilation, duration);
    });

    // Copy button click handler
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareUrlInput.value);
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard');
        }
    });

    // Initialize graph on page load
    try {
        initializeGraph();
        console.log('Initial graph setup complete');

        // Check for URL parameters and perform calculation if present
        const urlParams = getURLParameters();
        if (!isNaN(urlParams.volume) && !isNaN(urlParams.inputFlow) && 
            !isNaN(urlParams.ventilation) && !isNaN(urlParams.duration)) {
            setFormValues(urlParams);
            performCalculation(urlParams.volume, urlParams.inputFlow, 
                             urlParams.ventilation, urlParams.duration);
        } else {
            // Disable share button initially if no calculation has been performed
            shareButton.disabled = true;
        }
    } catch (error) {
        console.error('Error during initial graph setup:', error);
    }
});
