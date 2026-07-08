// Devide App - Permanent Storage with Full Screen Preview

document.addEventListener('DOMContentLoaded', () => {
    loadSavedFiles();
    createFullViewModal(); // Full screen view ka box taiyar karna
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
        // Img par onclick lagaya h full view ke liye
        card.innerHTML = `
            <img src="${fileData.src}" onclick="openFullView('${fileData.src}')" alt="${fileData.name}" style="width: 100%; height: 100px; border-radius: 4px; object-fit: cover;">
            <p style="font-size: 11px; margin-top: 8px; color: #333; word-break: break-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</p>
            <button onclick="event.stopPropagation(); deleteFile(${fileData.id})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px; z-index: 10;">X</button>
        `;
    } else {
        card.innerHTML = `
            <div style="font-size: 40px; color: #28a745;">📄</div>
            <p style="font-size: 11px; margin-top: 8px; color: #333; word-break: break-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</p>
            <button onclick="event.stopPropagation(); deleteFile(${fileData.id})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px; z-index: 10;">X</button>
        `;
    }

    mediaGrid.appendChild(card);
}

// Full Screen View Box (Modal) HTML me jodhna
function createFullViewModal() {
    if (!document.getElementById('fullViewModal')) {
        const modal = document.createElement('div');
        modal.id = 'fullViewModal';
        modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; justify-content: center; align-items: center;';
        modal.innerHTML = `
            <span onclick="closeFullView()" style="position: absolute; top: 20px; right: 25px; color: #fff; font-size: 35px; font-weight: bold; cursor: pointer;">&times;</span>
            <img id="fullViewImg" src="" style="max-width: 90%; max-height: 80%; border-radius: 8px; box-shadow: 0 0 20px rgba(21, 150, 240, 0.5);">
        `;
        document.body.appendChild(modal);
    }
}

function openFullView(src) {
    const modal = document.getElementById('fullViewModal');
    const modalImg = document.getElementById('fullViewImg');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.style.display = 'flex';
    }
}

function closeFullView() {
    const modal = document.getElementById('fullViewModal');
    if (modal) modal.style.display = 'none';
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

function filterCategory(category) {
    console.log("Filter changed to: " + category);
}
