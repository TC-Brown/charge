// Repository Button
const repoBtn = document.getElementById('repos');
repoBtn.addEventListener('click', () => {
    window.location.href = 'https://github.com/TC-Brown';
});

// Point-of-Sale Button
const posBtn = document.getElementById('pos');
posBtn.addEventListener('click', () => {
    window.location.href = 'apps/pos/index.html';
});

// Invenetory Button
const invBtn = document.getElementById('inventory');
invBtn.addEventListener('click', () => {
    window.location.href = 'apps/inventory/index.html';
});

// Prep Button
const prepBtn = document.getElementById('prep');
prepBtn.addEventListener('click', () => {
    window.location.href = 'apps/prep/index.html';
});