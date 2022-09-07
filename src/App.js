import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className='h-[10vh] sticky top-0 dark:bg-zinc-900 bg-zinc-50 flex items-center justify-between'>
        <h1 className='font-albertsans font-bold text-xl'>Novagon Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const Gprovider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(Gprovider).catch(alert);
  }
  const signInWithGitHub = () => {
    const GHprovider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(GHprovider).catch(alert);
  }
  const signInWithAsGuest = () => {
    auth.signInAnonymously().catch(alert);
  }
  const signInWithFaceBook = () => {
    const FBprovider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(FBprovider).catch(console.log);
  }
  const signInWithEmail = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).catch(console.log);
  }
  const CreateWithEmail = () => {
    const email = document.getElementById('cemail').value;
    const password = document.getElementById('cpassword').value;
    auth.createUserWithEmailAndPassword(email, password).catch(console.log);
  }
  return (

    <>
      <h2>Sign In</h2>
      <form onSubmit={signInWithEmail}>
        <label>Email:</label>
        <input type='email' id='email' />
        <label>Password:</label>
        <input type='password' id='password' />
        <button type='submit'>Sign In</button>
      </form>
      <h2>Sign Up</h2>
      <form onSubmit={CreateWithEmail}>
        <label>Email:</label>
        <input type='email' id='cemail' />
        <label>Password:</label>
        <input type='password' id='cpassword' />
        <button type='submit'>Create</button>
      </form>
      <h2>Or Sign In With</h2>
      <div className='a'>

        <div className="grid">
          <button className="sign-in grelement" onClick={signInWithGoogle}>Google</button>
          <button className="sign-in grelement" onClick={signInWithGitHub}>GitHub</button>
          <button className="sign-in grelement" onClick={signInWithFaceBook}>Facebook</button>
          <button className="sign-in grelement" onClick={signInWithAsGuest}>As a guest</button>
        </div>
      </div>
      <p>Do not violate the ToS or you will be banned!</p>
    </>
  )

}
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(1000);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form className='MessageSender' onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className="leading-3 w-96 text-xs px-1 dark:text-black font-albertsans opacity-100" placeholder="What's on your mind?" />

      <button class="dark:bg-zinc-600 bg-primaryBlue-primary" type="submit" disabled={!formValue}>Send <span role="img" aria-label="Send Emoji">✈️</span></button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{displayName}</p>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="The Profile placeholer" />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
