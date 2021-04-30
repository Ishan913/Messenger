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
  appId: "1:910248657196:web:233ce73995e6ec9641ec89",
  measurementId: "G-DJRC9J3L9P"
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
        {user ? <ChatRoom />: <SignIn />}
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
  const messageRefs = firestore.collection('messages');
  const query = messageRefs.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField:'id'});


}

function ChatMessage(){

}


export default App;
