import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
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
      <header className='h-[10vh] sticky top-0 dark:bg-zinc-900 bg-zinc-50 flex items-center justify-between px-8'>
        <h1 className='text-xl font-bold font-albertsans'>Novagon Chat</h1>
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
    auth.signInWithPopup(Gprovider).catch(console.log);
  }
  const signInWithGitHub = () => {
    const GHprovider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(GHprovider).catch(console.log);
  }
  const signInWithAsGuest = () => {
    auth.signInAnonymously().catch(console.log);
  }
  const signInWithFaceBook = () => {
    const FBprovider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(FBprovider).catch(console.log);
  }
  return (

    <>
      <h2>Sign In</h2>
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

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} className="px-4 m-1 text-lg leading-3 rounded-md shadow-sm opacity-100 w-96 font-albertsans ring-4 bg-zinc-300 dark:bg-zinc-500 ring-zinc-400 dark:ring-zinc-600 ring-inset focus:ring-zinc-500 focus:ring-4 dark:focus:ring-zinc-700 dark:focus:ring-4 " placeholder="What's on your mind?" />

      <button class="dark:bg-zinc-600 bg-primaryBlue-primary px-5" type="submit" disabled={!formValue}> <PaperAirplaneIcon className='w-8'/> </button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <p>{displayName}</p>
      <img className='rounded-full w-9 h-9' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="pfp" />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
