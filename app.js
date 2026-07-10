// Devide App - Advanced Core File & Folder Management System

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

// Grid Dynamic Card Rendering System
function createMediaCard(fileData) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const mediaGrid = document.getElementById('mediaGrid');
    const card = document.createElement('div');
    card.className = 'media-card';
    card.setAttribute('data-id', fileData.id);
    card.setAttribute('data-type', fileData.type);
    
    card.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 12px; padding: 12px; margin: 8px; text-align: left; background-color: #f8f9fa; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; display: inline-block; width: 140px; vertical-align: top;';

    let contentHTML = '';

    if (fileData.type === 'folder') {
        contentHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #e0a800;">📁</span>
                <span onclick="toggleCardMenu(event, ${fileData.id})" style="font-size: 18px; color: #5f6368; cursor: pointer; font-weight: bold; padding: 0 5px;">&#8942;</span>
            </div>
            <div style="width: 100%; height: 100px; border-radius: 8px; background: #e8eaed; display: flex; align-items: center; justify-content: center; font-size: 45px; cursor: pointer;">
                📁
            </div>
        `;
    } else if (fileData.type === 'image') {
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

    card.innerHTML = contentHTML + `
        <p id="title-${fileData.id}" style="font-size: 13px; font-weight: 500; margin: 8px 0 0 0; color: #3c4043; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${fileData.name}</p>
        <div id="dropdown-${fileData.id}" class="card-dropdown" style="display: none; position: absolute; top: 30px; right: 10px; background: #ffffff; border: 1px solid #dadce0; border-radius: 8px; width: 120px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); z-index: 100;">
            <div onclick="renameFileFromCard(event, ${fileData.id})" style="padding: 8px 12px; font-size: 13px; color: #3c4043; cursor: pointer; border-bottom: 1px solid #f1f3f4;">✏️ Rename</div>
            <div onclick="deleteFileFromCard(event, ${fileData.id})" style="padding: 8px 12px; font-size: 13px; color: #d93025; cursor: pointer;">🗑️ Delete</div>
        </div>
    `;

    mediaGrid.appendChild(card);
}

// ====== FAB OPERATIONS LOGIC ======
function toggleFabMenu() {
    const fabBtn = document.getElementById('mainFabBtn');
    const fabOptions = document.getElementById('fabOptions');
    const fabOverlay = document.getElementById('fabOverlay');
    
    fabBtn.classList.toggle('open');
    fabOptions.classList.toggle('open');
    fabOverlay.classList.toggle('open');
    
    fabBtn.innerHTML = fabBtn.classList.contains('open') ? '✕' : '➕';
}

function handleFabAction(type) {
    toggleFabMenu(); // Menu band karein
    
    if (type === 'folder') {
        const folderName = prompt("Naye Folder ka naam likhein:");
        if (folderName && folderName.trim() !== "") {
            const folderData = {
                id: Date.now() + Math.random(),
                name: folderName.trim(),
                src: '',
                type: 'folder'
            };
            createMediaCard(folderData);
            saveFileToLocalStorage(folderData);
        }
    } else if (type === 'scan') {
        // Direct camera access default functionality hook
        const camInput = document.createElement('input');
        camInput.type = 'file';
        camInput.accept = 'image/*';
        camInput.capture = 'environment';
        camInput.onchange = (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const snapData = { id: Date.now(), name: "Scan_" + Date.now() + ".jpg", src: evt.target.result, type: 'image' };
                    createMediaCard(snapData);
                    saveFileToLocalStorage(snapData);
                };
                reader.readAsDataURL(file);
            }
        };
        camInput.click();
    } else if (type === 'docs' || type === 'sheets' || type === 'slides') {
        // Document engines generation routing structure
        const docName = prompt(`Naya Google ${type.toUpperCase()} file banayein:`, `Untitled ${type}`);
        if (docName) {
            const dummyDoc = {
                id: Date.now(),
                name: docName + ` (.${type})`,
                src: '',
                type: 'doc'
            };
            createMediaCard(dummyDoc);
            saveFileToLocalStorage(dummyDoc);
        }
    }
}

function toggleCardMenu(e, id) {
    e.stopPropagation();
    document.querySelectorAll('.card-dropdown').forEach(menu => {
        if(menu.id !== `dropdown-${id}`) menu.style.display = 'none';
    });
    const targetMenu = document.getElementById(`dropdown-${id}`);
    targetMenu.style.display = targetMenu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', () => {
    document.querySelectorAll('.card-dropdown').forEach(menu => menu.style.display = 'none');
});

function handleSidebarAction(action) {
    toggleSidebar();
    const emptyMsg = document.querySelector('.empty-msg');
    
    if (action === 'recent' || action === 'uploads' || action === 'offline') {
        loadSavedFiles();
    } else if (action === 'bin' || action === 'spam') {
        document.getElementById('mediaGrid').innerHTML = '';
        if (emptyMsg) {
            emptyMsg.style.display = 'block';
            emptyMsg.innerText = `Your ${action} folder is empty!`;
        }
    } else if (action === 'settings') {
        if (confirm("🛠️ Devide Settings:\n\nKya aap app ka saara data clear karke reset karna chahte hain?")) {
            localStorage.removeItem('devide_files');
            loadSavedFiles();
        }
    }
}

function filterCategory(category) {
    const cards = document.querySelectorAll('.media-card');
    const emptyMsg = document.querySelector('.empty-msg');
    let foundCount = 0;

    cards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (category === 'all' || (category === 'photo' && type === 'image') || (category === 'doc' && type === 'doc')) {
            card.style.display = 'inline-block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    if(foundCount === 0 && emptyMsg) {
        emptyMsg.style.display = 'block';
        emptyMsg.innerText = `No ${category}s found!`;
    } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
    }
}

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
    document.getElementById('mediaGrid').innerHTML = '';
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    if (files.length > 0) {
        files.forEach(fileData => createMediaCard(fileData));
    } else {
        const emptyMsg = document.querySelector('.empty-msg');
        if (emptyMsg) {
            emptyMsg.style.display = 'block';
            emptyMsg.innerText = "No files uploaded yet. Click plus to add!";
        }
    }
}

function deleteFile(id) {
    let files = JSON.parse(localStorage.getItem('devide_files')) || [];
    files = files.filter(file => file.id !== id);
    localStorage.setItem('devide_files', JSON.stringify(files));
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) card.remove();
    if (files.length === 0) loadSavedFiles();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    sidebar.style.width = sidebar.style.width === '250px' ? '0' : '250px';
}
