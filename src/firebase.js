import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 
import  { getStorage, ref, uploadBytesResumable,  getDownloadURL} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSJpuhrxrtDrUDQek18EOoCiQ9XS1HPgU",
  authDomain: "project-fair-9e5c2.firebaseapp.com",
  projectId: "project-fair-9e5c2",
  storageBucket: "project-fair-9e5c2.appspot.com",
  messagingSenderId: "445131797100",
  appId: "1:445131797100:web:75bd204b5e4ddaa2c11e49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage=getStorage(app);

const updateUserDatabase = async (user, uid) => {
  if (typeof user !== "object") return;
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { ...user,uid });
};
const getUserFromDatabase = async ( uid) => {
  const docRef = doc(db, "users", uid);
 const result = await getDoc(docRef);
 if(!result.exists()) return null;
 return result.data();
};

const uploadImage= (file,progressCallback,urlCallback,errorCallback) => {
  if (!file) {
    errorCallback("File not found")
    return;
  }
  const fileType = file.type;
  const fileSize = file.size / 1024 / 1024;
  if(!fileType.includes("image")){
    errorCallback("File must be an image")
    return;
  }
  if(fileSize > 2){
    errorCallback("File must be smaller than 2MB")
    return;

  }
  const storageRef = ref(storage, `images/${file.name}`);

  const task = uploadBytesResumable(storageRef, file);

  task.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      errorCallback(error.message);
    },
    () => {
      getDownloadURL(storageRef).then((url) => {
        urlCallback(url);
      });
    }
  );
};



export { app as default, auth, db, updateUserDatabase, getUserFromDatabase, uploadImage };
