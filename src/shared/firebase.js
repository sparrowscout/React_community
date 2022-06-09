import { initializeApp } from 'firebase/app';
//auth설정
import { getAuth } from "firebase/auth";

//firestore가져오기
import { getFirestore } from "firebase/firestore"

//스토리지 가져오기
import { getStorage } from "firebase/storage";

//프로젝트 설정 -> SDK 사용에서 키 가져오기
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBc88UoEeJN1i1F1TpGx4zr9s5LRYYgj2U",
    authDomain: "authex-d686f.firebaseapp.com",
    projectId: "authex-d686f",
    storageBucket: "authex-d686f.appspot.com",
    messagingSenderId: "500410280268",
    appId: "1:500410280268:web:f2a711cdb70f27689e87e9",
    measurementId: "G-H6SEVL4PFW"
};



const app = initializeApp(firebaseConfig);

export default app;

//auth객체 만들어서 내보내기
export const auth = getAuth();

//firestore사용가능하게 내보내기
export const db = getFirestore(app);

//스토리지 내보내기
export const storage = getStorage(app);

