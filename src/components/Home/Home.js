import React from 'react'
import {ArrowRight} from 'react-feather';
import { useNavigate } from 'react-router-dom';
import designIcon from "../../assets/designer.svg";
import styles from "./Home.module.css";

function Home(props) {
    const navigate = useNavigate();
    const isAuthenticated =props.auth ? true : false;

    const handleNextButtonClick = () =>{ 
    if(isAuthenticated) navigate("/account");
   else navigate("/login");
    };
  return (
    <div className={styles.container}>
         <div className={styles.header}>
         <div className={styles.left}>
         <p className={styles.heading}>Project Fair</p>
        <p className={styles.subHeading}>
            One stop destination for all software development Projects
            </p>
         <button onClick={handleNextButtonClick}>
            {isAuthenticated ? "Manage your Projects": "Get Started"} {" "}
            <ArrowRight />{" "}
            </button>
         </div>
         <div className={styles.right}>
        <img src={designIcon} alt="Projects" />
        </div>
         </div>
    </div>
  );
  };

export default Home
