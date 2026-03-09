// load menu
// add items to order/receipt
// remove items from order/receipt
// update summary
// clear order/receipt
// open paypad
// assign payment type
// input payment buttons

//close sale and save/ send data

class Order { 
    constructor() {
        this._menu = [];
        this._previousSales = [];
        this._invoiceNumber = "";
        this._order = [];
        this._payment = { 
            amoountPaid: 0,
            type: "",
            changeTip: 0
        };
    }
    get menu() { 
        return this._menu;
    }
// make input validation for menu items
    set menu(menuArray) {
        this._menu = [];

        menuArray.forEach(menuItem => {
            let currItem = {};
            currItem.sku = menuItem[0];
            currItem.description = menuItem[1];
            currItem.price = menuItem[2];
            currItem.taxRate = menuItem[3];
            currItem.image = menuItem[4];
            this._menu.push(currItem);
        });
    }
}



// Stoped @ 1:31:44 