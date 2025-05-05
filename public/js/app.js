document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const locationSelect = document.getElementById('location-select');
  const staffSelect = document.getElementById('staff-select');
  const loginButton = document.getElementById('login-button');
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // State
  let currentLocation = null;
  let currentStaff = null;

  // Fetch locations on page load
  fetchLocations();

  // Event listeners
  locationSelect.addEventListener('change', handleLocationChange);
  staffSelect.addEventListener('change', handleStaffChange);
  loginButton.addEventListener('click', handleLogin);
  tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  /**
   * Fetch locations from API
   */
  async function fetchLocations() {
    try {
      // This will be replaced with actual API call
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      
      const locations = await response.json();
      
      // Populate location select
      locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.location_id;
        option.textContent = location.name;
        locationSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching locations:', error);
      // For development, add some dummy data
      addDummyLocations();
    }
  }

  /**
   * Add dummy locations for development
   */
  function addDummyLocations() {
    const dummyLocations = [
      { location_id: 1, name: 'Downtown' },
      { location_id: 2, name: 'Uptown' },
      { location_id: 3, name: 'Westside' }
    ];
    
    dummyLocations.forEach(location => {
      const option = document.createElement('option');
      option.value = location.location_id;
      option.textContent = location.name;
      locationSelect.appendChild(option);
    });
  }

  /**
   * Handle location change
   */
  async function handleLocationChange() {
    const locationId = locationSelect.value;
    
    // Reset staff select
    staffSelect.innerHTML = '<option value="">Select a staff member</option>';
    staffSelect.disabled = !locationId;
    loginButton.disabled = true;
    
    if (!locationId) {
      currentLocation = null;
      return;
    }
    
    currentLocation = locationId;
    
    try {
      // This will be replaced with actual API call
      const response = await fetch(`/api/staff/${locationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      
      const staffMembers = await response.json();
      
      // Populate staff select
      staffMembers.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff.staff_id;
        option.textContent = staff.name;
        staffSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching staff:', error);
      // For development, add some dummy data
      addDummyStaff(locationId);
    }
  }

  /**
   * Add dummy staff for development
   */
  function addDummyStaff(locationId) {
    const dummyStaff = [
      { staff_id: 1, name: 'John Doe', location_id: 1 },
      { staff_id: 2, name: 'Jane Smith', location_id: 1 },
      { staff_id: 3, name: 'Bob Johnson', location_id: 2 },
      { staff_id: 4, name: 'Alice Brown', location_id: 2 },
      { staff_id: 5, name: 'Charlie Wilson', location_id: 3 }
    ];
    
    const filteredStaff = dummyStaff.filter(staff => staff.location_id == locationId);
    
    filteredStaff.forEach(staff => {
      const option = document.createElement('option');
      option.value = staff.staff_id;
      option.textContent = staff.name;
      staffSelect.appendChild(option);
    });
  }

  /**
   * Handle staff change
   */
  function handleStaffChange() {
    const staffId = staffSelect.value;
    loginButton.disabled = !staffId;
    currentStaff = staffId ? staffId : null;
  }

  /**
   * Handle login
   */
  function handleLogin() {
    if (!currentLocation || !currentStaff) {
      return;
    }
    
    // Hide login section and show dashboard
    loginSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    
    // Load initial data
    loadInventory();
  }

  /**
   * Switch between tabs
   */
  function switchTab(tabId) {
    // Update active tab button
    tabButtons.forEach(button => {
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update active tab panel
    tabPanels.forEach(panel => {
      if (panel.id === `${tabId}-tab`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    
    // Load data based on active tab
    switch (tabId) {
      case 'inventory':
        loadInventory();
        break;
      case 'deliveries':
        // loadDeliveries();
        break;
      case 'sales':
        // loadSales();
        break;
      case 'stock':
        // loadStockForm();
        break;
      case 'reports':
        // loadReports();
        break;
    }
  }

  /**
   * Load inventory data
   */
  async function loadInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '<p>Loading inventory...</p>';
    
    try {
      // This will be replaced with actual API call
      const response = await fetch(`/api/inventory/${currentLocation}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      
      const inventory = await response.json();
      
      // Create inventory table
      let html = `
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Cost</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      inventory.forEach(item => {
        const value = (item.quantity * item.ingredient.cost).toFixed(2);
        html += `
          <tr>
            <td>${item.ingredient.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>$${item.ingredient.cost.toFixed(2)}</td>
            <td>$${value}</td>
          </tr>
        `;
      });
      
      html += `
          </tbody>
        </table>
      `;
      
      inventoryList.innerHTML = html;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      inventoryList.innerHTML = '<p>Error loading inventory. Please try again later.</p>';
      
      // For development, add some dummy data
      addDummyInventory();
    }
  }

  /**
   * Add dummy inventory for development
   */
  function addDummyInventory() {
    const inventoryList = document.getElementById('inventory-list');
    
    const dummyInventory = [
      { ingredient: { name: 'Lettuce', cost: 2.50 }, quantity: 10, unit: 'kg' },
      { ingredient: { name: 'Tomato', cost: 3.00 }, quantity: 5, unit: 'kg' },
      { ingredient: { name: 'Cucumber', cost: 1.75 }, quantity: 8, unit: 'kg' },
      { ingredient: { name: 'Carrot', cost: 1.50 }, quantity: 7, unit: 'kg' },
      { ingredient: { name: 'Chicken', cost: 5.00 }, quantity: 15, unit: 'kg' }
    ];
    
    let html = `
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Cost</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    dummyInventory.forEach(item => {
      const value = (item.quantity * item.ingredient.cost).toFixed(2);
      html += `
        <tr>
          <td>${item.ingredient.name}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
          <td>$${item.ingredient.cost.toFixed(2)}</td>
          <td>$${value}</td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
    
    inventoryList.innerHTML = html;
  }
});
