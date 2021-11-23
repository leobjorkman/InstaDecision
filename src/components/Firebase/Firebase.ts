import { ListClassKey } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "key",
  authDomain: "domain",
  projectId: "id",
  storageBucket: "storage",
  messagingSenderId: "id",
  appId: "id",
  measurementId: "measurementId",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const get = async (id: string) => {
  const docRef = doc(db, "polls", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};

const getRestaurants = async (id: string) => {
  const docRef = doc(db, "polls", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().restaurants;
  } else {
    console.log("No such document!");
  }
};

const add = async (pollName: string, numMembers: string) => {
  // Adds new document and returns the generayed doc id.
  const docRef = await addDoc(collection(db, "polls"), {
    pollName,
    numMembers,
    priceLevel: [],
    like: [],
    dislike: [],
    restaurants: [],
  });
  return docRef.id;
};

const update = (
  docId: string,
  priceLevel: string,
  like: string,
  dislike: string
) => {
  updateDoc(doc(db, "polls", docId), {
    priceLevel: arrayUnion(priceLevel),
    like: arrayUnion(like),
    dislike: arrayUnion(dislike),
  });
};

const setRestaurants = (docId: string, restaurants: Array<string>) => {
  updateDoc(doc(db, "polls", docId), {
    restaurants: restaurants,
  });
};

export default Object.freeze({
  get,
  add,
  update,
  setRestaurants,
  getRestaurants,
});
