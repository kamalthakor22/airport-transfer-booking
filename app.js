// app.js (must be type="module")

// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔑 Firebase Config (replace with your real one)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
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
