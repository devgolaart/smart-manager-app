// Devide App - Permanent Storage with Automatic Full Screen View

document.addEventListener('DOMContentLoaded', () => {
    loadSavedFiles();
});

document.getElementById('fileUpload').addEventListener('change', function(event) {
    const files = event.target.files;
    
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileData = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: e.target.result,
                        type: 'image'
                    };
                    createMediaCard(fileData);
                    saveFileToLocalStorage(fileData);
                };
                reader.readAsDataURL(file);
            } else {
                const fileData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: '',
                    type: 'doc'
                };
                createMediaCard(fileData);
                saveFileToLocalStorage(fileData);
            }
        });
    }
});

function createMediaCard(fileData) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const mediaGrid = document.getElementById('mediaGrid');
    const card = document.createElement('div');
    card.className = 'media-card';
    card.setAttribute('data-id', fileData.id);
    card.style.cssText = 'border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin: 10px; text-align: center; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative; display: inline-block; width: 140px; vertical-align: top; cursor: pointer;';

    if (fileData.type === 'image') {
        card.innerHTML = `
            <img src="${fileData.src}" class="clickable-img" alt="${fileData.name}" style="width: 100%; height: 100px; border-radius: 4px; object-fit: cover;">
            <p style="font-size: 11px; margin-top: 8px; color: #333; word-break: break-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</p>
            <button class="delete-btn" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px; z-index: 10;">X</button>
        `;

        // Direct photo par click event lagana
        card.querySelector('.clickable-img').addEventListener('click', function() {
            openDirectFullView(fileData.src);
        });

        // Delete button ka event
        card.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteFile(fileData.id);
        });

    } else {
        card.innerHTML = `
            <div style="font-size: 40px; color: #28a745;">📄</div>
            <p style="font-size: 11px; margin-top: 8px; color: #333; word-break: break-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</p>
            <button class="delete-btn" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px; z-index: 10;">X</button>
        `;
        
        card.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteFile(fileData.id);
        });
    }

    mediaGrid.appendChild(card);
}

// Ekdum simple direct full view banane ka tarika
function openDirectFullView(src) {
    let modal = document.getElementById('dynamicModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dynamicModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 99999; display: flex; justify-content: center; align-items: center; cursor: pointer;';
        modal.innerHTML = '<img id="dynamicImg" src="" style="max-width: 95%; max-height: 85%; border-radius: 8px; box-shadow: 0 0 20px rgba(255,255,255,0.2);">';
        
        // Pura kali screen par kahi bhi click karo toh band ho jaye
        modal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        document.body.appendChild(modal);
    }
    
    document.getElementById('dynamicImg').src = src;
    modal.style.display = 'flex';
}

function saveFileToLocalStorage(fileData) {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    files.push(fileData);
    localStorage.setItem('devide_files', JSON.stringify(files));
}

function loadSavedFiles() {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    if (files.length > 0) {
        files.forEach(fileData => createMediaCard(fileData));
    }
}

function deleteFile(id) {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    files = files.filter(file => file.id !== id);
    localStorage.setItem('devide_files', JSON.stringify(files));
    
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) card.remove();
    
    if (files.length === 0) {
        const emptyMsg = document.querySelector('.empty-msg');
        if (emptyMsg) emptyMsg.style.display = 'block';
    }
}
