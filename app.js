// app.js (load with <script type="module" src="app.js"></script>)

// ----- Firebase imports -----
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ----- Firebase config -----
const firebaseConfig = {
  apiKey: "AIzaSyBA4r1N4L_GwTrVrKku3lFYuj1gZIy-45w",
  authDomain: "ajaxairporttransfer.firebaseapp.com",
  projectId: "ajaxairporttransfer",
  storageBucket: "ajaxairporttransfer.firebasestorage.app",
  messagingSenderId: "664561343575",
  appId: "1:664561343575:web:3132b18dfa6ba41118d712"
};

// ----- Initialize Firebase -----
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ======= CUSTOMER BOOKING FORM =======
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
      console.error("Booking error:", err);
      alert("Failed to submit booking.");
    }
  });
}

// ======= ADMIN LOGIN =======
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
    } catch (err) {
      console.error("Admin login error:", err);
      alert("Login failed: " + err.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    document.getElementById('adminLoginForm').style.display = "block";
    document.getElementById('logoutBtn').style.display = "none";
    document.getElementById('adminPanel').style.display = "none";
  });
}

// ======= LOAD BOOKINGS TABLE =======
async function loadBookings() {
  const tableBody = document.querySelector("#bookingsTable tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    snapshot.forEach(docSnap => {
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
    console.error("Load bookings error:", err);
  }
}

// ======= DELETE BOOKING =======
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  try {
    await deleteDoc(doc(db, "bookings", id));
    alert("Booking deleted successfully!");
    loadBookings();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete booking.");
  }
}

// Expose deleteBooking globally for HTML onclick
window.deleteBooking = deleteBooking;

// ======= EDIT BOOKING MODAL =======
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
    loadBookings();
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update booking.");
  }
});

// Expose modal functions globally
window.openModal = openModal;
window.closeModal = closeModal;

// ======= INITIAL LOAD =======
window.onload = () => {
  loadBookings();
};
