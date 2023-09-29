import { Button, Flex, HStack, Image } from '@chakra-ui/react';
import React from 'react'

import MusicBg from "../img/musicbg.jpg";
import{FcGoogle} from 'react-icons/fc'

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// to store data to firestore database
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {

  // it returns the authentication instance associated with provided firebase app
  const firebaseAuth = getAuth(firebaseApp);

  // provider we are using -->Google Auth Provider
  const provider = new GoogleAuthProvider();

  // get access to firestore database and we have its instance here
  const firebaseDb = getFirestore(firebaseApp);

  // helps us to navigate to once the successfully logged in to diff loc
  const navigate = useNavigate();

  
  // Login() is async --> because we are going to use the firebase methods
  // because that methods need to wait to trigger the pop-up
  const login = async () => {
    // const response = await signInWithPopup(firebaseAuth, provider);
    // console.log(response);
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    // console.log(refreshToken,providerData);

    // Put the userdetails(proiverdata , refresh token) in the local storage
    // we can fetch the data from local storage
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));

    //ADD DATA TO FIRESTORE DATABASE
    await setDoc(
      // firebaseDb--> passing the instance of firestore database here
      // users--> collection name (for storing user data in firebase)
      // passed userid as the document name
      doc(firebaseDb, "users", providerData[0].uid),
      providerData[0]
    );

    // after adding data push user to home screen
    navigate("/", { replace: true });
  };

  return (
    <Flex
    justifyContent={"center"}
    alignItems={"center"}
    width={"100vw"}
    height={"100vh"}
    position={"relative"}
    >
    
      <Image src={MusicBg} objectFit="cover" width={"full"} height={"full"} />

      {/* Flex to cover the image and add background color for it */}
      <Flex position={"absolute"} width={"100vw"} height={"100vh"} bg={"blackAlpha.600"} top={0} left={0} 
      justifyContent="center" alignItems={"center"} >    {/*To reduce img brightness */}
        
        {/* Google SignIn Provider option */}
        <HStack>
          <Button leftIcon={<FcGoogle fontSize={25} />} colorScheme="whiteAlpha" shadow={"lg"} onClick={() => login()} color="#f1f1f1" >
            {/* Onclick -- call a callback function */}
            Signin with Google
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}

export default Login