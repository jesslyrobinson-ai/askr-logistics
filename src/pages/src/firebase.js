import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDn35wSqZ7WFTSBiAC5wpFsqbbOZlxTw",
  authDomain: "askr-logistics.firebaseapp.com",
  projectId: "askr-logistics",
  storageBucket: "askr-logistics.firebasestorage.app",
  messagingSenderId: "390673347965",
  appId: "1:390673347965:web:d54c9ff949df83d17f8814",
  measurementId: "G-Q9T9BTG16P"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
