import { getFirestore, collection, query, orderBy, limit, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

    const firebaseConfig = {
    apiKey: "AIzaSyCj0lxs1588Ogafmm2kxKi9aU2tgeeXylc",
    authDomain: "typerivals-1b81f.firebaseapp.com",
    projectId: "typerivals-1b81f",
    storageBucket: "typerivals-1b81f.firebasestorage.app",
    messagingSenderId: "1061729646309",
    appId: "1:1061729646309:web:366485352b14c596be060c"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
  
  async function populateLeaderboard() {
      try {
          const usersSnapshot = await getDocs(collection(db, "users"));
          const userScores = [];
  
          for (const userDoc of usersSnapshot.docs) {
              const userId = userDoc.id;
              const resultsRef = collection(db, "users", userId, "results");
              const q = query(resultsRef, orderBy("score", "desc"), limit(1));
              const topScoreSnapshot = await getDocs(q);
  
              if (!topScoreSnapshot.empty) {
                  const topScoreDoc = topScoreSnapshot.docs[0];
                  userScores.push({
                      userId: userId,
                      score: topScoreDoc.data().score,
                  });
              }
          }
  
          userScores.sort((a, b) => b.score - a.score);
  
          leaderboardTableBody.innerHTML = "";
          let rank = 1;
  
          for (const entry of userScores) {
              try {
                  const userDoc = await getDoc(doc(db, "users", entry.userId));
                  const userData = userDoc.data();
  
                  const row = leaderboardTableBody.insertRow();
    const rankCell = row.insertCell();
    const usernameCell = row.insertCell(); // Get the username cell
    usernameCell.classList.add('username-cell') //Add class to username cell
    const scoreCell = row.insertCell();

    rankCell.textContent = rank++;

    // Create container for image and username
    const usernameContainer = document.createElement('div');
    usernameContainer.classList.add('username-cell')

    const profilePicture = document.createElement('img');
    profilePicture.src = userData?.profilePictureUrl || "placeholder.jpg";
    profilePicture.alt = `${userData?.username || "Unknown"}'s Profile Picture`;
    profilePicture.classList.add('profile-picture');

    const usernameText = document.createTextNode(userData?.username || "Anonymous");

    usernameContainer.appendChild(profilePicture);
    usernameContainer.appendChild(usernameText);
    usernameCell.appendChild(usernameContainer);
                  scoreCell.textContent = Math.round(entry.score);
  
              } catch (userError) {
                  console.error("Error fetching user data:", userError);
              }
          }
      } catch (error) {
          console.error("Error fetching leaderboard data:", error);
      }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      populateLeaderboard();
  });