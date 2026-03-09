// inventory.js Stable version 1.0.0.beta
let inventory = JSON.parse(localStorage.getItem('kitchenInv')) || [];

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
    const bagValue = parseInt(document.getElementById('bags').value) || 0;

    const item = {
        id: Date.now(),
        name: document.getElementById('itemName').value,
        location: document.getElementById('location').value,
        bins: (parseInt(document.getElementById('bins').value) || 0) * 1,
        cases: parseInt(document.getElementById('cases').value) || 0,
        bags: parseInt(document.getElementById('bags').value) || 0,
    };

    if (!item.name) return alert("Enter an item name!");

    inventory.push(item);
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
                const chixCs = i.cases * 25;
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
                                <div class="delete-btn" onclick="deleteItem(${i.id})" style="background: rgb(35, 7, 91); display: flex; justify-content: center; align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                    </svg>
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
function deleteItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    saveAndRender();
}
function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('bins').value = '';
    document.getElementById('cases').value = '';
    document.getElementById('bags').value = '';
}
// Initial Load
toggleInputs();
renderTables();