// ===================================================
// 🆕 FLOATING ACTION BUTTON (FAB) SYSTEM ENGINE
// ===================================================

function toggleFabMenu() {
    const fabBtn = document.getElementById('mainFabBtn');
    const fabOptions = document.getElementById('fabOptions');
    const fabOverlay = document.getElementById('fabOverlay');
    
    // Toggle active state classes
    fabBtn.classList.toggle('open');
    fabOptions.classList.toggle('open');
    fabOverlay.classList.toggle('open');
    
    // Change icon text between + and ✕
    if (fabBtn.classList.contains('open')) {
        fabBtn.innerHTML = '✕';
    } else {
        fabBtn.innerHTML = '➕';
    }
}

// Sub buttons par click hone par input file click trigger karega
function triggerFileUpload() {
    toggleFabMenu(); // Menu band karo
    document.getElementById('fileUpload').click(); // Asli window kholo
}
