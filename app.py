from flask import Flask, jsonify, render_template
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Apply CORS to the Flask app
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data/<ticker>')
def data(ticker):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period='1y')
        df.reset_index(inplace=True)
        df = df[['Date', 'Open', 'High', 'Low', 'Close']]
        df['Date'] = df['Date'].astype(str)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/model/<ticker>')
def model(ticker):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period='1y')
        df['Mean'] = df['Close'].rolling(window=20).mean()
        df['Deviation'] = df['Close'] - df['Mean']
        df['Probability'] = np.where(df['Deviation'] > 0, 1, 0)
        df = df[['Date', 'Probability']]
        df['Date'] = df['Date'].astype(str)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mean_reversion/<ticker>')
def mean_reversion(ticker):
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period='1y')
        df['Return'] = df['Close'].pct_change()
        std_return = df['Return'].std()
        threshold = 2 * std_return

        reversion_probabilities = []
        for i in range(len(df)):
            if abs(df['Return'].iloc[i]) > threshold:
                if i + 5 < len(df) and abs(df['Return'].iloc[i + 5]) < threshold:
                    reversion_probabilities.append(1)
                else:
                    reversion_probabilities.append(0)

        probability_mean_reversion = sum(reversion_probabilities) / len(reversion_probabilities)
        return jsonify({'probability_mean_reversion': round(probability_mean_reversion, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
