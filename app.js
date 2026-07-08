// Devide App - Live Local Upload & Preview System
document.getElementById('fileUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        // Purane "No files uploaded yet" wale message ko hatane ke liye
        const emptyMsg = document.querySelector('.empty-msg');
        if (emptyMsg) {
            emptyMsg.style.display = 'none';
        }

        // Naya media card banane ke liye
        const mediaGrid = document.getElementById('mediaGrid');
        const card = document.createElement('div');
        card.className = 'media-card';
        card.style.border = '1px solid #ddd';
        card.style.borderRadius = '8px';
        card.style.padding = '10px';
        card.style.margin = '10px';
        card.style.textAlign = 'center';
        card.style.backgroundColor = '#fff';
        card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

        // Agar file image h toh uska preview dikhao
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                card.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}" style="max-width: 100%; max-height: 150px; border-radius: 4px; object-fit: cover;">
                    <p style="font-size: 12px; margin-top: 8px; color: #333; word-break: break-all;">${file.name}</p>
                `;
            };
            reader.readAsDataURL(file);
        } else {
            // Agar PDF ya koi aur document h
            card.innerHTML = `
                <div style="font-size: 40px; color: #28a745;">📄</div>
                <p style="font-size: 12px; margin-top: 8px; color: #333; word-break: break-all;">${file.name}</p>
            `;
        }

        // Card ko gallery grid me jodna
        mediaGrid.appendChild(card);
    }
});

// Category Filter Feature
function filterCategory(category) {
    console.log("Filter changed to: " + category);
}
