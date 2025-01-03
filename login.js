 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

  // Your web app's Firebase configuration
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
  
   function showMessage(message, divId){
      var messageDiv=document.getElementById(divId);
      messageDiv.style.display="block";
      messageDiv.innerHTML=message;
      messageDiv.style.opacity=1;
      setTimeout(function(){
          messageDiv.style.opacity=0;
      },5000);
   }

  const login=document.getElementById('login-button');
  login.addEventListener('click', (event)=>{
     event.preventDefault();
     const email=document.getElementById('login-email').value;
     const password=document.getElementById('login-password').value;
     const auth=getAuth();
 
     signInWithEmailAndPassword(auth, email,password)
     .then((userCredential)=>{
         showMessage('login is successful', 'loginMessage');
         const user=userCredential.user;
         localStorage.setItem('loggedInUserId', user.uid);
         window.location.href='index.html';
     })
     .catch((error)=>{
         const errorCode=error.code;
         if(errorCode==='auth/invalid-credential'){
             showMessage('Incorrect Email or Password', 'loginMessage');
         }
         else{
             showMessage('Account does not Exist', 'loginMessage');
         }
     })
  })