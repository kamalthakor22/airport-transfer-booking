// app.js (must be type="module")

// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDocs, collection, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔑 Firebase Config (replace with your real one)
const firebaseConfig = {
  apiKey: "AIzaSyBA4r1N4L_GwTrVrKku3lFYuj1gZIy-45w",
  authDomain: "ajaxairporttransfer.firebaseapp.com",
  projectId: "ajaxairporttransfer",
  storageBucket: "ajaxairporttransfer.firebasestorage.app",
  messagingSenderId: "664561343575",
  appId: "1:664561343575:web:3132b18dfa6ba41118d712"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Handle form submit
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  try {
    await addDoc(collection(db, "bookings"), {
      name,
      email,
      pickup,
      dropoff,
      timestamp: new Date()
    });
    alert("Booking saved successfully!");
    e.target.reset();
  } catch (err) {
    console.error("Error adding booking:", err);
    alert("Failed to save booking.");
  }
});

// Example Admin Login
async function adminLogin(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("Admin logged in:", userCred.user);
  } catch (err) {
    console.error("Login error:", err.message);
  }
}

// Example Admin Logout
function adminLogout() {
  signOut(auth).then(() => console.log("Logged out"));
}

// Load bookings into the table
async function loadBookings() {
  const tableBody = document.querySelector("#bookingsTable tbody");
  tableBody.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    querySnapshot.forEach((docSnap) => {
      const booking = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${booking.name}</td>
        <td>${booking.email}</td>
        <td>${booking.pickup}</td>
        <td>${booking.dropoff}</td>
        <td>
          <button onclick="openModal('${docSnap.id}', '${booking.name}', '${booking.email}', '${booking.pickup}', '${booking.dropoff}')">Edit</button>
          <button onclick="deleteBooking('${docSnap.id}')">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

// Open modal with booking details
function openModal(id, name, email, pickup, dropoff) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPickup").value = pickup;
  document.getElementById("editDropoff").value = dropoff;

  document.getElementById("editModal").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Handle form submit (update booking)
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  const pickup = document.getElementById("editPickup").value;
  const dropoff = document.getElementById("editDropoff").value;

  try {
    await updateDoc(doc(db, "bookings", id), {
      name,
      email,
      pickup,
      dropoff,
      updatedAt: new Date()
    });

    alert("Booking updated successfully!");
    closeModal();
    loadBookings(); // refresh table
  } catch (err) {
    console.error("Error updating booking:", err);
    alert("Failed to update booking.");
  }
});

// Delete booking
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  try {
    await deleteDoc(doc(db, "bookings", id));
    alert("Booking deleted successfully!");
    loadBookings();
  } catch (err) {
    console.error("Error deleting booking:", err);
    alert("Failed to delete booking.");
  }
}

// Expose global functions (needed for onclick in HTML)
window.openModal = openModal;
window.closeModal = closeModal;
window.deleteBooking = deleteBooking;

// Load bookings on page load
window.onload = loadBookings;


