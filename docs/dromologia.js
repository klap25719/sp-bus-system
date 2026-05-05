const studentsList = [
    "Νίκος Ανδρεόπουλος", "Μαρία Παπαδοπούλου", "Ιωάννα Αντωνίου", "Σπυρίδων Δημητρίου",
    "Γεωργία Βασιλείου", "Δήμητρα Κωνσταντίνου", "Ιάσονας Χρηστίδης", "Χρήστος Αναστασίου",
    "Σταύρος Νικολάου", "Αναστασία Ελευθερίου", "Νάνσυ Αθανασίου", "Αντώνης Γεωργίου",
    "Ελένη Δασκαλάκη", "Πέτρος Λιάπης", "Σοφία Μακρή", "Αικατερίνη Δημητρίου",
    "Δημήτρης Παπαδόπουλος", "Κωνσταντίνα Λεονταρίου"
];

let currentSelection = [];
let routes = [];
let editIndex = null;

function loadFromStorage() {
    const saved = localStorage.getItem('schoolRoutes');
    if (saved) {
        routes = JSON.parse(saved);
        renderRoutes();
    }
    updateStats();
}

function saveToStorage() {
    localStorage.setItem('schoolRoutes', JSON.stringify(routes));
    updateStats();
}

function updateStats() {
    const totalStudentsElem = document.getElementById('totalStudents');
    const totalRoutesElem = document.getElementById('totalRoutes');
    const totalAssignedElem = document.getElementById('totalAssigned');
    
    if (totalStudentsElem) totalStudentsElem.innerText = studentsList.length;
    if (totalRoutesElem) totalRoutesElem.innerText = routes.length;
    if (totalAssignedElem) {
        const assignedCount = routes.reduce((sum, r) => sum + r.students.length, 0);
        totalAssignedElem.innerText = assignedCount;
    }
}

//Show students with filter
function renderStudents(filterText = '') {
    const list = document.getElementById('studentList');
    if (!list) return;
    
    const filtered = studentsList.filter(s => s.toLowerCase().includes(filterText.toLowerCase()));
    list.innerHTML = '';
    if (filtered.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:#9ca3af;">❌ Δεν βρέθηκαν μαθητές</div>';
        return;
    }
    filtered.forEach(name => {
        const isChecked = currentSelection.includes(name);
        const escapedName = name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        list.innerHTML += `<div class='row'><input type='checkbox' value='${escapedName}' ${isChecked ? 'checked' : ''}><span title="${name}">${name}</span></div>`;
    });
    updateSelectionInfo();
}

function updateSelectionInfo() {
    const checks = [...document.querySelectorAll('#studentList input:checked')];
    const count = checks.length;
    const infoElem = document.getElementById('selectionInfo');
    if (infoElem) infoElem.innerHTML = `${count} επιλεγμένοι ${count > 0 ? '✓' : ''}`;
}

function confirmSelection() {
    const checks = [...document.querySelectorAll('#studentList input:checked')];
    currentSelection = checks.map(c => c.value);
    renderSelectedList();
    updateSelectionInfo();
    showToast('✅ Οι μαθητές επιλέχθηκαν!', '#16a34a');
}

function renderSelectedList() {
    const box = document.getElementById('selectedList');
    if (!box) return;
    
    if (currentSelection.length === 0) {
        box.innerHTML = '<div style="text-align:center;padding:25px;color:#9ca3af;">✨ Κανένας επιλεγμένος μαθητής</div>';
        return;
    }
    box.innerHTML = currentSelection.map((n, i) => `<div class='route'><div style="flex:1;word-break:break-word;"><strong>${i + 1}.</strong> ${n}</div><button onclick="removeFromSelection('${n.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" style="background:#fee2e2;color:#dc2626;padding:4px 8px;font-size:11px;border-radius:6px;">✖</button></div>`).join('');
}

function removeFromSelection(name) {
    currentSelection = currentSelection.filter(s => s !== name);
    renderSelectedList();
    renderStudents(document.getElementById('searchStudent')?.value || '');
    showToast(`Ο/Η ${name.split(' ')[0]} αφαιρέθηκε`, '#f59e0b');
}

function saveRoute() {
    const nameInput = document.getElementById('routeName');
    if (!nameInput) return;
    
    const name = nameInput.value.trim();
    if (!name) {
        showToast('⚠️ Εισάγετε όνομα δρομολογίου!', '#f59e0b');
        return;
    }
    if (currentSelection.length === 0) {
        showToast('⚠️ Επιλέξτε τουλάχιστον έναν μαθητή!', '#f59e0b');
        return;
    }

    if (editIndex !== null) {
        routes[editIndex] = { name, students: [...currentSelection] };
        showToast(`✏️ Το "${name}" τροποποιήθηκε!`, '#0ea5e9');
        editIndex = null;
        const editBtn = document.querySelector('.info');
        if (editBtn) editBtn.textContent = '✏️ Τροποποίηση';
    } else {
        routes.push({ name, students: [...currentSelection] });
        showToast(`✅ Το "${name}" καταχωρήθηκε!`, '#16a34a');
    }

    saveToStorage();
    renderRoutes();
    newRoute();
}

function editRoute(index) {
    const route = routes[index];
    const nameInput = document.getElementById('routeName');
    if (nameInput) nameInput.value = route.name;
    currentSelection = [...route.students];
    renderSelectedList();
    renderStudents(document.getElementById('searchStudent')?.value || '');
    editIndex = index;
    const editBtn = document.querySelector('.info');
    if (editBtn) {
        editBtn.textContent = '💾 Αποθήκευση';
        editBtn.style.background = '#0ea5e9';
    }
    showToast(`✏️ Επεξεργασία: ${route.name}`, '#0ea5e9');
}

function editSelectedRoute() {
    if (editIndex !== null) {
        saveRoute();
    } else {
        showToast('ℹ️ Επιλέξτε δρομολόγιο από τη λίστα', '#6b7280');
    }
}

function deleteRoute(index) {
    if (confirm(`Διαγραφή του "${routes[index].name}";`)) {
        routes.splice(index, 1);
        saveToStorage();
        renderRoutes();
        if (editIndex === index) newRoute();
        showToast('🗑️ Διαγράφηκε!', '#dc2626');
    }
}

function copyRoute(index) {
    const route = routes[index];
    const newName = `${route.name} (αντίγραφο)`;
    routes.push({ name: newName, students: [...route.students] });
    saveToStorage();
    renderRoutes();
    showToast(`📋 Αντιγράφηκε "${route.name}"`, '#0ea5e9');
}

function renderRoutes() {
    const area = document.getElementById('savedRoutes');
    if (!area) return;
    
    if (routes.length === 0) {
        area.innerHTML = `<div class="empty-state"><div>📭</div><div>Δεν υπάρχουν αποθηκευμένα δρομολόγια</div><div style="font-size:11px;margin-top:5px;">Δημιουργήστε το πρώτο σας δρομολόγιο!</div></div>`;
        return;
    }
    area.innerHTML = routes.map((r, i) => `<div class='route'>
        <div style="flex:1;min-width:0;">
            <div class="route-name">${i + 1}. ${r.name} <span class="badge badge-primary">${r.students.length} μαθητές</span></div>
            <div class="route-students">${r.students.join(', ')}</div>
        </div>
        <div class="route-actions">
            <button onclick="editRoute(${i})" style="background:#0ea5e9;color:#fff;" title="Επεξεργασία">✏️</button>
            <button onclick="copyRoute(${i})" style="background:#8b5cf6;color:#fff;" title="Αντιγραφή">📋</button>
            <button onclick="deleteRoute(${i})" style="background:#dc2626;color:#fff;" title="Διαγραφή">🗑️</button>
        </div>
    </div>`).join('');
}

function newRoute() {
    const nameInput = document.getElementById('routeName');
    if (nameInput) nameInput.value = '';
    
    document.querySelectorAll('#studentList input').forEach(c => c.checked = false);
    currentSelection = [];
    renderSelectedList();
    editIndex = null;
    const editBtn = document.querySelector('.info');
    if (editBtn) {
        editBtn.textContent = '✏️ Τροποποίηση';
        editBtn.style.background = '#0ea5e9';
    }
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) searchInput.value = '';
    renderStudents('');
    showToast('🆕 Νέο δρομολόγιο - Επιλέξτε μαθητές', '#6b7280');
}

function clearAllRoutes() {
    if (confirm('⚠️ ΠΡΟΣΟΧΗ! Θα διαγραφούν ΟΛΑ τα δρομολόγια. Είστε σίγουρος;')) {
        routes = [];
        saveToStorage();
        renderRoutes();
        newRoute();
        showToast('🗑️ Όλα τα δρομολόγια διαγράφηκαν!', '#dc2626');
    }
}

function showToast(message, color) {
    // Αφαίρεση τυχόν υπάρχοντος toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast-message';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = color;
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '10px';
    toast.style.zIndex = '1000';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '13px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.animation = 'slideUp 0.3s ease';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

const searchInput = document.getElementById('searchStudent');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderStudents(e.target.value);
    });
}

renderStudents('');
loadFromStorage();