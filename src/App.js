import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/auth";
import "firebase/compat/analytics";
import { getAuth, onAuthStateChanged } from "firebase/compat/auth";
import firebaseConfig from "./firebaseConfig.json";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  const [currentPage, setCurrentPage] = useState("allGroups");

  function handleChatRoom() {
    setCurrentPage("chatRoom");
  }

  function handleAllGroups() {
    setCurrentPage("allGroups");
  }

  console.log(currentPage);
  return (
    <div className="App">
      <header>
        <h1>Lost in Translation</h1>
        <SignOut />
        <Back handleAllGroups={() => setCurrentPage("allGroups")} />
      </header>

      <section>
        {/* {user ? <AllGroups /> : <SignIn />} */}
        {user ? (
          currentPage == "allGroups" ? (
            <AllGroups handleChatRoom={() => setCurrentPage("chatRoom")} />
          ) : (
            <ChatRoom />
          )
        ) : (
          <SignIn />
        )}
      </section>
    </div>
  );

  //   <section>
  //     {user ? <AllGroups /> : <SignIn />}
  //   </section>
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function Back({ handleAllGroups }) {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => handleAllGroups()}>
        back
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("chats");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button class="sendbtn" type="submit" disabled={!formValue}>
          ➤➤➤
        </button>
      </form>
    </>
  );
}

function AllGroups({ handleChatRoom }) {
  return (
    <>
      <form>
        <button class="rooms" onClick={() => handleChatRoom()}>
          Chatroom 1
        </button>
        <button class="rooms" onClick={() => handleChatRoom()}>
          Chatroom 2
        </button>
        <button class="rooms">Chatroom 3</button>
        <button class="rooms">Chatroom 4</button>
        <button class="rooms">Chatroom 5</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          class="profileImg"
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <img src={require("./test.jpg")} />
      </div>
    </>
  );
}

function ListChats() {
  const chatsRef = firestore.collection("chats");
  const query = chatsRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const createChat = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await chatsRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>

      <form onSubmit={createChat}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

export default App;
