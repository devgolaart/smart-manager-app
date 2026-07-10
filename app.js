// Devide App - Drive Style Folder Grid System

document.addEventListener('DOMContentLoaded', () => {
    loadSavedFiles();
    createFullViewModal();
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

// Drive Layout Card with Local Menu
function createMediaCard(fileData) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const mediaGrid = document.getElementById('mediaGrid');
    const card = document.createElement('div');
    card.className = 'media-card';
    card.setAttribute('data-id', fileData.id);
    
    // Google Drive jaisa premium dark/light card design
    card.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 12px; padding: 12px; margin: 8px; text-align: left; background-color: #f8f9fa; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; display: inline-block; width: 155px; vertical-align: top;';

    let contentHTML = '';

    if (fileData.type === 'image') {
        contentHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #5f6368;">🖼️</span>
                <span onclick="toggleCardMenu(event, ${fileData.id})" style="font-size: 18px; color: #5f6368; cursor: pointer; font-weight: bold; padding: 0 5px;">&#8942;</span>
            </div>
            <div onclick="openAdvancedFullView('${fileData.src}')" style="width: 100%; height: 100px; border-radius: 8px; overflow: hidden; cursor: pointer; background: #e8eaed; display: flex; align-items: center; justify-content: center;">
                <img src="${fileData.src}" alt="${fileData.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        `;
    } else {
        contentHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #28a745;">📄</span>
                <span onclick="toggleCardMenu(event, ${fileData.id})" style="font-size: 18px; color: #5f6368; cursor: pointer; font-weight: bold; padding: 0 5px;">&#8942;</span>
            </div>
            <div style="width: 100%; height: 100px; border-radius: 8px; background: #e8eaed; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                📄
            </div>
        `;
    }

    // Dropdown Action Menu for individual Card
    card.innerHTML = contentHTML + `
        <p id="title-${fileData.id}" style="font-size: 13px; font-weight: 500; margin: 8px 0 0 0; color: #3c4043; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${fileData.name}</p>
        
        <div id="dropdown-${fileData.id}" class="card-dropdown" style="display: none; position: absolute; top: 30px; right: 10px; background: #ffffff; border: 1px solid #dadce0; border-radius: 8px; width: 120px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); z-index: 100;">
            <div onclick="renameFileFromCard(event, ${fileData.id})" style="padding: 8px 12px; font-size: 13px; color: #3c4043; cursor: pointer; border-bottom: 1px solid #f1f3f4;">✏️ Rename</div>
            <div onclick="deleteFileFromCard(event, ${fileData.id})" style="padding: 8px 12px; font-size: 13px; color: #d93025; cursor: pointer;">🗑️ Delete</div>
        </div>
    `;

    mediaGrid.appendChild(card);
}

// Card ke individual three dots toggle karne ke liye
function toggleCardMenu(e, id) {
    e.stopPropagation();
    // Saare khule huye dropdowns ko pehle band karo
    document.querySelectorAll('.card-dropdown').forEach(menu => {
        if(menu.id !== `dropdown-${id}`) menu.style.display = 'none';
    });
    
    const targetMenu = document.getElementById(`dropdown-${id}`);
    targetMenu.style.display = targetMenu.style.display === 'block' ? 'none' : 'block';
}

// Screen par kahi bhi click ho toh menu band ho jaye
document.addEventListener('click', () => {
    document.querySelectorAll('.card-dropdown').forEach(menu => menu.style.display = 'none');
});

// ====== CARD MENUS ACTIONS ======

function renameFileFromCard(e, id) {
    e.stopPropagation();
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    const targetFile = files.find(f => f.id === id);
    
    if (targetFile) {
        const newName = prompt("Naya naam daalein:", targetFile.name);
        if (newName && newName.trim() !== "") {
            files = files.map(f => {
                if (f.id === id) f.name = newName;
                return f;
            });
            localStorage.setItem('devide_files', JSON.stringify(files));
            document.getElementById(`title-${id}`).innerText = newName;
        }
    }
}

function deleteFileFromCard(e, id) {
    e.stopPropagation();
    if (confirm("Kya aap ise delete karna chahte hain?")) {
        deleteFile(id);
    }
}

// ====== CORE ENGINES ======

function openAdvancedFullView(src) {
    let modal = document.getElementById('simpleModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'simpleModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 99999; display: flex; justify-content: center; align-items: center; cursor: pointer;';
        modal.innerHTML = '<img id="simpleImg" src="" style="max-width: 95%; max-height: 85%; border-radius: 8px;">';
        modal.addEventListener('click', () => modal.style.display = 'none');
        document.body.appendChild(modal);
    }
    document.getElementById('simpleImg').src = src;
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
