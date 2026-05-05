const dashboard = document.getElementById('dashboard');
const offlineWarning = document.getElementById('offlineWarning');

let isOnline = true;

function checkConnection() {
    const randomStatus = Math.random() > 0.1;
    isOnline = randomStatus;

    if (isOnline) {
        offlineWarning.classList.remove('show');
    } else {
        offlineWarning.classList.add('show');
    }

    const tables = document.querySelectorAll('.data-table');

    tables.forEach(table => {
        table.style.opacity = isOnline ? '1' : '0.7';
    });
}

function simulateOffline() {
    isOnline = false;
    checkConnection();
}

function simulateOnline() {
    isOnline = true;
    checkConnection();
}

checkConnection();
setInterval(checkConnection, 10000);

console.log('Dashboard loaded successfully');