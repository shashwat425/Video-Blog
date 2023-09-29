// prettier-ignore
import { Box, Button, Flex, FormLabel, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { IoCheckmark, IoChevronDown, IoCloudUpload, IoLocation, IoTrash, IoWarning, } from "react-icons/io5";
import { categories } from "../data";
import Spinner from "./Spinner";

// prettier-ignore
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
import { firebaseApp } from "../firebase-config";
import AlertMsg from "./AlertMsg";

import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";

import { fetchUser } from "../utils/fetchUser";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './App.css';

const Create = () => {

  // color mode
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  // state for title
  const [title, setTitle] = useState("");
  
  // state for CATEGORY
  const [category, setCategory] = useState("Choose as category");
  
  const [location, setLocation] = useState("");
  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);

  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);
  
  const [description, setDescription] = useState("");

  const [userInfo] = fetchUser();
  const navigate = useNavigate();

  // to get firestore access  For our database
  const storage = getStorage(firebaseApp);
  const fireStoreDb = getFirestore(firebaseApp);

  const uploadImage = (e) => {    
    setLoading(true);
    const videoFile = e.target.files[0];

    // storage reference from firestore (videos folder)
    const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertStatus("success");
          setAlertIcon(<IoCheckmark fontSize={25} />);
          setAlertMsg("Your video is uploaded to our server");
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  // to delete the uploaded video
  const deleteImage = () => {
    const deleteRef = ref(storage, videoAsset);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAsset(null);
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Your video was removed from our server");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );


const handleChange = (editorState) => {
  const contentState = editorState.getCurrentContent();
  console.log(contentState)
  const html = stateToHTML(contentState);
  setDescription(html);
  setEditorState(editorState);
};


// async as detais need to be stored on Firebase, so it need to wait until its done
  const uploadDetails = async () => {
     
    try {
      setLoading(true);
      //NULL CHECK
      if (title.trim().length == 0 || videoAsset == null || category == 'Choose as category') {
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Required Fields are missing!");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          location: location,
          videoUrl: videoAsset,
          description: description,
        };

        //send data to firestore db
        await setDoc(doc(fireStoreDb, "videos", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [title, location, description, category]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      width={"full"}
      minHeight="100vh"
      padding={10}
    >
      <Flex
        width={"80%"}
        height="full"
        border={"1px"}
        borderColor="gray.300"
        borderRadius={"md"}
        p="4"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        gap={2}
      >
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />
        )}

        {/* TITLE */}
        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.400"
          isRequired
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.500" }}
          fontSize={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* flex for category choice and location */}
        <Flex
          justifyContent={"space-between"}
          width="full"
          alignItems={"center"}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="blue"
              as={Button}
              rightIcon={<IoChevronDown fontSize={25} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={"md"} shadow="xl">
              {/* Iterate throgh menulist */}
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    px={4}
                    onClick={() => setCategory(data.name)}
                  >
                    {data.iconSrc}{" "}
                    <Text fontSize={18} ml={4}>
                      {data.name}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                <IoLocation
                  fontSize={20}
                  color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`}
                />
              }
            />

            {/* LOCATION */}
            <Input
              variant={"flushed"}
              placeholder="Location"
              focusBorderColor="gray.400"
              isRequired
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray.500" }}
              fontSize={20}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </Flex>

        {/* File Selection */}
        <Flex
          border={"1px"}
          borderColor="gray.500"
          height={"400px"}
          borderStyle="dashed"
          width="full"
          borderRadius={"md"}
          overflow="hidden"
          position={"relative"}
        >

          {/* if no video url then show click here to upload */}
          {!videoAsset ? (
            <FormLabel width="full">
              <Flex
                direction={"column"}
                alignItems="center"
                justifyContent={"center"}
                height="full"
                width={"full"}
              >
                <Flex
                  direction={"column"}
                  alignItems="center"
                  justifyContent={"center"}
                  height="full"
                  width={"full"}
                  cursor="pointer"
                >
                  {/* if loading then show loading your video */}
                  {loading ? (
                    <Spinner msg={"Uploading Your Video"} progress={progress} />
                  ) : (
                    <>
                    
                    {/* UPLOAD icon */}
                      <IoCloudUpload
                        fontSize={30}
                        color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`}
                      />
                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
              
              {/* if not loading then show uploaded video */}
              {!loading && (
                <input
                  type={"file"}
                  name="upload-image"
                  onChange={uploadImage}
                  style={{ width: 0, height: 0 }}
                  accept="video/mp4,video/x-m4v,video/*"
                />
              )}
            </FormLabel>
          ) : (
            <Flex
              width={"full"}
              height="full"
              alignItems={"center"}
              justifyContent={"center"}
              position={"relative"}
              bg="black"
            >
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"40px"}
                height={"40px"}
                rounded="full"
                bg={"red"}
                top={5}
                right={5}
                position={"absolute"}
                cursor={"pointer"}
                zIndex={10}
                onClick={deleteImage}
              >
                <IoTrash fontSize={20} color="white" />
              </Flex>

              {/* load our video in the after uploading */}
              <video
                src={videoAsset}
                controls
                style={{ width: "100%", height: "100%" }}
              />
            </Flex>
          )}
        </Flex>

        <div className="divclass" style={{width : "100%"}}>
          {/* <header className="App-header">Rich Text Editor Example</header> */}

          <Editor 
            editorState={editorState}
            onEditorStateChange={handleChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName={`${colorMode =='dark' ? 'toolbar-class-dark' : 'toolbar-class'}`}
            toolbar={{
              options: ['inline', 'blockType']
            }}
            />
        </div>

        <Button
          isLoading={loading}
          loadingText="Uploading"
          colorScheme={"linkedin"}
          variant={`${loading ? "outline" : "solid"}`}
          width={"90%"}
          _hover={{ shadow: "lg" }}
          fontSize={20}
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
