const auth = firebase.auth();

// Handle booking form (same as before)
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
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
    await db.collection("bookings").add(booking);
    document.getElementById('confirmation').innerText = "Booking successful!";
    document.getElementById('bookingForm').reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Admin login
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    document.getElementById('adminLoginForm').style.display = "none";
    document.getElementById('logoutBtn').style.display = "block";
    document.getElementById('adminPanel').style.display = "block";
    loadBookings();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await auth.signOut();
  document.getElementById('adminLoginForm').style.display = "block";
  document.getElementById('logoutBtn').style.display = "none";
  document.getElementById('adminPanel').style.display = "none";
});

// Load bookings (for admins only)
function loadBookings() {
  db.collection("bookings").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "booking";
      div.innerHTML = `
        <b>${data.name}</b> (${data.phone})<br>
        Pickup: ${data.pickup}<br>
        Dropoff: ${data.dropoff}<br>
        Date: ${data.datetime}<br>
        Trip: ${data.tripType}<br>
        Notes: ${data.notes || "None"}<br>
        <button onclick="deleteBooking('${doc.id}')">Delete</button>
      `;
      bookingsList.appendChild(div);
    });
  });
}

// Delete booking
async function deleteBooking(id) {
  if (confirm("Are you sure you want to delete this booking?")) {
    await db.collection("bookings").doc(id).delete();
  }
}

// PayPal button (same as before)
paypal.Buttons({
  createOrder: (data, actions) => actions.order.create({
    purchase_units: [{ amount: { value: "60.00" } }]
  }),
  onApprove: (data, actions) => actions.order.capture().then(details => {
    alert("Payment completed by " + details.payer.name.given_name);
  })
}).render('#paypal-button-container');

