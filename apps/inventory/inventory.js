// inventory.js Stable version 1.0.0.beta
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
function renderTables() {
    const container = document.getElementById('inventoryDisplay');
    const locations = ['Freezer', 'Walk-in', 'Wing Street'];

    container.innerHTML = locations.map(loc => {
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
            let totalStr = '';
            if (i.name === 'Bacon') {
                const bacBg = i.bags * 5;
                const bacCs = i.cases * 20;
                const bacTotal = bacBg + bacCs;
                totalStr = `${bacTotal}`;
            }
            else if (i.name === 'Beef') {
                const beefBg = i.bags * 5;
                const beefCs = i.cases * 40;
                const beefTotal = beefBg + beefCs;
                totalStr = `${beefTotal}`;
            }
            else if (i.name === 'Cheese') {
                const cheeseBg = i.bags * 20;
                const cheeseCs = i.cases * 20;
                const cheeseTotal = cheeseBg + cheeseCs;
                totalStr = `${cheeseTotal}`;
            }
            else if (i.name === 'Chicken') {
                const chixBg = i.bags * 2.5;
                const chixCs = i.cases * 20;
                const chixTotal = chixBg + chixCs;
                totalStr = `${chixTotal}`;
            }
            else if (i.name === 'It. Sausage') {
                const itSgBg = i.bags * 5;
                const itSgCs = i.cases * 40;
                const itSgTotal = itSgBg + itSgCs;
                totalStr = `${itSgTotal}`;
            }
            else if (i.name === 'Pepperoni') {
                const pepBg = i.bags * 12.5;
                const pepCs = i.cases * 25;
                const pepTotal = pepBg + pepCs;
                totalStr = `${pepTotal}`;
            }
            else if (i.name === 'Pork') {
                const porkBg = i.bags * 5;
                const porkCs = i.cases * 40;
                const porkTotal = porkBg + porkCs;
                totalStr = `${porkTotal}`;
            }
            else if (i.name === 'Lg. Handtossed') {
                const lgHtBg = i.bags * 1;
                const lgHtCs = i.cases * 32;
                const lgHtBin = i.bins * 6;
                const lgHtTotal = lgHtBg + lgHtCs + lgHtBin;
                totalStr = `${lgHtTotal}`;
            }
            else if (i.name === 'Wings Boneless') {
                const wbBg = i.bags * 1;
                const wbCs = i.cases * 10;
                const wbTotal = wbBg + wbCs;
                totalStr = `${wbTotal}`;
            }
            else if (i.name === 'Wings Traditional') {
                const wtBg = i.bags * 1;
                const wtCs = i.cases * 10;
                const wtTotal = wtBg + wtCs;
                totalStr = `${wtTotal}`;
            }
            else {
                totalStr = `Item not found`;     /* get material .ico for delete button */
            }

            return `
                        <tr>
                            <td>${i.name}</td>
                            ${loc === 'Walk-in' ? `<td>${i.bins}</td>` : ''}
                            ${loc !== 'Wing Street' ? `<td>${i.cases}</td>` : '' ? `<td>${i.bags}</td>` : ''}
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
toggleInputs();
renderTables();