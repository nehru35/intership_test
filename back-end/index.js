const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const connection = require('./database');

app.use(cors());

// Function to fetch data from the API and insert it into the database
async function gettingDataFromAPI() {
    try {
        // Fetch data from the API
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const data = response.data;
        
        // Convert data to an array and limit it to the first 10 results
        const dataArray = Object.values(data);
        const limitedData = dataArray.slice(0, 10);

        // SQL query to insert data into the 'cryptos' table
        let query = "INSERT INTO cryptos (last, buy, sell, base_unit) VALUES (?, ?, ?, ?)";
        
        // Iterate through the limited data and insert it into the database
        for (const crypto of limitedData) {
            const values = [crypto.last, crypto.buy, crypto.sell, crypto.base_unit];
            connection.execute(query, values);
        }
    } catch (error) {
        console.error('Error while making the request or inserting data:', error);
    }
}

// Endpoint to get cryptocurrency data from the database
app.get('/getCryptos', (req, res) => {
    let sql = "SELECT * FROM cryptos";
    
    // Query the database for cryptocurrency data
    connection.query(sql, (error, results) => {
        if (!error) res.status(200).json(results);
        else console.log(error);
    });
});

// Call the function to fetch data from the API and insert it into the database
gettingDataFromAPI();

// Start the server
app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
});
