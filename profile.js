// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj0lxs1588Ogafmm2kxKi9aU2tgeeXylc",
  authDomain: "typerivals-1b81f.firebaseapp.com",
  projectId: "typerivals-1b81f",
  storageBucket: "typerivals-1b81f.appspot.com",
  messagingSenderId: "1061729646309",
  appId: "1:1061729646309:web:366485352b14c596be060c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const profileImage = document.getElementById('profile-image');
const profilePictureOptions = document.getElementById('profile-picture-options');
const profilePictureOptionImages = document.querySelectorAll('.profile-picture-option');
const displayUsername = document.getElementById('display-username');
const displayEmail = document.getElementById('display-email');
const displayBestScore = document.getElementById('display-best-score');
const displayAverageScore = document.getElementById('display-average-score');
const displayAverageWPM = document.getElementById('display-average-wpm');
const displayTotalTests = document.getElementById('display-total-tests');
const saveProfileButton = document.getElementById('save-profile');


onAuthStateChanged(auth, async (user) => {
  if (user) {
    const loggedInUserId = user.uid;
    const userDocRef = doc(db, "users", loggedInUserId);

    try {
      // Fetch user document
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("Fetched user data:", userData);

        // Update user info in UI
        displayUsername.innerText = userData.username || "Unknown";
        displayEmail.innerText = userData.email || "Unknown";
        profileImage.src = userData.profilePictureUrl || "Profile Pics/default.jpg";  // Updated to match your path

        // Fetch results subcollection
        const resultsCollectionRef = collection(db, `users/${loggedInUserId}/results`);
        const resultsSnapshot = await getDocs(resultsCollectionRef);

        let totalScore = 0;
        let totalWPM = 0;
        let totalTests = 0;
        let bestScore = 0;

        resultsSnapshot.forEach((doc) => {
          const resultData = doc.data();
          totalTests += 1;
          totalScore += resultData.score || 0;
          totalWPM += resultData.wpm || 0;

          if (resultData.score > bestScore) {
            bestScore = resultData.score;
          }
        });

        // Calculate averages
        const averageScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;
        const averageWPM = totalTests > 0 ? (totalWPM / totalTests).toFixed(2) : 0;

        // Update stats in UI
        displayBestScore.innerText = bestScore;
        displayAverageScore.innerText = averageScore;
        displayAverageWPM.innerText = averageWPM;
        displayTotalTests.innerText = totalTests;
      } else {
        console.log("No user document found for user:", loggedInUserId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

profileImage.addEventListener('click', () => {
  profilePictureOptions.classList.toggle('show');
});

profilePictureOptionImages.forEach(option => {
  option.addEventListener('click', async () => {
    profileImage.src = option.src;
    profilePictureOptions.classList.remove('show');

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      await setDoc(userDocRef, { profilePictureUrl: option.src }, { merge: true });
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  });
});

saveProfileButton.addEventListener('click', () => {
    console.log("save-profile clicked"); // Check if the click is registered
    alert("Profile Saved.");
    const profilePicture = document.getElementById('profile-image').files[0];
    console.log("profile-image:", profilePicture); // Check if file is selected
 
    if (!profilePicture) {
        alert("No image selected.");
        return;
    }
 
    const reader = new FileReader();
    console.log("FileReader created:", reader);
 
    reader.onload = (event) => {
        console.log("reader.onload called"); // Check if onload is triggered
        const imageDataUrl = event.target.result;
        localStorage.setItem('profile-image', imageDataUrl);
        if (profileImage) {
            profileImage.src = imageDataUrl;
        } else {
            console.error("profileImage element not found.");
        }
        alert("Profile picture saved.");
    };
 
    reader.onerror = () => {
        console.log("reader.onerror called"); // Check if onerror is triggered
        alert("Error reading file.");
    };
 
    reader.readAsDataURL(profilePicture);
    console.log("reader.readAsDataURL called");
 });
