  // Import Firebase SDK modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
  import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

  // Firebase configuration
  const firebaseConfig = {
      apiKey: "AIzaSyCj0lxs1588Ogafmm2kxKi9aU2tgeeXylc",
      authDomain: "typerivals-1b81f.firebaseapp.com",
      projectId: "typerivals-1b81f",
      storageBucket: "typerivals-1b81f.firebasestorage.app",
      messagingSenderId: "1061729646309",
      appId: "1:1061729646309:web:366485352b14c596be060c"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const historyTableBody = document.getElementById('history-table').getElementsByTagName('tbody')[0];

  // Check authentication state
  onAuthStateChanged(auth, async (user) => {
      if (user) {
          const userId = user.uid; // Current user's UID
          const resultsCollection = collection(db, "users", userId, "results");
          const q = query(resultsCollection, orderBy("timestamp", "desc"));

          // Listen for changes in the Firestore query
          onSnapshot(q, (querySnapshot) => {
              historyTableBody.innerHTML = ""; // Clear previous results
              querySnapshot.forEach((doc) => {
                  const result = doc.data();
                  const date = result.timestamp.toDate().toLocaleString(); // Format the timestamp
                  const row = historyTableBody.insertRow();
                  row.insertCell().textContent = date;
                  row.insertCell().textContent = result.duration;
                  row.insertCell().textContent = result.difficulty;
                  row.insertCell().textContent = result.score;
                  row.insertCell().textContent = result.accuracy;
                  row.insertCell().textContent = result.wpm;
              });
          });
      } else {
          window.location.href = "login.html"; // Redirect to login if not authenticated
      }
  });