import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/auth';
import 'firebase/compat/analytics';
import { getAuth, onAuthStateChanged } from "firebase/compat/auth";
import firebaseConfig from './firebaseConfig.json'



import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function ChatList() {
    const chatsRef = firestore.collection('chats');
    const query = chatsRef.orderBy('createdAt').limit(25);
  
    const [chats] = useCollectionData(query, { idField: 'id' });
  
    const [formValue, setFormValue] = useState('');
  
  
    const createChat = async (e) => {
      e.preventDefault();
  
      const { uid, photoURL } = auth.currentUser;
  
      await chatsRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
  
      setFormValue('');
    }
  
    return (<>
      <main>
  
        {chats && chats.map(chat => <ChatName key={msg.id} chatName={msg} />)}
  
      </main>
  
      <form onSubmit={createChat}>
  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!formValue}>🕊️</button>
  
      </form>
    </>)
  }

function ChatName(props) {
    const { text, uid, photoURL } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <profileImg src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <img src={require('./test.jpg')}/>
      </div>
    </>)
  }