// Devide App - Permanent Local Storage System

// 1. Page load hote hi purani saved photos ko load karna
document.addEventListener('DOMContentLoaded', loadSavedFiles);

document.getElementById('fileUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = {
                    id: Date.now(),
                    name: file.name,
                    src: e.target.result,
                    type: 'image'
                };
                
                // Screen par dikhao aur local storage me save karo
                createMediaCard(fileData);
                saveFileToLocalStorage(fileData);
            };
            reader.readAsDataURL(file);
        } else {
            // PDF ya anya documents ke liye
            const fileData = {
                id: Date.now(),
                name: file.name,
                src: '',
                type: 'doc'
            };
            createMediaCard(fileData);
            saveFileToLocalStorage(fileData);
        }
    }
});

// Screen par Card banane ka function
function createMediaCard(fileData) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const mediaGrid = document.getElementById('mediaGrid');
    const card = document.createElement('div');
    card.className = 'media-card';
    card.setAttribute('data-id', fileData.id);
    card.style.cssText = 'border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin: 10px; text-align: center; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative;';

    if (fileData.type === 'image') {
        card.innerHTML = `
            <img src="${fileData.src}" alt="${fileData.name}" style="max-width: 100%; max-height: 150px; border-radius: 4px; object-fit: cover;">
            <p style="font-size: 12px; margin-top: 8px; color: #333; word-break: break-all;">${fileData.name}</p>
            <button onclick="deleteFile(${fileData.id})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px;">X</button>
        `;
    } else {
        card.innerHTML = `
            <div style="font-size: 40px; color: #28a745;">📄</div>
            <p style="font-size: 12px; margin-top: 8px; color: #333; word-break: break-all;">${fileData.name}</p>
            <button onclick="deleteFile(${fileData.id})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px;">X</button>
        `;
    }

    mediaGrid.appendChild(card);
}

// Local Storage me save karne ka function
function saveFileToLocalStorage(fileData) {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    files.push(fileData);
    localStorage.setItem('devide_files', JSON.stringify(files));
}

// Saved files ko load karne ka function
function loadSavedFiles() {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    if (files.length > 0) {
        files.forEach(fileData => createMediaCard(fileData));
    }
}

// File delete karne ka function
function deleteFile(id) {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    files = files.filter(file => file.id !== id);
    localStorage.setItem('devide_files', JSON.stringify(files));
    
    // Screen se hatana
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) card.remove();
    
    // Agar sab delete ho gaya toh wapas message dikhao
    if (files.length === 0) {
        const emptyMsg = document.querySelector('.empty-msg');
        if (emptyMsg) emptyMsg.style.display = 'block';
    }
}

function filterCategory(category) {
    console.log("Filter changed to: " + category);
}
