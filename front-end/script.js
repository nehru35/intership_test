// Get references to HTML elements
const cryptoTable = document.getElementById("cryptoTable"); // Reference to the table
const tbody = cryptoTable.querySelector("tbody"); // Reference to the table body
const ul = document.getElementById("comboxMenu"); // Reference to the dropdown menu
const apiUrl = 'http://localhost:3000/getCryptos'; // API URL
const telegram = document.getElementById("telegraBtn"); // Reference to the "Telegram" button
const buy = document.getElementById("buyBtn"); // Reference to the "Buy" button
const inr = document.getElementById("inrBtn"); // Reference to the "INR" button

// Add click event listeners to the buttons to handle unavailable function
telegram.addEventListener("click", notAvailable);
buy.addEventListener("click", notAvailable);
inr.addEventListener("click", notAvailable);

// Initialize an empty array to store API data
let cryptoData = [];

// Function to display an alert for an unavailable function
function notAvailable() {
    alert("I apologize, but I focused on developing the required functionalities in the test, such as displaying the data and the backend logic. The functionality for this button was not implemented.");
}

// Function to render the table with the current data
function renderTable() {
  tbody.innerHTML = ''; // Clear the table

  cryptoData.forEach((crypto, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>₹${crypto.last}</td>
      <td>₹${crypto.buy} / ₹${crypto.sell}</td>
    `;
    tbody.appendChild(row);
  });
}

// Function to update the table based on the selected base_unit
function updateTable(baseUnit) {
  tbody.innerHTML = ''; // Clear the table

  cryptoData
    .filter(crypto => crypto.base_unit === baseUnit)
    .forEach((crypto, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>₹${crypto.last}</td>
        <td>₹${crypto.buy} / ₹${crypto.sell}</td>
      `;
      tbody.appendChild(row);
    });
}

// Function to handle dropdown selection
function dropdownChanged(event) {
  const selectedBaseUnit = event.target.textContent;
  if (selectedBaseUnit === "All") {
    renderTable(); // Display all elements in the table
  } else {
    updateTable(selectedBaseUnit); // Update the table based on the selection
  }
}

// Fetch data from the API
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Request error: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    cryptoData = data; // Store the API data in the cryptoData variable

    // Extract unique base_units
    const uniqueBaseUnits = new Set(data.map(crypto => crypto.base_unit));
    
    // Add the "All" option to the dropdown
    const allOption = document.createElement('li');
    const allLink = document.createElement('a');
    allLink.classList.add('dropdown-item');
    allLink.href = '#';
    allLink.textContent = 'All';
    allOption.appendChild(allLink);
    ul.appendChild(allOption);

    // Add base_units as dropdown options
    uniqueBaseUnits.forEach(baseUnit => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.classList.add('dropdown-item');
      link.href = '#';
      link.textContent = baseUnit;
      listItem.appendChild(link);
      ul.appendChild(listItem);
    });

    // Call the renderTable function to display all elements in the table initially
    renderTable();

    // Add an event listener for the dropdown
    ul.addEventListener('click', dropdownChanged);
  })
  .catch(error => {
    console.error('Request error:', error);
  });
