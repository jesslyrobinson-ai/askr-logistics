import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export const listenToPackages = (callback) => {
  return onSnapshot(collection(db, "packages"), (snapshot) => {
    const packages = snapshot.docs.map((doc) => ({
      firebaseId: doc.id,
      ...doc.data(),
    }))

    callback(packages)
  })
}

export const addPackageToFirebase = async (packageData) => {
  return addDoc(collection(db, "packages"), {
    ...packageData,
    createdAt: serverTimestamp(),
  })
}

export const updatePackageStatus = async (firebaseId, updates) => {
  return updateDoc(doc(db, "packages", firebaseId), updates)
}