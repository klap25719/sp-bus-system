// Students list
const studentsList = [
    "Ζαφειροπούλου Αναστασία", "Καμαριάρης Γεώργιος", "Καμαριάρη Ευφροσύνη",
    "Κλαπαύτης Γεώργιος", "Σμυρνιός Σταύρος", "Τσιμιδάκη Αγγελική",
    "Τσιμιδάκη Κωνσταντίνα", "Χατζηνικολάου Γεωργία", "Χατζηνικολάου Ιωάννα", "Χατζηνικολάου Σπύρος"
];

// Build students checklist
function buildStudentsChecklist() {
    const container = document.getElementById("studentsChecklist");
    if (!container) return;
    container.innerHTML = "";
    studentsList.forEach(student => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "students";
        checkbox.value = student;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + student));
        container.appendChild(label);
    });
}

// Date picker class
class DatePicker {
    constructor(inputId, calendarId, minDate = null) {
        this.input = document.getElementById(inputId);
        this.calendar = document.getElementById(calendarId);
        this.minDate = minDate || new Date();
        this.currentDate = new Date();
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showCalendar();
        });

        document.addEventListener('click', () => {
            this.hideCalendar();
        });

        this.calendar.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.renderCalendar();
    }

    showCalendar() {
        document.querySelectorAll('.custom-calendar').forEach(cal => {
            if (cal !== this.calendar) cal.classList.remove('show');
        });
        this.calendar.classList.add('show');
        this.renderCalendar();
    }

    hideCalendar() {
        this.calendar.classList.remove('show');
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
            
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
            
        const today = new Date();
        today.setHours(0, 0, 0, 0);
            
        let html = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav" data-nav="prev">◀</button>
                <span class="calendar-month-year">${this.getMonthName(month)} ${year}</span>
                <button type="button" class="calendar-nav" data-nav="next">▶</button>
            </div>
            <div class="calendar-weekdays">
                <span>Κυρ</span><span>Δευ</span><span>Τρί</span><span>Τετ</span><span>Πεμ</span><span>Παρ</span><span>Σαβ</span>
            </div>
            <div class="calendar-days">
        `;
            
        // Empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            html += `<div class="calendar-day disabled"></div>`;
        }
            
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isDisabled = currentDate < this.minDate;
            const isSelected = this.selectedDate && this.selectedDate.toDateString() === currentDate.toDateString();
            const isToday = currentDate.toDateString() === today.toDateString();
                
            let classes = 'calendar-day';
            if (isDisabled) classes += ' disabled';
            if (isSelected) classes += ' selected';
            if (isToday) classes += ' today';
                
            html += `<div class="${classes}" data-day="${day}">${day}</div>`;
        }
            
        html += `</div>`;
        this.calendar.innerHTML = html;
            
        // Add event listeners
        this.calendar.querySelectorAll('.calendar-day:not(.disabled)').forEach(dayElem => {
            dayElem.addEventListener('click', () => {
                const day = parseInt(dayElem.dataset.day);
                if (day) {
                    this.selectedDate = new Date(year, month, day);
                    this.updateInput();
                    this.hideCalendar();
                }
            });
        });
            
        this.calendar.querySelectorAll('.calendar-nav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (btn.dataset.nav === 'prev') {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                } else {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                }
                this.renderCalendar();
            });
        });
    }
        
    getMonthName(month) {
        const months = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
            'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'];
        return months[month];
    }
        
    updateInput() {
        if (this.selectedDate) {
            const day = this.selectedDate.getDate().toString().padStart(2, '0');
            const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = this.selectedDate.getFullYear();
            this.input.value = `${day}/${month}/${year}`;
        }
    }
        
    getValue() {
        if (this.selectedDate) {
            const year = this.selectedDate.getFullYear();
            const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = this.selectedDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return '';
    }
        
    setValue(dateString) {
        if (dateString) {
            const [year, month, day] = dateString.split('-');
            this.selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            this.updateInput();
        }
    }
        
    reset() {
        this.selectedDate = null;
        this.input.value = '';
    }
}

// Initialize date pickers
const today = new Date();
today.setHours(0, 0, 0, 0);
    
const absenceDatePicker = new DatePicker('absenceDateInput', 'absenceCalendar', today);
const requestDatePicker = new DatePicker('requestDateInput', 'requestCalendar', today);

// Copy route options
function syncRouteOptions() {
    const absenceSelect = document.getElementById("absenceRoute");
    const requestSelect = document.getElementById("requestRoute");
    if (absenceSelect && requestSelect) {
        requestSelect.innerHTML = absenceSelect.innerHTML;
    }
}

// Popup functions
function showPopup(message) {
    const popup = document.getElementById("popup");
    const text = document.getElementById("popup-text");
    text.innerText = message;
    popup.style.display = "flex";
}

window.closePopup = function() {
    document.getElementById("popup").style.display = "none";
};

// Tab switching
function initTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetPane = tab.getAttribute("data-form");
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            document.querySelectorAll(".form-pane").forEach(pane => {
                pane.classList.remove("active-pane");
            });
            document.getElementById(targetPane).classList.add("active-pane");
        });
    });
}

// Handle absence form
document.getElementById("absenceForm").addEventListener("submit", (e) => {
    e.preventDefault();
        
    const route = document.getElementById("absenceRoute").value;
    const type = document.getElementById("absenceType").value;
    const date = absenceDatePicker.getValue();
        
    if (!route || !type || !date) {
        showPopup("Παρακαλώ συμπληρώστε όλα τα πεδία!");
        return;
    }
        
    const selectedStudents = document.querySelectorAll("#studentsChecklist input[type='checkbox']:checked");
    if (selectedStudents.length === 0) {
        showPopup("Παρακαλώ επιλέξτε τουλάχιστον έναν μαθητή!");
        return;
    }
        
    showPopup(`✅ Η δήλωση απουσίας υποβλήθηκε επιτυχώς! (${selectedStudents.length} μαθητής/ές)`);
    e.target.reset();
    absenceDatePicker.reset();
});
    
// Handle request form
document.getElementById("requestForm").addEventListener("submit", (e) => {
    e.preventDefault();
        
    const route = document.getElementById("requestRoute").value;
    const type = document.getElementById("requestType").value;
    const date = requestDatePicker.getValue();
    const text = document.getElementById("requestText").value.trim();
        
    if (!route || !type || !date || !text) {
        showPopup("Παρακαλώ συμπληρώστε όλα τα πεδία!");
        return;
    }
        
    showPopup("✅ Το αίτημά σας υποβλήθηκε επιτυχώς!");
    e.target.reset();
    requestDatePicker.reset();
});

// Reset buttons
document.querySelectorAll("input[type='reset']").forEach(btn => {
    btn.addEventListener("click", (e) => {
        setTimeout(() => {
            absenceDatePicker.reset();
            requestDatePicker.reset();
        }, 0);
    });
});

// Initialize
buildStudentsChecklist();
syncRouteOptions();
initTabs();