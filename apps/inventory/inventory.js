let inventory = JSON.parse(localStorage.getItem('kitchenInv')) || [];
let editingItemId = null;

function toggleInputs() {
    const loc = document.getElementById('location').value;
    const binInput = document.getElementById('bins');
    const casesInput = document.getElementById('cases');
    const bagsInput = document.getElementById('bags');

    binInput.style.display = (loc === 'Walk-in') ? 'block' : 'none';
    casesInput.style.display = (loc === 'Wing Street') ? 'none' : 'block';
    bagsInput.style.display = 'block';
}
function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemLoc = document.getElementById('location').value;

    if (!itemName) return alert("Enter an item name!");
    if (!itemLoc) return alert("Select a location!");

    const item = {
        id: editingItemId ? editingItemId : Date.now(),
        name: itemName,
        location: itemLoc,
        bins: (parseInt(document.getElementById('bins').value) || 0) * 1,
        cases: parseInt(document.getElementById('cases').value) || 0,
        bags: parseInt(document.getElementById('bags').value) || 0,
    };

    if (editingItemId) {
        inventory = inventory.map(i => i.id === editingItemId ? item : i);
    } else {
        inventory.push(item);
    }
    
    saveAndRender();
    clearForm();
}
function saveAndRender() {
    localStorage.setItem('kitchenInv', JSON.stringify(inventory));
    renderTables();
}
function getItemTotal(i) {
    if (i.name === 'Bacon') return (i.bags * 5) + (i.cases * 20);
    if (i.name === 'Beef') return (i.bags * 5) + (i.cases * 40);
    if (i.name === 'Cheese') return (i.bags * 20) + (i.cases * 20);
    if (i.name === 'Chicken') return (i.bags * 2.5) + (i.cases * 20);
    if (i.name === 'It. Sausage') return (i.bags * 5) + (i.cases * 40);
    if (i.name === 'Pepperoni') return (i.bags * 12.5) + (i.cases * 25);
    if (i.name === 'Pork') return (i.bags * 5) + (i.cases * 40);
    if (i.name === 'Lg. Handtossed') return (i.bags * 1) + (i.cases * 32) + ((i.bins || 0) * 6);
    if (i.name === 'Wings Boneless') return (i.bags * 1) + (i.cases * 10);
    if (i.name === 'Wings Traditional') return (i.bags * 1) + (i.cases * 10);
    return null;
}

function renderTables() {
    const container = document.getElementById('inventoryDisplay');
    const locations = ['Freezer', 'Walk-in', 'Wing Street'];

    let html = locations.map(loc => {
        const items = inventory.filter(i => i.location === loc);
        return `
            <h3>${loc}</h3>
            <table>
                <thead> <!-- Table headers -->
                        <tr>
                            <th>Item</th>
                            ${loc === 'Walk-in' ? '<th>Bins</th>' : ''}
                            ${loc !== 'Wing Street' ? '<th>Cases</th>' : ''}
                            <th>Bags</th>
                            <th>Action</th>
                            <th>Total</th>
                        </tr>
                </thead>
                <tbody> <!-- Render tables -->
                    ${items.map(i => {
            const total = getItemTotal(i);
            const totalStr = total !== null ? `${total}` : `Item not found`;

            return `
                        <tr>
                            <td>${i.name}</td>
                            ${loc === 'Walk-in' ? `<td>${i.bins}</td>` : ''}
                            ${loc !== 'Wing Street' ? `<td>${i.cases}</td>` : ''}
                            <td>${i.bags}</td>
                            <td>
                                <div style="display: flex; gap: 5px; justify-content: center;">
                                    <div class="edit-btn" onclick="editItem(${i.id})" title="Edit" style="background: rgb(20, 80, 20); display: flex; justify-content: center; align-items: center; border-radius: 4px; padding: 4px; cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q11 11 17 26t6 31q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                        </svg>
                                    </div>
                                    <div class="delete-btn" onclick="deleteItem(${i.id})" title="Delete" style="background: rgb(35, 7, 91); display: flex; justify-content: center; align-items: center; border-radius: 4px; padding: 4px; cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                        </svg>
                                    </div>
                                </div>
                            </td>
                            <td>${totalStr}</td>
                        </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }).join('');

    const allItems = [
        'Lg. Handtossed', 'Bacon', 'Beef', 'Cheese', 'Chicken',
        'It. Sausage', 'Pepperoni', 'Pork', 'Wings Boneless', 'Wings Traditional'
    ];

    const combinedTotals = {};
    allItems.forEach(item => combinedTotals[item] = 0);

    inventory.forEach(i => {
        const total = getItemTotal(i);
        if (total !== null && combinedTotals[i.name] !== undefined) {
            combinedTotals[i.name] += total;
        }
    });

    html += `
        <div class="combined-totals-container" style="margin-top: 30px;">
            <h3 style="border-top: 2px solid #ccc; padding-top: 15px;">Combined Totals</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${allItems.map(name => `
                    <tr>
                        <td>${name}</td>
                        <td>${combinedTotals[name]}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}
function editItem(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    editingItemId = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('location').value = item.location;
    document.getElementById('bins').value = item.bins || '';
    document.getElementById('cases').value = item.cases || '';
    document.getElementById('bags').value = item.bags || '';
    
    toggleInputs();
    
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) actionBtn.innerText = "Update Item";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function deleteItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    saveAndRender();
}
function clearForm() {
    editingItemId = null;
    const actionBtn = document.getElementById('actionBtn');
    if (actionBtn) actionBtn.innerText = "Add to Inventory";

    document.getElementById('itemName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('bins').value = '';
    document.getElementById('cases').value = '';
    document.getElementById('bags').value = '';
    toggleInputs();
}
// Initial Load
/* toggleInputs(); */
renderTables();