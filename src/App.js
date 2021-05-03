import React, { useEffect, useRef, useState } from 'react';
import './App.css';

// import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebase from './firestore';

import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <div className="App-signin">
      <header className="App-signin-header">Welcome to Ishan's Messenger</header>
      <button className="App-signin-button" onClick={signInWithGoogle}><img className="App-signin-image" src="https://img.icons8.com/fluent/48/000000/google-logo.png"/>Sign in with Google</button>
    </div>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() =>auth.SignOut()} >SignOut</button>
  )
}

function ChatRoom(){
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue ] = useState('');

  const messagesRefs0 = firestore.collection('messages');
  const messagesRefs = messagesRefs0.orderBy('createdAt').limit(25);

  function getMsgs(){
    messagesRefs.onSnapshot((querySnapshot) => {
      const msgs =[];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });
  }

  useEffect(() =>{
    getMsgs();
  },[]);

  const sendMessage = async(e) =>{
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRefs0.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
  }

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg}/>)}
    </div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">Send</button>
    </form>
    </>
  )

}

function ChatMessage(props){
  const {text,uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sender' : 'receiver';


  return (
    <div className = {'message ${messageClass}'}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}



export default App;
