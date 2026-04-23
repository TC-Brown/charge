class Order { 
    constructor() {
        this._menu = [];
        this._previousSales = [];
        this._invoiceNumber = this.generateInvoice();
        this._order = [];
        this._payment = { 
            payments: [],
            currentAmount: 0,
            currentType: "",
            changeTip: 0
        };
    }

    generateInvoice() {
        return "INV-" + Math.floor(Math.random() * 10000);
    }

    get menu() { 
        return this._menu;
    }

    set menu(menuArray) {
        this._menu = [];
        menuArray.forEach(menuItem => {
            let currItem = {
                sku: menuItem[0],
                description: menuItem[1],
                price: menuItem[2],
                taxRate: menuItem[3],
                image: menuItem[4]
            };
            this._menu.push(currItem);
        });
    }

    loadMenu() {
        const menuContainer = document.getElementById("menu");
        menuContainer.innerHTML = "";
        this._menu.forEach(item => {
            const figure = document.createElement("figure");
            figure.className = "menu-item";
            figure.style.width = "150px";
            figure.style.cursor = "pointer";
            figure.onclick = () => this.addItem(item.sku);
            
            figure.innerHTML = `
                <img src="${item.image}" alt="img not available" class="menu-item">
                <figcaption>${item.description}</figcaption>
                <figcaption>$${item.price.toFixed(2)}</figcaption>
            `;
            menuContainer.appendChild(figure);
        });
        document.getElementById("invoice-number").innerText = "Invoice #" + this._invoiceNumber;
    }

    addItem(sku) {
        const menuItem = this._menu.find(i => i.sku === sku);
        if (!menuItem) return;

        const existingItem = this._order.find(i => i.sku === sku);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this._order.push({ ...menuItem, quantity: 1 });
        }
        this.renderReceipt();
    }

    removeItem(sku) {
        const itemIndex = this._order.findIndex(i => i.sku === sku);
        if (itemIndex > -1) {
            if (this._order[itemIndex].quantity > 1) {
                this._order[itemIndex].quantity -= 1;
            } else {
                this._order.splice(itemIndex, 1);
            }
        }
        this.renderReceipt();
    }

    clearOrder() {
        if (this._order.length === 0) return;
        if (confirm("Are you sure you want to clear the entire order?")) {
            this._order = [];
            this.resetPayment();
            this.renderReceipt();
        }
    }

    getTotalDue() {
        let subtotal = 0;
        let tax = 0;
        this._order.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            tax += itemSubtotal * item.taxRate;
        });
        return subtotal + tax;
    }

    updateSummary() {
        let subtotal = 0;
        let tax = 0;
        
        this._order.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            tax += itemSubtotal * item.taxRate;
        });

        const total = subtotal + tax;
        
        document.getElementById("subtotal-summary").innerText = subtotal.toFixed(2);
        document.getElementById("subtotal-tax").innerText = tax.toFixed(2);
        document.getElementById("total-summary").innerText = total.toFixed(2);

        this.updatePaymentSummary(total);
    }

    updatePaymentSummary(total) {
        let pastPaymentsTotal = this._payment.payments.reduce((sum, p) => sum + p.amount, 0);
        let totalPaid = pastPaymentsTotal + this._payment.currentAmount;
        
        document.getElementById("amount-paid").innerText = totalPaid.toFixed(2);

        // Determine Payment Type Display
        let types = new Set(this._payment.payments.map(p => p.type));
        if (this._payment.currentType && this._payment.currentAmount > 0) {
            types.add(this._payment.currentType);
        }
        let typeStr = "";
        if (types.size === 0) typeStr = "";
        else if (types.size === 1) typeStr = Array.from(types)[0];
        else typeStr = "Split Payment";

        document.getElementById("payment-type").innerText = typeStr;

        let changeTip = totalPaid - total;
        if (changeTip < 0 || this._order.length === 0) changeTip = 0;
        
        this._payment.changeTip = changeTip;
        document.getElementById("tip-change-amount").innerText = changeTip.toFixed(2);

        let remainingBalance = total - totalPaid;
        if (remainingBalance < 0) remainingBalance = 0;

        // Update Paypad Display
        document.getElementById("paypad-current-amount").innerText = this._payment.currentAmount.toFixed(2);
        document.getElementById("paypad-balance-amount").innerText = remainingBalance.toFixed(2);

        if (totalPaid >= total && total > 0) {
            document.getElementById("close-sale").style.display = "block";
        } else {
            document.getElementById("close-sale").style.display = "none";
        }
    }

    renderReceipt() {
        const tbody = document.getElementById("receipt-body");
        tbody.innerHTML = "";

        this._order.forEach(item => {
            const tr = document.createElement("tr");
            const subtotal = item.price * item.quantity;
            
            tr.innerHTML = `
                <td class="description">${item.description}</td>
                <td class="quantity">${item.quantity}</td>
                <td class="price">${item.price.toFixed(2)}</td>
                <td class="subtotal">${subtotal.toFixed(2)}</td>
                <td class="delete" style="cursor:pointer;" onclick="pos.removeItem('${item.sku}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </td>
            `;
            tbody.appendChild(tr);
        });

        this.updateSummary();
    }

    assignPaymentType(type) {
        if (this._order.length === 0) return alert("Please add items to the order first.");
        
        // Save previous payment if there's an amount and we're switching types
        if (this._payment.currentType && this._payment.currentType !== type && this._payment.currentAmount > 0) {
            this._payment.payments.push({ type: this._payment.currentType, amount: this._payment.currentAmount });
            this._payment.currentAmount = 0;
        }

        this._payment.currentType = type;
        
        let total = this.getTotalDue();
        let pastPaymentsTotal = this._payment.payments.reduce((sum, p) => sum + p.amount, 0);
        let remainingBalance = total - pastPaymentsTotal;
        if (remainingBalance < 0) remainingBalance = 0;

        if (type === "Cash") {
            document.getElementById("payment-overlay").style.display = "grid";
        } else if (type === "Card") {
            this._payment.currentAmount = remainingBalance;
            document.getElementById("payment-overlay").style.display = "grid";
        }
        this.updateSummary();
    }

    paypadInput(val) {
        if (val === "clear") {
            this._payment.currentAmount = 0;
        } else if (val === "back") {
            let str = this._payment.currentAmount.toFixed(2).replace(".", "");
            str = str.slice(0, -1);
            if (!str) str = "0";
            this._payment.currentAmount = parseInt(str) / 100;
        } else {
            let str = this._payment.currentAmount.toFixed(2).replace(".", "");
            str += val;
            this._payment.currentAmount = parseInt(str) / 100;
        }
        this.updateSummary();
    }

    closeSale() {
        if (this._payment.currentAmount > 0) {
            this._payment.payments.push({ type: this._payment.currentType, amount: this._payment.currentAmount });
        }
        
        const saleData = {
            invoice: this._invoiceNumber,
            order: [...this._order],
            payment: { ...this._payment },
            date: new Date().toISOString()
        };
        this._previousSales.push(saleData);

        this._order = [];
        this._invoiceNumber = this.generateInvoice();
        this.resetPayment();
        document.getElementById("payment-overlay").style.display = "none";
        this.renderReceipt();
        this.loadMenu();
        alert("Sale closed successfully! Invoice: " + saleData.invoice);
    }

    resetPayment() {
        this._payment = { payments: [], currentAmount: 0, currentType: "", changeTip: 0 };
    }
}

const pos = new Order();

// Mock DB 
const mockMenu = [
    ["101", "Burger", 5.99, 0.06, "fries.jpg"],
    ["102", "Fries", 1.99, 0.06, "fries.jpg"],
    ["103", "Drink", 1.49, 0.06, "seal.jpg"],
    ["104", "Salad", 4.99, 0.06, "seal.jpg"]
];

pos.menu = mockMenu;
pos.loadMenu();
pos.renderReceipt();

// Event Listeners
document.querySelector(".toolbar .delete").addEventListener("click", () => {
    pos.clearOrder();
});

document.querySelector(".toolbar .cash").addEventListener("click", () => {
    pos.assignPaymentType("Cash");
});

document.querySelector(".toolbar .card").addEventListener("click", () => {
    pos.assignPaymentType("Card");
});

document.querySelectorAll(".paypad-btn").forEach(btn => {
    if(btn.id !== "close-sale") {
        btn.addEventListener("click", (e) => {
            const val = e.target.dataset.id;
            pos.paypadInput(val);
        });
    }
});

document.getElementById("close-sale").addEventListener("click", () => {
    pos.closeSale();
});

document.querySelector(".close-paypad").addEventListener("click", () => {
    document.getElementById("payment-overlay").style.display = "none";
});

// Physical Keyboard Support
document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("payment-overlay");
    if (overlay.style.display !== "grid") return; // Only process when paypad is open

    const key = e.key;

    if (key >= '0' && key <= '9') {
        pos.paypadInput(key);
    } else if (key === "Backspace") {
        pos.paypadInput("back");
    } else if (key === "Escape" || key === "c" || key === "C") {
        pos.paypadInput("clear");
    } else if (key === "Enter") {
        const closeBtn = document.getElementById("close-sale");
        if (closeBtn.style.display === "block") {
            pos.closeSale();
        }
    }
});
// Stoped @ 1:31:44 