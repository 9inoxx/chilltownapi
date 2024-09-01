// app.js

// Function to fetch stock data
function fetchData() {
    const ticker = document.getElementById('ticker').value;
    fetch(`/data/${ticker}`)
        .then(response => response.json())
        .then(data => {
            // Extract data
            const dates = data.map(item => item.Date);
            const opens = data.map(item => item.Open);
            const highs = data.map(item => item.High);
            const lows = data.map(item => item.Low);
            const closes = data.map(item => item.Close);

            // Create trace for candlestick chart
            const trace = {
                x: dates,
                open: opens,
                high: highs,
                low: lows,
                close: closes,
                type: 'candlestick',
                name: 'Candlestick Chart',
                increasing: { line: { color: 'green' } },
                decreasing: { line: { color: 'red' } }
            };

            // Define chart layout
            const layout = {
                title: `Stock Prices for ${ticker}`,
                xaxis: { title: 'Date' },
                yaxis: { title: 'Price' },
                plot_bgcolor: '#f0f0f0',
                paper_bgcolor: '#f0f0f0',
                font: { color: '#333' }
            };

            // Plot the candlestick chart
            Plotly.newPlot('chart', [trace], layout);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to fetch model data
function fetchModel() {
    const ticker = document.getElementById('ticker').value;
    fetch(`/model/${ticker}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            // Extract model data
            const dates = data.map(item => item.Date);
            const probabilities = data.map(item => item.Probability);

            // Create trace for mean reversion probability chart
            const trace = {
                x: dates,
                y: probabilities,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'orange' }
            };

            // Define chart layout
            const layout = {
                title: `Mean Reversion Probability for ${ticker}`,
                xaxis: { title: 'Date' },
                yaxis: { title: 'Probability' },
                plot_bgcolor: '#f0f0f0',
                paper_bgcolor: '#f0f0f0',
                font: { color: '#333' }
            };

            // Plot the probability chart
            Plotly.newPlot('model', [trace], layout);
        })
        .catch(error => {
            console.error('Error fetching model:', error);
            alert('Failed to fetch model data. Please check the ticker symbol and try again.');
        });
}


function fetchModel() {
    const ticker = document.getElementById('ticker').value;
    fetch(`/model/${ticker}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('Model data:', data);  // Add this line to check the data received

            const dates = data.map(item => item.Date);
            const probabilities = data.map(item => item.Probability);

            const trace = {
                x: dates,
                y: probabilities,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'green' }
            };

            const layout = {
                title: `Mean Reversion Probability for ${ticker}`,
                xaxis: { title: 'Date' },
                yaxis: { title: 'Probability' },
                plot_bgcolor: '#f0f0f0',
                paper_bgcolor: '#f0f0f0',
                font: { color: '#333' }
            };

            Plotly.newPlot('model', [trace], layout);
        })
        .catch(error => {
            console.error('Error fetching model:', error);
            alert('Failed to fetch model data. Please check the ticker symbol and try again.');
        });
}
