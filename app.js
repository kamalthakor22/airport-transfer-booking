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

// Fetch and render bookings
async function loadBookings() {
  const tableBody = document.querySelector("#bookingsTable tbody");
  tableBody.innerHTML = ""; // Clear old data

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
        <td><button onclick="deleteBooking('${docSnap.id}')">Delete</button></td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

// Delete booking
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  try {
    await deleteDoc(doc(db, "bookings", id));
    alert("Booking deleted successfully!");
    loadBookings(); // Reload table
  } catch (err) {
    console.error("Error deleting booking:", err);
    alert("Failed to delete booking.");
  }
}

// Expose deleteBooking globally (needed for onclick in HTML)
window.deleteBooking = deleteBooking;

// Load bookings when page loads
window.onload = loadBookings;

