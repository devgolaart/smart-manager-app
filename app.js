// App ka logic check karne ke liye test code
console.log("Smart Manager App successfully loaded!");

// Voice search button par click karne par kya hoga
document.getElementById('voiceBtn').addEventListener('click', function() {
    alert("🎤 Voice Search feature coming soon! Hum isme free voice feature jodinge.");
});

// File upload check karne ke liye
document.getElementById('fileUpload').addEventListener('change', function(e) {
    const fileName = e.target.files[0].name;
    alert("📁 Aapne select kiya: " + fileName + "\nAgli bar hum ise free storage me save karenge!");
});

// Category filter function
function filterCategory(category) {
    alert("Folder filter changed to: " + category);
}
