import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const fb = firebase.initializeApp({
    apiKey: "AIzaSyDNgxPRQm2Xq9GEtkKoiJkBf4rl6YoO48s",
    authDomain: "pkl-absensi.firebaseapp.com",
    projectId: "pkl-absensi",
    storageBucket: "pkl-absensi.appspot.com",
    messagingSenderId: "709387138648",
    appId: "1:709387138648:web:1f539c7960904f5475fc2d",
});

const db = fb.firestore();
const auth = fb.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

const { Timestamp, GeoPoint } = firebase.firestore;
const {
    increment,
    arrayRemove,
    arrayUnion,
    serverTimestamp,
} = firebase.firestore.FieldValue;

export {
    db,
    auth,
    provider,
    storage,
    Timestamp,
    GeoPoint,
    serverTimestamp,
    increment,
    arrayRemove,
    arrayUnion,
};
