// Navigation Function
function nav(id) {
    if (id === 'repos') {
        window.location.href = "apps/repos/index.html";
    } else if (id === 'inventory') {
        window.location.href = "apps/inventory/index.html";
    } else if (id === 'prep') {
        window.location.href = "apps/prep/index.html";
    } else { 
        alert("Error: \nApp '" + id + "' does not exist.");
    }
}

// Message Function
function msg() {
    alert("This page has been disabled by the developer.");
}