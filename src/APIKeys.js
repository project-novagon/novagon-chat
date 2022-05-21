import firebase from 'firebase/compat/app';

function initApp(){   
    firebase.initializeApp({
        apiKey: "AIzaSyANfFC73ZCDECWC7QnU-2DZmbnNwcYSiCQ",
        authDomain: "idevs-chat-app.firebaseapp.com",
        databaseURL: "https://idevs-chat-app-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "idevs-chat-app",
        storageBucket: "idevs-chat-app.appspot.com",
        messagingSenderId: "912253802832",
        appId: "1:912253802832:web:ca09700061d4f1705ff455",
        measurementId: "G-Q9CLKNEVMH"
        
    });
}

export default initApp;