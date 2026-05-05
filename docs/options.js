const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role');
const box = document.getElementById('options-box');
const title = document.getElementById('role-title');

const data = {
    'parents': { title: 'Γονείς / Υπάλληλοι', menu: ['Δήλωση Απουσίας / Αιτήματος', 'Τροποποίηση Δήλωσης'] },
    'drivers': { title: 'Οδηγοί', menu: ['Προβολή Δρομολογίου', 'Αναφορά Προβλήματος'] },
    'office': { title: 'Υπεύθυνος Κίνησης', menu: ['Καθορισμός Δρομολογίων', 'Καθορισμός Τακτικών Μαθητών','Δήλωση Απουσίας / Αιτήματος', 'Προβολή & Τροποποίηση', 'Έλεγχος & Οριστικοποίηση'] },
    'director': { title: 'Διευθυντής', menu: ['Προβολή στατιστικών'] }
};

if (role === 'drivers') {
    window.location.href = 'dashboard.html?role=drivers';
} else if (data[role]) {
    title.innerText = data[role].title;
    data[role].menu.forEach(item => {
        const a = document.createElement('a');
        let targetUrl = `dashboard.html?role=${role}`;
                
        // Director
        if (role === 'director' && item === 'Προβολή στατιστικών') {
            targetUrl += '&view=stats';
        // Office
        } else if (role === 'office' && item === 'Καθορισμός Δρομολογίων') {
            targetUrl += '&view=routes';
        } else if (role === 'office' && item === 'Δήλωση Απουσίας / Αιτήματος') {
            targetUrl += '&view=absence';
        //Parents
        } else if (role === 'parents' && item === 'Δήλωση Απουσίας / Αιτήματος') {
            targetUrl += '&view=absence';
        } else if (role === 'parents' && item === 'Τροποποίηση Δήλωσης') {
            targetUrl += '&view=modify';
        }
                
        a.href = targetUrl;
        a.className = 'option-btn';
        a.innerText = item;
        box.appendChild(a);
    });
}