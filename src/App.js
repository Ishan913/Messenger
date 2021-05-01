import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBRakLu12uw9mfTNboIHZl45avRwKM8UUE",
    authDomain: "chatmessenger-7f64e.firebaseapp.com",
    projectId: "chatmessenger-7f64e",
    storageBucket: "chatmessenger-7f64e.appspot.com",
    messagingSenderId: "910248657196",
    appId: "1:910248657196:web:d5eb3fd6ca7fc06a41ec89",
    measurementId: "G-DXDV2PGV0L"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header >
        
      </header>
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
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() =>auth.SignOut()} >SignOut</button>
  )
}

function ChatRoom(){
  const [messages, setMessages] = useState([]);
  const messagesRefs = firestore.collection('messages');
  
  // const query = messagesRefs.orderBy('createdAt').limit(25);
  // const {messages} = useCollectionData(query, {idField:'id'});
  // console.log(messages);

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
  console.log(messages);

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg}/>)}
    </div>
    <div>
      Hello
    </div>
    </>
  )

}

function ChatMessage(props){
  const {text,uid} = props.message;

  return (<p>{text}</p>)
}


export default App;
