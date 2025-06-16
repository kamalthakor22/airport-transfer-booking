document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const booking = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    pickup: document.getElementById('pickup').value,
    datetime: document.getElementById('datetime').value,
    tripType: document.getElementById('tripType').value,
    notes: document.getElementById('notes').value,
    timestamp: new Date()
  };

  try {
    await db.collection("bookings").add(booking);
    document.getElementById('confirmation').innerText = "Booking submitted successfully!";
    document.getElementById('bookingForm').reset();
  } catch (error) {
    alert("Error saving booking. Please try again.");
  }
});
