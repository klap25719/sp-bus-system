const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role');
const view = urlParams.get('view');

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const menuList = document.getElementById('menu-list');
const menuTitle = document.getElementById('menu-title');
const mainContent = document.getElementById("main-content");
const closeBtn = document.getElementById("close-btn");
const dynamicContent = document.getElementById("dynamic-content");
const welcomeTitle = document.getElementById("welcome-title");

const roleData = {
    'parents': { title: 'Γονείς / Υπάλληλοι', items: ['Δήλωση Aπουσίας / Αιτήματος', 'Τροποποίηση δήλωσης'] },
    'office': { title: 'Υπεύθυνος Κίνησης', items: ['Καθορισμός Δρομολογίων', 'Καθορισμός Τακτικών Μαθητών','Δήλωση Απουσίας / Αιτήματος', 'Προβολή & Τροποποίηση', 'Έλεγχος & Οριστικοποίηση'] },
    'director': { title: 'Διευθυντής', items: ['Προβολή στατιστικών'] }
};

// Special case for drivers (no sidebar)
if (role === 'drivers') {
    if(sidebar) sidebar.remove();
    if(menuToggle) menuToggle.remove();
    mainContent.style.setProperty('padding-top', '120px', 'important');
    mainContent.style.setProperty('padding-left', '20px', 'important');
    mainContent.style.marginLeft = "20px";
    const backBtn = document.createElement('a');
    backBtn.href = "index.html";
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Επιστροφή στην Αρχική';
    backBtn.style.cssText = `position: fixed; top: 20px; left: 20px; background: #0047ab; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; z-index: 10000; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
    document.body.appendChild(backBtn);
    welcomeTitle.innerText = "Οδηγοί - Πίνακας Ελέγχου";
    dynamicContent.innerHTML = "<p>Εδώ θα εμφανίζονται οι επιλογές για τους οδηγούς.</p>";
} else if (roleData[role]) {
    menuTitle.innerHTML = `<i class="fas fa-bars"></i> ${roleData[role].title}`;
    menuList.innerHTML = '';
            
    roleData[role].items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.className = "menu-item";
        a.innerHTML = item;

        // Parents
        if (role === 'parents' && item === 'Δήλωση Απουσίας / Αιτήματος') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadAbsenceDeclaration();
            });
        } else if (role === 'office' && item === 'Δήλωση Απουσίας / Αιτήματος') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadAbsenceDeclaration();
            });
        } else if (role === 'parents' && item === 'Τροποποίηση Δήλωσης') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                dynamicContent.innerHTML = `<div class="card"><p>🔧 Λειτουργία "Τροποποίηση Δήλωσης" υπό ανάπτυξη.</p></div>`;
            });
        // Director
        } else if (role === 'director' && item === 'Προβολή στατιστικών') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadDirectorStats();
            });
        // Office
        } else if (role === 'office' && item === 'Καθορισμός Δρομολογίων') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadRouteManagement();
            });
        } else if (role === 'office' && item === 'Καθορισμός Τακτικών Μαθητών') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                dynamicContent.innerHTML = `<div class="card"><p>🔧 Λειτουργία "Καθορισμός Τακτικών Μαθητών" υπό ανάπτυξη.</p></div>`;
            });
        } else {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                dynamicContent.innerHTML = `<div class="card"><p>🔧 Λειτουργία "${item}" υπό ανάπτυξη.</p></div>`;
            });
        }
    
        li.appendChild(a);
        menuList.appendChild(li);
    });

    closeBtn.onclick = () => {
        sidebar.style.width = "0";
        mainContent.style.marginLeft = "20px";
        menuToggle.style.display = "block";
    };

    menuToggle.onclick = () => {
        sidebar.style.width = "300px";
        mainContent.style.marginLeft = "320px";
        menuToggle.style.display = "none";
    };

    if (role === 'parents' && view === 'absence') {
        setTimeout(() => {
            loadAbsenceDeclaration();
        }, 100);
    } else if (role === 'parents' && view === 'modify') {
        dynamicContent.innerHTML = `<div class="card"><p>🔧 Λειτουργία "Τροποποίηση Δήλωσης" υπό ανάπτυξη.</p></div>`;
    } else if (role === 'director' && view === 'stats') {
        loadDirectorStats();
    } else if (role === 'office' && view === 'routes') {
        loadRouteManagement();
    } else if (role === 'office' && view === 'absence') {
        setTimeout(() => {
            loadAbsenceDeclaration();
        }, 100);
    } else {
        // If there is not a view parameter, show the default message
        if (!view) {
            welcomeTitle.innerText = `${roleData[role]?.title || 'Πίνακας Διαχείρισης'} - Πίνακας Ελέγχου`;
            dynamicContent.innerHTML = "<p>Επιλέξτε μια ενέργεια από το πλευρικό μενού για να συνεχίσετε.</p>";
        }
    }
}

//Director statistics
function loadDirectorStats() {
    welcomeTitle.innerText = "Διευθυντής - Στατιστικά & Ιστορικό";
    dynamicContent.innerHTML = `
        <div class="stats-dashboard">
            <div id="offlineWarning" style="background:#ffe5d9; border-left:5px solid #c44536; padding:1rem; border-radius:1rem; margin-bottom:1.5rem; display:none;" class="offline-warning">
                ⚠️ <strong>Μη διαθεσιμότητα επικαιροποιημένων δεδομένων</strong><br>
                Λόγω ασταθούς σύνδεσης, τα δεδομένα που εμφανίζονται ενδέχεται να μην είναι πλήρως ενημερωμένα.
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.8rem; margin-bottom: 2rem;">
                <div class="card">
                    <h3>🚌 Ποσοστά ενεργών δρομολογίων</h3>
                    <div style="font-size: 2rem; font-weight: 800; color: #1e3a3f;">25 / 27</div>
                        <div style="background: #e2efe4; border-radius: 1rem; height: 1.2rem; width: 100%; overflow: hidden; margin: 0.8rem 0;">
                            <div style="background: #2c6e4f; height: 100%; width: 92.6%; border-radius: 1rem; display: flex; align-items: center; justify-content: flex-end; padding-right: 0.5rem; color: white; font-size: 0.7rem; font-weight: bold;">92.6%</div>
                        </div>
                        <div style="color: #577a7e; font-size: 0.85rem;">Σύνολο: 27 | Ενεργά: 25 | Ανενεργά: 2</div>
                    </div>

                    <div class="card">
                        <h3>📞 Πηγές δήλωσης απουσίας</h3>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                            <div style="width: 180px; height: 180px; border-radius: 50%; background: conic-gradient(#2c6e4f 0% 64%, #e0a800 64% 86%, #c44536 86% 100%);"></div>
                            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; font-size: 0.8rem;">
                                <div><span style="display: inline-block; width: 12px; height: 12px; background: #2c6e4f; border-radius: 2px;"></span> Γονείς: 64%</div>
                                <div><span style="display: inline-block; width: 12px; height: 12px; background: #e0a800; border-radius: 2px;"></span> Γραμματεία: 22%</div>
                                <div><span style="display: inline-block; width: 12px; height: 12px; background: #c44536; border-radius: 2px;"></span> Υπεύθ. Κίνησης: 14%</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3>📅 Ιστορικό πληρότητας δρομολογίων</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead><tr><th style="text-align:left; padding:0.5rem;">Ημερομηνία</th><th>Σύνολο μαθητών</th><th>Πληρότητα</th></tr></thead>
                            <tbody>
                                <tr><td style="padding:0.5rem;">28/04/2026</td><td>342</td><td>88%</td></tr>
                                <tr><td style="padding:0.5rem;">27/04/2026</td><td>338</td><td>87%</td></tr>
                                <tr><td style="padding:0.5rem;">26/04/2026</td><td>330</td><td>85%</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
                
            <div class="card" style="margin-bottom: 1.8rem;">
                <h3>⚠️ Μαθητές με περισσότερες αδήλωτες απουσίες</h3>
                <table class="data-table">
                    <thead>
                        <tr><th>Ονοματεπώνυμο</th><th>Τάξη</th><th>Αδήλωτες απουσίες (φετινό έτος)</th><th>Τελευταία αδήλωτη</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Αντωνίου Μαρία</td><td>Γ' Γυμνασίου</td><td>3</td><td>26/04/2026</td></tr>
                        <tr><td>Παπαδόπουλος Κωνσταντίνος</td><td>Α' Λυκείου</td><td>2</td><td>25/04/2026</td></tr>
                        <tr><td>Γεωργίου Ελένη</td><td>Γ' Λυκείου</td><td>1</td><td>22/04/2026</td></tr>
                        <tr><td>Νικολάου Ανδρέας</td><td>Β' Γυμνασίου</td><td>1</td><td>20/04/2026</td></tr>
                    </tbody>
                </table>
                <div class="info-note" style="background:#f9f3e3; padding:0.8rem; border-radius:1rem; margin-top:1rem;">
                    ℹ️ <strong>Σημείωση:</strong> Αδήλωτη απουσία ονομάζεται η περίπτωση όπου μαθητής απουσιάζει από δρομολόγιο 
                    χωρίς προηγούμενη ενημέρωση γονέα, υπαλλήλου ή υπευθύνου γραφείου κίνησης.
                </div>
            </div>
            
            <!--Table with percentages of active routes-->
            <div class="card">
                <h3>📊 Αναλυτικά ποσοστά δρομολογίων (Σύνολο: 27)</h3>
            
                <div class="filter-controls" style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
                    <button onclick="filterRoutes('all')" class="login-btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Όλα</button>
                    <button onclick="filterRoutes('active')" class="login-btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: #2c6e4f;">Ενεργά</button>
                    <button onclick="filterRoutes('inactive')" class="login-btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: #c44536;">Ανενεργά</button>
                </div>

                <div style="max-height: 400px; overflow-y: auto;">
                    <table class="data-table" id="routesTable">
                        <thead>
                            <tr><th>Δρομολόγιο</th><th>Περιοχή</th><th>Κατάσταση</th><th>Πληρότητα</th></tr>
                        </thead>
                        <tbody>
                            <tr data-status="active"><td>#1</td><td>Κηφισιά - Μαρούσι</td><td><span class="badge">Ενεργό</span></td><td>92%</td></tr>
                            <tr data-status="active"><td>#2</td><td>Χαλάνδρι - Αγία Παρασκευή</td><td><span class="badge">Ενεργό</span></td><td>88%</td></tr>
                            <tr data-status="active"><td>#4</td><td>Γλυφάδα - Βούλα</td><td><span class="badge">Ενεργό</span></td><td>79%</td></tr>
                            <tr data-status="active"><td>#5</td><td>Περιστέρι - Αιγάλεω</td><td><span class="badge">Ενεργό</span></td><td>84%</td></tr>
                            <tr data-status="active"><td>#6</td><td>Ίλιον - Πετρούπολη</td><td><span class="badge">Ενεργό</span></td><td>76%</td></tr>
                            <tr data-status="active"><td>#7</td><td>Άλιμος - Ελληνικό</td><td><span class="badge">Ενεργό</span></td><td>91%</td></tr>
                            <tr data-status="active"><td>#9</td><td>Νέα Σμύρνη - Καλλιθέα</td><td><span class="badge">Ενεργό</span></td><td>85%</td></tr>
                            <tr data-status="active"><td>#10</td><td>Ζωγράφου - Καισαριανή</td><td><span class="badge">Ενεργό</span></td><td>82%</td></tr>
                            <tr data-status="active"><td>#11</td><td>Βύρωνας - Παγκράτι</td><td><span class="badge">Ενεργό</span></td><td>78%</td></tr>
                            <tr data-status="active"><td>#12</td><td>Γαλάτσι - Πατήσια</td><td><span class="badge">Ενεργό</span></td><td>89%</td></tr>
                            <tr data-status="active"><td>#13</td><td>Μαρούσι - Πεύκη</td><td><span class="badge">Ενεργό</span></td><td>93%</td></tr>
                            <tr data-status="active"><td>#14</td><td>Βριλήσσια - Χαλάνδρι</td><td><span class="badge">Ενεργό</span></td><td>81%</td></tr>
                            <tr data-status="active"><td>#15</td><td>Αγία Παρασκευή - Γέρακας</td><td><span class="badge">Ενεργό</span></td><td>87%</td></tr>
                            <tr data-status="active"><td>#16</td><td>Κορυδαλλός - Νίκαια</td><td><span class="badge">Ενεργό</span></td><td>74%</td></tr>
                            <tr data-status="active"><td>#17</td><td>Αιγάλεω - Χαϊδάρι</td><td><span class="badge">Ενεργό</span></td><td>80%</td></tr>
                            <tr data-status="active"><td>#18</td><td>Ηλιούπολη - Αργυρούπολη</td><td><span class="badge">Ενεργό</span></td><td>95%</td></tr>
                            <tr data-status="active"><td>#19</td><td>Μελίσσια - Κηφισιά</td><td><span class="badge">Ενεργό</span></td><td>77%</td></tr>
                            <tr data-status="active"><td>#20</td><td>Πικέρμι - Παλλήνη</td><td><span class="badge">Ενεργό</span></td><td>83%</td></tr>
                            <tr data-status="active"><td>#21</td><td>Μαρκόπουλο - Κορωπί</td><td><span class="badge">Ενεργό</span></td><td>86%</td></tr>
                            <tr data-status="active"><td>#22</td><td>Βάρη - Βούλα</td><td><span class="badge">Ενεργό</span></td><td>89%</td></tr>
                            <tr data-status="active"><td>#23</td><td>Διόνυσος - Εκάλη</td><td><span class="badge">Ενεργό</span></td><td>72%</td></tr>
                            <tr data-status="active"><td>#24</td><td>Χολαργός - Παπάγου</td><td><span class="badge">Ενεργό</span></td><td>84%</td></tr>
                            <tr data-status="active"><td>#25</td><td>Νέα Φιλαδέλφεια</td><td><span class="badge">Ενεργό</span></td><td>79%</td></tr>
                            <tr data-status="active"><td>#26</td><td>Περιστέρι - Ανθούπολη</td><td><span class="badge">Ενεργό</span></td><td>81%</td></tr>
                            <tr data-status="active"><td>#27</td><td>Μαρούσι - Λυκόβρυση </td><td><span class="badge">Ενεργό</span></td><td>88%</td></tr>
                        
                           <tr data-status="inactive"><td>#3</td><td>Πειραιάς - Μοσχάτο</td><td><span class="badge warning-badge">Ανενεργό</span></td><td>-</td></tr>
                           <tr data-status="inactive"><td>#8</td><td>Γλυφάδα - Ελληνικό </td><td><span class="badge warning-badge">Ανενεργό</span></td><td>-</td></tr>
                        </tbody>    
                    </table>
                </div>
            </div>
        </div>
    `;
}

//Office routes
function loadRouteManagement() {
    welcomeTitle.innerText = "Υπεύθυνος Κίνησης - Καθορισμός Δρομολογίων";
    dynamicContent.innerHTML = `
        <div class="container" style="max-width: 1000px; width: 100%; margin: auto; background: #ffffff; padding: 20px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0, 0, 0, .08); overflow-x: hidden;">
            <h1 style="margin-top: 0; color: #1e3a3f; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: clamp(1.2rem, 5vw, 1.8rem); margin-bottom: 20px;">
                🚍 Καθορισμός Δρομολογίων
            </h1>

            <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <!-- Students List -->
                <div class="panel" style="border: 1px solid #ddd; border-radius: 12px; padding: 16px; background: #ffffff;">
                    <h3 style="font-size: clamp(0.9rem, 4vw, 1.1rem); margin-bottom: 12px;">📋 1. Λίστα Μαθητών</h3>
                    <input type="text" id="routeName" placeholder="✏️ Όνομα Δρομολογίου (π.χ. Saint Paul - Ίλιον)" style="padding: 10px 12px; width: 100%; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 12px; font-size: 14px;">
                    <div class="search-box" style="position: relative; margin-bottom: 12px; width: 100%;">
                        <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af;">🔍</span>
                        <input type="text" id="searchStudent" placeholder="Αναζήτηση μαθητή..." style="padding: 8px 8px 8px 32px; font-size: 13px; width: 100%; border: 1px solid #ccc; border-radius: 8px;">
                    </div>
                    <div class="list" id="studentList" style="max-height: 360px; overflow-y: auto; padding: 8px; background: #fafafa; border-radius: 10px;"></div>
                    <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                        <span class="selection-info" id="selectionInfo" style="font-size: 12px; color: #6b7280;">0 επιλεγμένοι</span>
                        <button class="primary" onclick="confirmSelection()" style="background: #2563eb; color: #fff; padding: 8px 12px; font-size: 13px; border: none; border-radius: 8px; cursor: pointer;">✅ Επιβεβαίωση</button>
                    </div>
                </div>

                <!-- Route that has been choosed -->
                <div class="panel" style="border: 1px solid #ddd; border-radius: 12px; padding: 16px; background: #ffffff;">
                    <h3 style="font-size: clamp(0.9rem, 4vw, 1.1rem); margin-bottom: 12px;">👥 2. Επιλεγμένο Δρομολόγιο</h3>
                    <div class="list" id="selectedList" style="max-height: 360px; overflow-y: auto; padding: 8px; background: #fafafa; border-radius: 10px; min-height: 180px;"></div>
                    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                        <button class="success" onclick="saveRoute()" style="background: #16a34a; color: #fff; padding: 8px 12px; font-size: 13px; border: none; border-radius: 8px; cursor: pointer;">💾 Καταχώρηση</button>
                        <button class="info" onclick="editSelectedRoute()" style="background: #0ea5e9; color: #fff; padding: 8px 12px; font-size: 13px; border: none; border-radius: 8px; cursor: pointer;">✏️ Τροποποίηση</button>
                        <button class="gray" onclick="newRoute()" style="background: #6b7280; color: #fff; padding: 8px 12px; font-size: 13px; border: none; border-radius: 8px; cursor: pointer;">🆕 Νέο</button>
                    </div>
                </div>
            </div>

            <!--Saved routes -->
            <div class="panel" style="border: 1px solid #ddd; border-radius: 12px; padding: 16px; background: #ffffff; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
                    <h3 style="font-size: clamp(0.9rem, 4vw, 1.1rem); margin: 0;">📚 Αποθηκευμένα Δρομολόγια</h3>
                    <button class="danger" onclick="clearAllRoutes()" style="background: #dc2626; color: #fff; padding: 6px 12px; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">🗑️ Διαγραφή Όλων</button>
                </div>
                <div id="savedRoutes"></div>
            </div>
        </div>
    `;

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
    }

    function saveToStorage() {
        localStorage.setItem('schoolRoutes', JSON.stringify(routes));
    }

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
            list.innerHTML += `<div class='row' style="display:flex;gap:10px;align-items:center;padding:8px 6px;border-bottom:1px solid #eee;"><input type='checkbox' value='${escapedName}' ${isChecked ? 'checked' : ''} style="flex-shrink:0;width:18px;height:18px;"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;" title="${name}">${name}</span></div>`;
        });
        updateSelectionInfo();
    }

    function updateSelectionInfo() {
        const checks = [...document.querySelectorAll('#studentList input:checked')];
        const infoElem = document.getElementById('selectionInfo');
        if (infoElem) infoElem.innerHTML = `${checks.length} επιλεγμένοι ${checks.length > 0 ? '✓' : ''}`;
    }

    window.confirmSelection = function() {
        const checks = [...document.querySelectorAll('#studentList input:checked')];
        currentSelection = checks.map(c => c.value);
        renderSelectedList();
        updateSelectionInfo();
        showToast('✅ Οι μαθητές επιλέχθηκαν!', '#16a34a');
    };

    function renderSelectedList() {
        const box = document.getElementById('selectedList');
        if (!box) return;
        
        if (currentSelection.length === 0) {
            box.innerHTML = '<div style="text-align:center;padding:25px;color:#9ca3af;">✨ Κανένας επιλεγμένος μαθητής</div>';
            return;
        }
        box.innerHTML = currentSelection.map((n, i) => `<div style="padding:12px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;"><div style="flex:1;word-break:break-word;"><strong>${i + 1}.</strong> ${n}</div><button onclick="removeFromSelection('${n.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" style="background:#fee2e2;color:#dc2626;padding:4px 8px;font-size:11px;border-radius:6px;border:none;cursor:pointer;">✖</button></div>`).join('');
    }

    window.removeFromSelection = function(name) {
        currentSelection = currentSelection.filter(s => s !== name);
        renderSelectedList();
        renderStudents(document.getElementById('searchStudent')?.value || '');
        showToast(`Ο/Η ${name.split(' ')[0]} αφαιρέθηκε`, '#f59e0b');
    };

    window.saveRoute = function() {
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
        window.newRoute();
    };

    window.editRoute = function(index) {
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
    };

    window.editSelectedRoute = function() {
        if (editIndex !== null) {
            window.saveRoute();
        } else {
            showToast('ℹ️ Επιλέξτε δρομολόγιο από τη λίστα', '#6b7280');
        }
    };

    window.deleteRoute = function(index) {
        if (confirm(`Διαγραφή του "${routes[index].name}";`)) {
            routes.splice(index, 1);
            saveToStorage();
            renderRoutes();
            if (editIndex === index) window.newRoute();
            showToast('🗑️ Διαγράφηκε!', '#dc2626');
        }
    };

    window.copyRoute = function(index) {
        const route = routes[index];
        const newName = `${route.name} (αντίγραφο)`;
        routes.push({ name: newName, students: [...route.students] });
        saveToStorage();
        renderRoutes();
        showToast(`📋 Αντιγράφηκε "${route.name}"`, '#0ea5e9');
    };

    function renderRoutes() {
        const area = document.getElementById('savedRoutes');
        if (!area) return;
        
        if (routes.length === 0) {
            area.innerHTML = `<div style="text-align:center;padding:30px 15px;color:#9ca3af;"><div>📭</div><div>Δεν υπάρχουν αποθηκευμένα δρομολόγια</div><div style="font-size:11px;margin-top:5px;">Δημιουργήστε το πρώτο σας δρομολόγιο!</div></div>`;
            return;
        }
        area.innerHTML = routes.map((r, i) => `<div style="padding:12px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="flex:1;min-width:0;">
                <div style="font-weight:bold;color:#1e3a3f;">${i + 1}. ${r.name} <span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:bold;background:#dbeafe;color:#1e40af;">${r.students.length} μαθητές</span></div>
                <div style="color:#6b7280;font-size:0.8rem;word-break:break-word;">${r.students.join(', ')}</div>
            </div>
            <div style="display:flex;gap:6px;">
                <button onclick="editRoute(${i})" style="background:#0ea5e9;color:#fff;padding:4px 10px;font-size:11px;border:none;border-radius:6px;cursor:pointer;" title="Επεξεργασία">✏️</button>
                <button onclick="copyRoute(${i})" style="background:#8b5cf6;color:#fff;padding:4px 10px;font-size:11px;border:none;border-radius:6px;cursor:pointer;" title="Αντιγραφή">📋</button>
                <button onclick="deleteRoute(${i})" style="background:#dc2626;color:#fff;padding:4px 10px;font-size:11px;border:none;border-radius:6px;cursor:pointer;" title="Διαγραφή">🗑️</button>
            </div>
        </div>`).join('');
    }

    window.newRoute = function() {
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
    };

    window.clearAllRoutes = function() {
        if (confirm('⚠️ ΠΡΟΣΟΧΗ! Θα διαγραφούν ΟΛΑ τα δρομολόγια. Είστε σίγουρος;')) {
            routes = [];
            saveToStorage();
            renderRoutes();
            window.newRoute();
            showToast('🗑️ Όλα τα δρομολόγια διαγράφηκαν!', '#dc2626');
        }
    };

    function showToast(message, color) {
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
        toast.style.zIndex = '10000';
        toast.style.fontWeight = 'bold';
        toast.style.fontSize = '13px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Search
    const searchStudentInput = document.getElementById('searchStudent');
    if (searchStudentInput) {
        searchStudentInput.addEventListener('input', (e) => {
            renderStudents(e.target.value);
        });
    }

    // Initialization
    renderStudents('');
    loadFromStorage();
}

//Absence Declaration
function loadAbsenceDeclaration() {
    welcomeTitle.innerText = "Δήλωση Απουσίας / Αιτήματος";
    dynamicContent.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
            <div class="card">
                <h3>📝 Δήλωση Απουσίας / Αιτήματος</h3>
                <p>Συμπληρώστε την αντίστοιχη φόρμα για να δηλώσετε την απουσία ενός μαθητή ή να υποβάλετε κάποιο αίτημα που αφορά τη μετακίνησή του.</p>
            </div>

            <!-- Tabs for absence or report-->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="tabAbsenceBtn" class="tab-btn active" style="background: #1e3a3f; color: white; padding: 10px 20px; border: none; border-radius: 30px; cursor: pointer;">📖 Δήλωση Απουσίας</button>
                <button id="tabRequestBtn" class="tab-btn" style="background: #e2efe4; color: #1e3a3f; padding: 10px 20px; border: none; border-radius: 30px; cursor: pointer;">✉️ Υποβολή Αιτήματος</button>
            </div>

            <!-- Absence form-->
            <div id="absenceForm" class="card" style="display: block;">
                <h3 style="margin-bottom: 20px;">📖 Δήλωση Απουσίας</h3>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">👨‍🎓 Μαθητής/τρια</label>
                    <div class="search-box" style="position: relative;">
                        <input type="text" id="studentSearchAbsence" placeholder="Ονοματεπώνυμο..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <div id="resultsAbsence" class="results" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 10px; max-height: 200px; overflow-y: auto; display: none; z-index: 100;"></div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold;">📅 Ημερομηνία απουσίας</label>
                        <input type="date" id="realDateAbsence" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;" value="<?php echo date('Y-m-d'); ?>">
                </div>
               
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">🚌 Δρομολόγιο</label>
                    <select id="routeSelectAbsence" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <option value="">Επιλέξτε δρομολόγιο...</option>
                        <option value="Δρομολόγιο 1 (Κηφισιά - Μαρούσι)">Δρομολόγιο 1 (Κηφισιά - Μαρούσι)</option>
                        <option value="Δρομολόγιο 2 (Χαλάνδρι - Αγία Παρασκευή)">Δρομολόγιο 2 (Χαλάνδρι - Αγία Παρασκευή)</option>
                        <option value="Δρομολόγιο 3 (Γλυφάδα - Βούλα)">Δρομολόγιο 3 (Γλυφάδα - Βούλα)</option>
                        <option value="Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)">Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)</option>
                        <option value="Δρομολόγιο 5 (Ίλιον - Πετρούπολη)">Δρομολόγιο 5 (Ίλιον - Πετρούπολη)</option>
                        <option value="Δρομολόγιο 6 (Άλιμος - Ελληνικό)">Δρομολόγιο 6 (Άλιμος - Ελληνικό)</option>
                        <option value="Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)">Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)</option>
                        <option value="Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)">Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)</option>
                        <option value="Δρομολόγιο 9 (Βύρωνας - Παγκράτι)">Δρομολόγιο 9 (Βύρωνας - Παγκράτι)</option>
                        <option value="Δρομολόγιο 10 (Γαλάτσι - Πατήσια)">Δρομολόγιο 10 (Γαλάτσι - Πατήσια)</option>
                        <option value="Δρομολόγιο 11 (Μαρούσι - Πεύκη)">Δρομολόγιο 11 (Μαρούσι - Πεύκη)</option>
                        <option value="Δρομολόγιο 12 (Βριλήσσια - Χαλάνδρι)">Δρομολόγιο 12 (Βριλήσσια - Χαλάνδρι)</option>
                        <option value="Δρομολόγιο 13 (Αγία Παρασκευή - Γέρακας)">Δρομολόγιο 13 (Αγία Παρασκευή - Γέρακας)</option>
                        <option value="Δρομολόγιο 14 (Κορυδαλλός - Νίκαια)">Δρομολόγιο 14 (Κορυδαλλός - Νίκαια)</option>
                        <option value="Δρομολόγιο 15 (Αιγάλεω - Χαϊδάρι)">Δρομολόγιο 15 (Αιγάλεω - Χαϊδάρι)</option>
                        <option value="Δρομολόγιο 16 (Ηλιούπολη - Αργυρούπολη)">Δρομολόγιο 16 (Ηλιούπολη - Αργυρούπολη)</option>
                        <option value="Δρομολόγιο 17 (Μελίσσια - Κηφισιά)">Δρομολόγιο 17 (Μελίσσια - Κηφισιά)</option>
                        <option value="Δρομολόγιο 18 (Πικέρμι - Παλλήνη)">Δρομολόγιο 18 (Πικέρμι - Παλλήνη)</option>
                        <option value="Δρομολόγιο 19 (Μαρκόπουλο - Κορωπί)">Δρομολόγιο 19 (Μαρκόπουλο - Κορωπί)</option>
                        <option value="Δρομολόγιο 20 (Βάρη - Βούλα)">Δρομολόγιο 20 (Βάρη - Βούλα)</option>
                        <option value="Δρομολόγιο 21 (Διόνυσος - Εκάλη)">Δρομολόγιο 21 (Διόνυσος - Εκάλη)</option>
                        <option value="Δρομολόγιο 22 (Χολαργός - Παπάγου)">Δρομολόγιο 22 (Χολαργός - Παπάγου)</option>
                        <option value="Δρομολόγιο 23 (Νέα Φιλαδέλφεια)">Δρομολόγιο 23 (Νέα Φιλαδέλφεια)</option>
                        <option value="Δρομολόγιο 24 (Περιστέρι - Ανθούπολη)">Δρομολόγιο 24 (Περιστέρι - Ανθούπολη)</option>
                        <option value="Δρομολόγιο 25 (Μαρούσι - Λυκόβρυση)">Δρομολόγιο 25 (Μαρούσι - Λυκόβρυση)</option>
                        <option value="Δρομολόγιο 26 (Πειραιάς - Μοσχάτο)">Δρομολόγιο 26 (Πειραιάς - Μοσχάτο)</option>
                        <option value="Δρομολόγιο 27 (Γλυφάδα - Ελληνικό)">Δρομολόγιο 27 (Γλυφάδα - Ελληνικό)</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">🕐 Τύπος Δρομολογίου</label>
                    <select id="routeTypeAbsence" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <option value="">Επιλέξτε τύπο...</option>
                        <option value="Πρωινό Δρομολόγιο">Πρωινό Δρομολόγιο</option>
                        <option value="Μεσημεριανό Δρομολόγιο">Μεσημεριανό Δρομολόγιο</option>
                        <option value="Απογευματινό Δρομολόγιο">Απογευματινό Δρομολόγιο</option>
                    </select>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button id="submitAbsenceBtn" style="background: #16a34a; color: white; padding: 12px 24px; border: none; border-radius: 30px; cursor: pointer; font-weight: bold;">📤 Υποβολή</button>
                    <button id="resetAbsenceBtn" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 30px; cursor: pointer;">🗑️ Καθαρισμός</button>
                </div>
            </div>

            <!--Report form -->
            <div id="requestForm" class="card" style="display: none;">
                <h3 style="margin-bottom: 20px;">✉️ Υποβολή Αιτήματος</h3>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">👨‍🎓 Μαθητής/τρια</label>
                    <div class="search-box" style="position: relative;">
                        <input type="text" id="studentSearchRequest" placeholder="Ονοματεπώνυμο..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <div id="resultsRequest" class="results" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 10px; max-height: 200px; overflow-y: auto; display: none; z-index: 100;"></div>
                    </div>
                </div>
                    
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">📅 Ημερομηνία απουσίας</label>
                    <input type="date" id="realDateRequest" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;" value="<?php echo date('Y-m-d'); ?>">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">🚌 Δρομολόγιο</label>
                    <select id="routeSelectRequest" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <option value="">Επιλέξτε δρομολόγιο...</option>
                        <option value="Δρομολόγιο 1 (Κηφισιά - Μαρούσι)">Δρομολόγιο 1 (Κηφισιά - Μαρούσι)</option>
                        <option value="Δρομολόγιο 2 (Χαλάνδρι - Αγία Παρασκευή)">Δρομολόγιο 2 (Χαλάνδρι - Αγία Παρασκευή)</option>
                        <option value="Δρομολόγιο 3 (Γλυφάδα - Βούλα)">Δρομολόγιο 3 (Γλυφάδα - Βούλα)</option>
                        <option value="Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)">Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)</option>
                        <option value="Δρομολόγιο 5 (Ίλιον - Πετρούπολη)">Δρομολόγιο 5 (Ίλιον - Πετρούπολη)</option>
                        <option value="Δρομολόγιο 6 (Άλιμος - Ελληνικό)">Δρομολόγιο 6 (Άλιμος - Ελληνικό)</option>
                        <option value="Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)">Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)</option>
                        <option value="Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)">Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)</option>
                        <option value="Δρομολόγιο 9 (Βύρωνας - Παγκράτι)">Δρομολόγιο 9 (Βύρωνας - Παγκράτι)</option>
                        <option value="Δρομολόγιο 10 (Γαλάτσι - Πατήσια)">Δρομολόγιο 10 (Γαλάτσι - Πατήσια)</option>
                        <option value="Δρομολόγιο 11 (Μαρούσι - Πεύκη)">Δρομολόγιο 11 (Μαρούσι - Πεύκη)</option>
                        <option value="Δρομολόγιο 12 (Βριλήσσια - Χαλάνδρι)">Δρομολόγιο 12 (Βριλήσσια - Χαλάνδρι)</option>
                        <option value="Δρομολόγιο 13 (Αγία Παρασκευή - Γέρακας)">Δρομολόγιο 13 (Αγία Παρασκευή - Γέρακας)</option>
                        <option value="Δρομολόγιο 14 (Κορυδαλλός - Νίκαια)">Δρομολόγιο 14 (Κορυδαλλός - Νίκαια)</option>
                        <option value="Δρομολόγιο 15 (Αιγάλεω - Χαϊδάρι)">Δρομολόγιο 15 (Αιγάλεω - Χαϊδάρι)</option>
                        <option value="Δρομολόγιο 16 (Ηλιούπολη - Αργυρούπολη)">Δρομολόγιο 16 (Ηλιούπολη - Αργυρούπολη)</option>
                        <option value="Δρομολόγιο 17 (Μελίσσια - Κηφισιά)">Δρομολόγιο 17 (Μελίσσια - Κηφισιά)</option>
                        <option value="Δρομολόγιο 18 (Πικέρμι - Παλλήνη)">Δρομολόγιο 18 (Πικέρμι - Παλλήνη)</option>
                        <option value="Δρομολόγιο 19 (Μαρκόπουλο - Κορωπί)">Δρομολόγιο 19 (Μαρκόπουλο - Κορωπί)</option>
                        <option value="Δρομολόγιο 20 (Βάρη - Βούλα)">Δρομολόγιο 20 (Βάρη - Βούλα)</option>
                        <option value="Δρομολόγιο 21 (Διόνυσος - Εκάλη)">Δρομολόγιο 21 (Διόνυσος - Εκάλη)</option>
                        <option value="Δρομολόγιο 22 (Χολαργός - Παπάγου)">Δρομολόγιο 22 (Χολαργός - Παπάγου)</option>
                        <option value="Δρομολόγιο 23 (Νέα Φιλαδέλφεια)">Δρομολόγιο 23 (Νέα Φιλαδέλφεια)</option>
                        <option value="Δρομολόγιο 24 (Περιστέρι - Ανθούπολη)">Δρομολόγιο 24 (Περιστέρι - Ανθούπολη)</option>
                        <option value="Δρομολόγιο 25 (Μαρούσι - Λυκόβρυση)">Δρομολόγιο 25 (Μαρούσι - Λυκόβρυση)</option>
                        <option value="Δρομολόγιο 26 (Πειραιάς - Μοσχάτο)">Δρομολόγιο 26 (Πειραιάς - Μοσχάτο)</option>
                        <option value="Δρομολόγιο 27 (Γλυφάδα - Ελληνικό)">Δρομολόγιο 27 (Γλυφάδα - Ελληνικό)</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">🕐 Τύπος Δρομολογίου</label>
                    <select id="routeTypeRequest" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;">
                        <option value="">Επιλέξτε τύπο...</option>
                        <option value="Πρωινό Δρομολόγιο">Πρωινό Δρομολόγιο</option>
                        <option value="Μεσημεριανό Δρομολόγιο">Μεσημεριανό Δρομολόγιο</option>
                        <option value="Απογευματινό Δρομολόγιο">Απογευματινό Δρομολόγιο</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">📝 Καταγραφή αιτήματος</label>
                    <textarea id="requestText" rows="4" placeholder="Καταγράψτε το αίτημά σας..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px;"></textarea>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button id="submitRequestBtn" style="background: #16a34a; color: white; padding: 12px 24px; border: none; border-radius: 30px; cursor: pointer; font-weight: bold;">📤 Υποβολή</button>
                    <button id="resetRequestBtn" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 30px; cursor: pointer;">🗑️ Καθαρισμός</button>
                </div>
            </div>
        </div>

        <!-- POPUPS -->
        <div id="amPopup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; justify-content: center; align-items: center;">
            <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; max-width: 350px;">
                <p style="margin-bottom: 15px;">Εισάγετε Αριθμό Μητρώου για επιβεβαίωση</p>
                <input type="text" id="amInput" placeholder="ΑΜ..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                <button id="confirmAMBtn" style="background: #0047ab; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">OK</button>
            </div>
        </div>

        <div id="successPopup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; justify-content: center; align-items: center;">
            <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; max-width: 350px;">
                <p id="successText" style="margin-bottom: 20px; font-size: 18px;">✅ Η δήλωσή σας υποβλήθηκε επιτυχώς!</p>
                <button id="closeSuccessBtn" style="background: #0047ab; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">OK</button>
            </div>
        </div>
    `;

    const studentsData = [
        { name: "Αντωνίου Πέτρος", am: "1001", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Βασιλείου Αγγελική", am: "1002", route: "Δρομολόγιο 2 (Χαλάνδρι - Αγία Παρασκευή)" },
        { name: "Βασιλείου Άννα", am: "1003", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Γεωργίου Ελένη", am: "1004", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Δημητρίου Νίκος", am: "1005", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Θεοδώρου Άννα", am: "1006", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Ιωάννου Κατερίνα", am: "1007", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Ιωάννου Χριστίνα", am: "1008", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Καραγιάννη Ευαγγελία", am: "1009", route: "Δρομολόγιο 1 (Κηφισιά - Μαρούσι)" },
        { name: "Καραγιάννη Παναγιώτα", am: "1010", route: "Δρομολόγιο 1 (Κηφισιά - Μαρούσι)" },
        { name: "Καραγιάννης Πάνος", am: "1011", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Κωνσταντίνου Μαρία", am: "1012", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Μαντάς Αλέξανδρος", am: "1013", route: "Δρομολόγιο 3 (Γλυφάδα - Βούλα)" },
        { name: "Μανωλάκης Χρήστος", am: "1014", route: "Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)" },
        { name: "Μακρής Κώστας", am: "1015", route: "Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)" },
        { name: "Νικολάου Ανδρέας", am: "1016", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Παπαδάκης Γιώργος", am: "1017", route: "Δρομολόγιο 4 (Περιστέρι - Αιγάλεω)" },
        { name: "Παπαδόπουλος Γιάννης", am: "1018", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Παπαγεωργίου Ελένη", am: "1019", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Παπαζέρβα Παναγιώτα", am: "1020", route: "Δρομολόγιο 6 (Άλιμος - Ελληνικό)" },
        { name: "Παπαδοπούλου Σοφία", am: "1021", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Παππά Ιωάννα", am: "1022", route: "Δρομολόγιο 6 (Άλιμος - Ελληνικό)" },
        { name: "Παπασωτηρίου Μαρία", am: "1023", route: "Δρομολόγιο 3 (Γλυφάδα - Βούλα)" },
        { name: "Παναγιώτου Δημήτρης", am: "1024", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Πολίτης Μάξιμος", am: "1025", route: "Δρομολόγιο 6 (Άλιμος - Ελληνικό)" },
        { name: "Ράπτης Θανάσης", am: "1026", route: "Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)" },
        { name: "Στεφανέλης Σέργιος", am: "1027", route: "Δρομολόγιο 3 (Γλυφάδα - Βούλα)" },
        { name: "Στεφανίδης Νικόλας", am: "1028", route: "Δρομολόγιο 5 (Ίλιον - Πετρούπολη)" },
        { name: "Στεργίου Δέσποινα", am: "1029", route: "Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)" },
        { name: "Σχοινάς Σπύρος", am: "1030", route: "Δρομολόγιο 7 (Νέα Σμύρνη - Καλλιθέα)" },
        { name: "Χατζής Ιάσονας", am: "1031", route: "Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)" },
        { name: "Χριστοδούλου Σταμάτης", am: "1032", route: "Δρομολόγιο 8 (Ζωγράφου - Καισαριανή)" }
    ];

    let selectedStudentAbsence = null;
    let selectedStudentRequest = null;
    let currentSubmissionType = null;

    // Dates
    const realDateAbsence = document.getElementById('realDateAbsence');
    if (realDateAbsence) {
        realDateAbsence.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    const realDateRequest = document.getElementById('realDateRequest');
    if (realDateRequest) {
        realDateRequest.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    // Search functionality
    function setupSearch(inputId, resultsId, isAbsence) {
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);
        if (!input || !results) return;

        function showResults(filtered) {
            results.innerHTML = '';
            if (filtered.length === 0) {
                results.style.display = 'none';
                return;
            }
            filtered.forEach(student => {
                const div = document.createElement('div');
                div.textContent = student.name;
                div.style.padding = '10px';
                div.style.cursor = 'pointer';
                div.style.borderBottom = '1px solid #eee';
                div.onmouseover = () => div.style.background = '#f0f4f2';
                div.onmouseout = () => div.style.background = 'white';
                div.onclick = () => {
                    input.value = student.name;
                    if (isAbsence) {
                        selectedStudentAbsence = student;
                        const routeSelect = document.getElementById('routeSelectAbsence');
                        if (routeSelect) routeSelect.value = student.route;
                    } else {
                        selectedStudentRequest = student;
                        const routeSelect = document.getElementById('routeSelectRequest');
                        if (routeSelect) routeSelect.value = student.route;
                    }
                    results.style.display = 'none';
                };
                results.appendChild(div);
            });
            results.style.display = 'block';
        }

        input.addEventListener('focus', () => showResults(studentsData));
        input.addEventListener('input', () => {
            const value = input.value.toLowerCase();
            showResults(studentsData.filter(s => s.name.toLowerCase().includes(value)));
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) results.style.display = 'none';
        });
    }

    setupSearch('studentSearchAbsence', 'resultsAbsence', true);
    setupSearch('studentSearchRequest', 'resultsRequest', false);

    // Tabs
    const tabAbsence = document.getElementById('tabAbsenceBtn');
    const tabRequest = document.getElementById('tabRequestBtn');
    const absenceForm = document.getElementById('absenceForm');
    const requestForm = document.getElementById('requestForm');

    if (tabAbsence && tabRequest) {
        tabAbsence.onclick = () => {
            tabAbsence.style.background = '#1e3a3f';
            tabAbsence.style.color = 'white';
            tabRequest.style.background = '#e2efe4';
            tabRequest.style.color = '#1e3a3f';
            absenceForm.style.display = 'block';
            requestForm.style.display = 'none';
        };
        tabRequest.onclick = () => {
            tabRequest.style.background = '#1e3a3f';
            tabRequest.style.color = 'white';
            tabAbsence.style.background = '#e2efe4';
            tabAbsence.style.color = '#1e3a3f';
            absenceForm.style.display = 'none';
            requestForm.style.display = 'block';
        };
    }

    // Reset buttons
    const resetAbsence = document.getElementById('resetAbsenceBtn');
    if (resetAbsence) {
        resetAbsence.onclick = () => {
            document.getElementById('studentSearchAbsence').value = '';
            document.getElementById('niceDateAbsence').value = '';
            document.getElementById('realDateAbsence').value = '';
            document.getElementById('routeSelectAbsence').value = '';
            document.getElementById('routeTypeAbsence').value = '';
            selectedStudentAbsence = null;
        };
    }

    const resetRequest = document.getElementById('resetRequestBtn');
    if (resetRequest) {
        resetRequest.onclick = () => {
            document.getElementById('studentSearchRequest').value = '';
            document.getElementById('niceDateRequest').value = '';
            document.getElementById('realDateRequest').value = '';
            document.getElementById('routeSelectRequest').value = '';
            document.getElementById('routeTypeRequest').value = '';
            document.getElementById('requestText').value = '';
            selectedStudentRequest = null;
        };
    }

    // Submit functions
    const amPopup = document.getElementById('amPopup');
    const successPopup = document.getElementById('successPopup');
    const successText = document.getElementById('successText');

    function showAMPopup(type) {
        currentSubmissionType = type;
        amPopup.style.display = 'flex';
    }

    const confirmBtn = document.getElementById('confirmAMBtn');

    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const inputAM = document.getElementById('amInput').value;
            const student = currentSubmissionType === 'absence' 
                ? selectedStudentAbsence 
                : selectedStudentRequest;
        
            console.log("CLICK OK"); // debug

            if (student && inputAM === student.am) {
                amPopup.style.display = 'none';
                document.getElementById('amInput').value = '';
                successText.innerText = currentSubmissionType === 'absence' 
                    ? '✅ Η δήλωση απουσίας υποβλήθηκε επιτυχώς!' 
                    : '✅ Το αίτημά σας υποβλήθηκε επιτυχώς!';
                successPopup.style.display = 'flex';
            } else {
                alert('Λάθος Αριθμός Μητρώου!');
            }
        };
    }

    document.getElementById('closeSuccessBtn')?.addEventListener('click', () => {
        successPopup.style.display = 'none';
        if (currentSubmissionType === 'absence') {
            resetAbsence?.click();
        } else {
            resetRequest?.click();
        }
    });

    document.getElementById('submitAbsenceBtn')?.addEventListener('click', () => {
        if (!selectedStudentAbsence) {
            alert('Παρακαλώ επιλέξτε μαθητή!');
            return;
        }
        if (!document.getElementById('realDateAbsence').value) {
            alert('Παρακαλώ επιλέξτε ημερομηνία!');
            return;
        }
        if (!document.getElementById('routeSelectAbsence').value) {
            alert('Παρακαλώ επιλέξτε δρομολόγιο!');
            return;
        }
        if (!document.getElementById('routeTypeAbsence').value) {
            alert('Παρακαλώ επιλέξτε τύπο δρομολογίου!');
            return;
        }
        showAMPopup('absence');
    });

    document.getElementById('submitRequestBtn')?.addEventListener('click', () => {
        if (!selectedStudentRequest) {
            alert('Παρακαλώ επιλέξτε μαθητή!');
            return;
        }
        if (!document.getElementById('realDateRequest').value) {
            alert('Παρακαλώ επιλέξτε ημερομηνία!');
            return;
        }
        if (!document.getElementById('routeSelectRequest').value) {
            alert('Παρακαλώ επιλέξτε δρομολόγιο!');
            return;
        }
        if (!document.getElementById('routeTypeRequest').value) {
            alert('Παρακαλώ επιλέξτε τύπο δρομολογίου!');
            return;
        }
        if (!document.getElementById('requestText').value) {
            alert('Παρακαλώ καταγράψτε το αίτημά σας!');
            return;
        }
        showAMPopup('request');
    });
}

//Routes management
let currentSelection = [];
let routes = [];
let editIndex = null;

function loadRoutesFromStorage() {
    const saved = localStorage.getItem('schoolRoutes');
    if (saved) {
        routes = JSON.parse(saved);
        renderRoutesList();
    }
}

function saveRoutesToStorage() {
    localStorage.setItem('schoolRoutes', JSON.stringify(routes));
}

function renderStudentsList(filterText = '') {
    const container = document.getElementById('studentList');
    if (!container) return;
            
    const filtered = studentsList.filter(s => s.toLowerCase().includes(filterText.toLowerCase()));
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:#9ca3af;">❌ Δεν βρέθηκαν μαθητές</div>';
        return;
    }
    filtered.forEach(name => {
        const isChecked = currentSelection.includes(name);
        const escapedName = name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        container.innerHTML += `<div class="row"><input type="checkbox" value="${escapedName}" ${isChecked ? 'checked' : ''} style="width:18px;height:18px;"><span style="flex:1;">${name}</span></div>`;
    });
    updateSelectionInfoDisplay();
}

function updateSelectionInfoDisplay() {
    const checks = [...document.querySelectorAll('#studentList input:checked')];
    const infoSpan = document.getElementById('selectionInfo');
    if (infoSpan) infoSpan.innerHTML = `${checks.length} επιλεγμένοι ${checks.length > 0 ? '✓' : ''}`;
}

function renderSelectedListDisplay() {
    const container = document.getElementById('selectedList');
    if (!container) return;
            
    if (currentSelection.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:25px;color:#9ca3af;">✨ Κανένας επιλεγμένος μαθητής</div>';
        return;
    }
    container.innerHTML = currentSelection.map((n, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
            <div style="flex:1;"><strong>${i + 1}.</strong> ${n}</div>
            <button onclick="window.routeFunctions.removeFromSelection('${n.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" style="background:#fee2e2; color:#dc2626; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">✖</button>
        </div>
    `).join('');
}

function renderRoutesList() {
    const container = document.getElementById('savedRoutes');
    if (!container) return;
            
    if (routes.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:30px;color:#9ca3af;"><div>📭</div><div>Δεν υπάρχουν αποθηκευμένα δρομολόγια</div><div style="font-size:11px;margin-top:5px;">Δημιουργήστε το πρώτο σας δρομολόγιο!</div></div>`;
        return;
    }
    container.innerHTML = routes.map((r, i) => `
        <div class="route-item">
            <div style="flex:1; min-width: 0;">
                <div style="font-weight: bold; color: #1e3a3f;">${i + 1}. ${r.name} <span class="badge">${r.students.length} μαθητές</span></div>
                <div style="color: #6b7280; font-size: 0.8rem; word-break: break-word;">${r.students.join(', ')}</div>
            </div>
            <div style="display: flex; gap: 6px;">
                <button onclick="window.routeFunctions.editRoute(${i})" style="background:#0ea5e9; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">✏️</button>
                <button onclick="window.routeFunctions.copyRoute(${i})" style="background:#8b5cf6; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">📋</button>
                <button onclick="window.routeFunctions.deleteRoute(${i})" style="background:#dc2626; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">🗑️</button>
            </div>
        </div>
    `).join('');
}

function showToastMessage(message, color) {
    const existingToast = document.querySelector('.toast-message-custom');
    if (existingToast) existingToast.remove();
            
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast-message-custom';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = color;
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '10px';
    toast.style.zIndex = '10000';
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

window.routeFunctions = {
    confirmSelection: function() {
        const checks = [...document.querySelectorAll('#studentList input:checked')];
        currentSelection = checks.map(c => c.value);
        renderSelectedListDisplay();
        updateSelectionInfoDisplay();
        showToastMessage('✅ Οι μαθητές επιλέχθηκαν!', '#16a34a');
    },
    removeFromSelection: function(name) {
        currentSelection = currentSelection.filter(s => s !== name);
        renderSelectedListDisplay();
        const searchVal = document.getElementById('searchStudent')?.value || '';
        renderStudentsList(searchVal);
        showToastMessage(`Ο/Η ${name.split(' ')[0]} αφαιρέθηκε`, '#f59e0b');
    },
    saveRoute: function() {
        const nameInput = document.getElementById('routeName');
        const name = nameInput?.value.trim() || '';
        if (!name) {
            showToastMessage('⚠️ Εισάγετε όνομα δρομολογίου!', '#f59e0b');
            return;
        }
        if (currentSelection.length === 0) {
            showToastMessage('⚠️ Επιλέξτε τουλάχιστον έναν μαθητή!', '#f59e0b');
            return;
        }
        if (editIndex !== null) {
            routes[editIndex] = { name, students: [...currentSelection] };
            showToastMessage(`✏️ Το "${name}" τροποποιήθηκε!`, '#0ea5e9');
            editIndex = null;
            const editBtn = document.getElementById('editRouteBtn');
            if (editBtn) editBtn.innerHTML = '✏️ Τροποποίηση';
        } else {
            routes.push({ name, students: [...currentSelection] });
            showToastMessage(`✅ Το "${name}" καταχωρήθηκε!`, '#16a34a');
        }
        saveRoutesToStorage();
        renderRoutesList();
        window.routeFunctions.newRoute();
    },
    editRoute: function(index) {
        const route = routes[index];
        const nameInput = document.getElementById('routeName');
        if (nameInput) nameInput.value = route.name;
        currentSelection = [...route.students];
        renderSelectedListDisplay();
        renderStudentsList(document.getElementById('searchStudent')?.value || '');
        editIndex = index;
        const editBtn = document.getElementById('editRouteBtn');
        if (editBtn) {
            editBtn.innerHTML = '💾 Αποθήκευση';
            editBtn.style.background = '#0ea5e9';
        }
        showToastMessage(`✏️ Επεξεργασία: ${route.name}`, '#0ea5e9');
    },
    editSelectedRoute: function() {
        if (editIndex !== null) {
            window.routeFunctions.saveRoute();
        } else {
            showToastMessage('ℹ️ Επιλέξτε δρομολόγιο από τη λίστα', '#6b7280');
        }
    },
    copyRoute: function(index) {
        const route = routes[index];
        const newName = `${route.name} (αντίγραφο)`;
        routes.push({ name: newName, students: [...route.students] });
        saveRoutesToStorage();
        renderRoutesList();
        showToastMessage(`📋 Αντιγράφηκε "${route.name}"`, '#0ea5e9');
    },
    deleteRoute: function(index) {
        if (confirm(`Διαγραφή του "${routes[index].name}";`)) {
            routes.splice(index, 1);
            saveRoutesToStorage();
            renderRoutesList();
            if (editIndex === index) window.routeFunctions.newRoute();
            showToastMessage('🗑️ Διαγράφηκε!', '#dc2626');
        }
    },
    newRoute: function() {
        const nameInput = document.getElementById('routeName');
        if (nameInput) nameInput.value = '';
                
        currentSelection = [];
        renderSelectedListDisplay();
        editIndex = null;
        const editBtn = document.getElementById('editRouteBtn');
        if (editBtn) {
            editBtn.innerHTML = '✏️ Τροποποίηση';
            editBtn.style.background = '#0ea5e9';
        }
        const searchInput = document.getElementById('searchStudent');
        if (searchInput) searchInput.value = '';
        renderStudentsList('');
        showToastMessage('🆕 Νέο δρομολόγιο - Επιλέξτε μαθητές', '#6b7280');
    },
    clearAllRoutes: function() {
        if (confirm('⚠️ ΠΡΟΣΟΧΗ! Θα διαγραφούν ΟΛΑ τα δρομολόγια. Είστε σίγουρος;')) {
            routes = [];
            saveRoutesToStorage();
            renderRoutesList();
            window.routeFunctions.newRoute();
            showToastMessage('🗑️ Όλα τα δρομολόγια διαγράφηκαν!', '#dc2626');
        }
    }
};

function initializeRouteManagement() {
    loadRoutesFromStorage();
    renderStudentsList('');
            
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderStudentsList(e.target.value);
        });
    }
            
    document.addEventListener('change', function(e) {
        if (e.target && e.target.closest('#studentList') && e.target.type === 'checkbox') {
            updateSelectionInfoDisplay();
        }
    });
}