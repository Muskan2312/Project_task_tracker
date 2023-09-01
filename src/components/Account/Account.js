import React, { useEffect, useRef, useState } from 'react';
import { signOut } from "firebase/auth";
import styles from './Account.module.css';
import { LogOut, Camera } from 'react-feather'; // Import the Camera component
import InputControl from '../InputControl/InputControl';
import { Navigate  } from 'react-router-dom';
import { auth, updateUserDatabase, uploadImage }  from "../../firebase";

function Account(props) {
    const userDetails = props.userDetails;
    const isAuthenticated = props.auth;
    const imagePicker=useRef();
    const[progress,setProgress]=useState(0);
    const [profileImageUploadStarted,setProfileImageUploadStarted] = 
    useState(false);
    const[profileImageUrl,setProfileImageUrl]=useState("https://tse1.mm.bing.net/th?id=OIP.oSSQTOcjQZvxI-6fa3iMxgHaE8&pid=Api&rs=1&c=1&qlt=95&w=150&h=100");
const [userProfileValues,setUserProfileValues]=useState({
  name:userDetails.name || "",
  designation:userDetails.designation || "",
  github:userDetails.github || "",
  linkedin:userDetails.linkedin || "",
});
const [showSaveDetailsButton,setShowSaveDetailsButton] = useState(false);
const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
const[errorMessage,setErrorMessage] = useState("")

    const handleLogout = async () => {
       await signOut(auth);
       };
       const handleCameraClick=()=>{
        imagePicker.current.click();
       };
 const handleImageChange=(event)=>{
    const file= event.target.files[0];
    if(!file) return;
    setProfileImageUploadStarted(true)
    uploadImage(
     file,
      (progress) => {
        setProgress(progress);
    },
       (url)=>{
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false)
        setProgress(0);
      },
      (err) =>{ console.error("Error->",err)
      setProfileImageUploadStarted(true);
    }
        
   );
 };

 const updateProfileImageToDatabase= async(url)=>{
  await updateUserDatabase({...userProfileValues,profileImage : url},
    userDetails.uid
    );
 };

   const handleInputChange=(event,property)=>{
    setShowSaveDetailsButton(true)
    setUserProfileValues((prev)=>({
      ...prev,
      [property]: event.target.value
    }));
   };

   const saveDetailsToDatabase= async ()=>{
    if(!userProfileValues.name){
      setErrorMessage("Name required");
      return;
    }
    setSaveButtonDisabled(true);
   await updateUserDatabase({...userProfileValues},userDetails.uid);
   setSaveButtonDisabled(false);
   setShowSaveDetailsButton(false);
   };
   
  return isAuthenticated ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>
          Welcome <span>{userProfileValues.name}</span>
        </p>
        <div className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </div>
      </div>
      <input ref={imagePicker} type="file" style={{display:"none"}}
      onChange={handleImageChange}
      />
      <div className={styles.section}>
        <div className={styles.title}>Your profile</div>
        <div className={styles.profile}>
          <div className={styles.left}>
          <div className={styles.image}>
            <img
              src={profileImageUrl}
              alt="Profile image"
            />
            <div className={styles.camera} onClick={handleCameraClick}>
              <Camera /> 
            </div>
          </div>
          {
            profileImageUploadStarted ? (
            <p className={styles.progress}>
              {
                progress === 100
                ?"Getting image url..."
                : '${progress.toFixed(2)}% uploaded'}
              </p>
          ) : (
            ""
          )}
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <InputControl label="Name" placeholder="Enter your Name"
              value={userProfileValues.name}
              onChange={(event)=> handleInputChange(event,"name")} 
              />
              <InputControl
                label="Title"
                placeholder="eg. Full stack developer"
                value={userProfileValues.designation}
                onChange={(event)=> handleInputChange(event,"designation")} 
              />
            </div>
            <div className={styles.row}>
              <InputControl
                label="Github"
                placeholder="Enter your Github link"
                value={userProfileValues.github}
                onChange={(event)=> handleInputChange(event,"github")} 
              />
              <InputControl
                label="Linkedin"
                placeholder="Enter your Linkedin"
                value={userProfileValues.linkedin}
                onChange={(event)=> handleInputChange(event,"linkedin")} 
              />
            </div>
            <div className={styles.footer}>
               <p className={styles.error}>{errorMessage}</p>
         

            {showSaveDetailsButton && (
                <button 
                disabled={saveButtonDisabled}
                className={"button"} onClick={saveDetailsToDatabase}> 
                Save Details
                </button>
              )}
               </div>
          </div>
        </div>
      </div>
    </div>
  ) :(
    <Navigate to="/" />
  );
  
}

export default Account;
