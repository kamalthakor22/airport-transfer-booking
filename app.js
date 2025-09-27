
// app.js - Firebase v9 modular

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBA4r1N4L_GwTrVrKku3lFYuj1gZIy-45w",
  authDomain: "ajaxairporttransfer.firebaseapp.com",
  projectId: "ajaxairporttransfer",
  storageBucket: "ajaxairporttransfer.firebasestorage.app",
  messagingSenderId: "664561343575",
  appId: "1:664561343575:web:3132b18dfa6ba41118d712"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Booking Form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const booking = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      pickup: document.getElementById('pickup').value,
      dropoff: document.getElementById('dropoff').value,
      datetime: document.getElementById('datetime').value,
      tripType: document.getElementById('tripType').value,
      referral: document.getElementById('referral').value,
      notes: document.getElementById('notes').value,
      timestamp: new Date()
    };
    try {
      await addDoc(collection(db, "bookings"), booking);
      document.getElementById('confirmation').innerText = "Booking successful!";
      bookingForm.reset();
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  });
}

// Admin Login
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.getElementById('adminLoginForm').style.display = "none";
      document.getElementById('logoutBtn').style.display = "block";
      document.getElementById('adminPanel').style.display = "block";
      loadBookings();
    } catch (err) { alert(err.message); }
  });
}

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await signOut(auth);
  document.getElementById('adminLoginForm').style.display = "block";
  document.getElementById('logoutBtn').style.display = "none";
  document.getElementById('adminPanel').style.display = "none";
});

// Load Bookings
async function loadBookings() {
  const tbody = document.querySelector("#bookingsTable tbody");
  tbody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "bookings"));
  snapshot.forEach(docSnap => {
    const b = docSnap.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.email}</td>
      <td>${b.pickup}</td>
      <td>${b.dropoff}</td>
      <td>
        <button onclick="openModal('${docSnap.id}', '${b.name}', '${b.email}', '${b.pickup}', '${b.dropoff}')">Edit</button>
        <button onclick="deleteBooking('${docSnap.id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}
window.loadBookings = loadBookings;

// Delete Booking
async function deleteBooking(id) {
  if (!confirm("Delete this booking?")) return;
  await deleteDoc(doc(db, "bookings", id));
  loadBookings();
}
window.deleteBooking = deleteBooking;

// Edit Modal
function openModal(id, name, email, pickup, dropoff) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPickup").value = pickup;
  document.getElementById("editDropoff").value = dropoff;
  document.getElementById("editModal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}
function closeModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
window.openModal = openModal;
window.closeModal = closeModal;

// Handle edit form submit
document.getElementById("editForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  await updateDoc(doc(db, "bookings", id), {
    name: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    pickup: document.getElementById("editPickup").value,
    dropoff: document.getElementById("editDropoff").value,
    updatedAt: new Date()
  });
  closeModal();
  loadBookings();
});
