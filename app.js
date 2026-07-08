// Devide App - Permanent Storage with Premium Full Screen Actions Menu

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
            <p id="title-${fileData.id}" style="font-size: 11px; margin-top: 8px; color: #333; word-break: break-all; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fileData.name}</p>
            <button class="delete-btn" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; line-height: 18px; z-index: 10;">X</button>
        `;

        card.querySelector('.clickable-img').addEventListener('click', function() {
            openAdvancedFullView(fileData);
        });

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

// Advanced Full Screen View Window with Three Dots Menu
let currentActiveFile = null;

function openAdvancedFullView(fileData) {
    currentActiveFile = fileData;
    let modal = document.getElementById('premiumModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'premiumModal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 99999; display: flex; justify-content: center; align-items: center;';
        modal.innerHTML = `
            <span onclick="closePremiumModal()" style="position: absolute; top: 20px; left: 20px; color: #fff; font-size: 30px; cursor: pointer; font-weight: bold; z-index: 100001;">&times;</span>
            
            <div style="position: absolute; top: 20px; right: 20px; z-index: 100001;">
                <span onclick="toggleActionMenu(event)" style="color: #fff; font-size: 30px; cursor: pointer; padding: 0 10px; font-weight: bold;">&#8942;</span>
                <div id="actionMenu" style="display: none; position: absolute; top: 40px; right: 10px; background: #222; border: 1px solid #444; border-radius: 8px; width: 140px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                    <div onclick="handleDownload()" style="color: #fff; padding: 10px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #333;">📥 Download</div>
                    <div onclick="handleRename()" style="color: #fff; padding: 10px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #333;">✏️ Rename</div>
                    <div onclick="handleShare()" style="color: #fff; padding: 10px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #333;">🔗 Share</div>
                    <div onclick="handleCrop()" style="color: #fff; padding: 10px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #333;">✂️ Crop (Info)</div>
                    <div onclick="handleDeleteFromMenu()" style="color: red; padding: 10px; cursor: pointer; font-size: 14px;">🗑️ Delete</div>
                </div>
            </div>

            <img id="premiumImg" src="" style="max-width: 95%; max-height: 80%; border-radius: 8px;">
        `;
        document.body.appendChild(modal);
        
        // Background click par menu close hona chahiye
        modal.addEventListener('click', function(e) {
            if(e.target === modal || e.target === document.getElementById('premiumImg')) {
                document.getElementById('actionMenu').style.display = 'none';
            }
        });
    }
    
    document.getElementById('premiumImg').src = fileData.src;
    document.getElementById('actionMenu').style.display = 'none'; // Shuruat me menu hidden rahega
    modal.style.display = 'flex';
}

function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) modal.style.display = 'none';
}

function toggleActionMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('actionMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ====== MENU OPERATIONS ======

// 1. Download Feature
function handleDownload() {
    if (!currentActiveFile) return;
    const link = document.createElement('a');
    link.href = currentActiveFile.src;
    link.download = currentActiveFile.name || 'devide-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 2. Rename Feature
function handleRename() {
    if (!currentActiveFile) return;
    const currentName = currentActiveFile.name;
    const newName = prompt("Naya naam likhiye:", currentName);
    
    if (newName && newName.trim() !== "") {
        let files = JSON.parse(localStorage.getItem('devide_files')) || [];
        files = files.map(file => {
            if (file.id === currentActiveFile.id) {
                file.name = newName;
                currentActiveFile.name = newName; // Active state update
            }
            return file;
        });
        localStorage.setItem('devide_files', JSON.stringify(files));
        
        // UI me naam update karna
        const titleText = document.getElementById(`title-${currentActiveFile.id}`);
        if (titleText) titleText.innerText = newName;
        
        alert("Naam badal diya gaya!");
        document.getElementById('actionMenu').style.display = 'none';
    }
}

// 3. Share Feature
function handleShare() {
    if (!currentActiveFile) return;
    if (navigator.share) {
        navigator.share({
            title: currentActiveFile.name,
            text: 'Devide App se share ki gayi photo',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Link copied! Aap is app ke link ko share kar sakte hain.");
    }
    document.getElementById('actionMenu').style.display = 'none';
}

// 4. Crop Feature (Premium notification setup)
function handleCrop() {
    alert("✂️ Crop & AI Editing feature agli baar Database updates ke sath pure-scale par active hoga!");
    document.getElementById('actionMenu').style.display = 'none';
}

// 5. Delete From Menu
function handleDeleteFromMenu() {
    if (!currentActiveFile) return;
    if (confirm("Kya aap sach me ye file delete karna chahte hain?")) {
        deleteFile(currentActiveFile.id);
        closePremiumModal();
    }
}

// ====== BASE ENGINE CORE ======

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
