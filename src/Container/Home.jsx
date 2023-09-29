import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Category, Create, Feed, NavBar, Search, UserProfile, VideoPinDetail } from "../Components";
import { Routes, Route } from "react-router-dom";
import { categories } from "../data";
import { getFirestore } from "firebase/firestore";

import { firebaseApp } from "../firebase-config";
import { categoryFeeds, getAllFeeds } from "../utils/fetchData";
import { useParams } from "react-router-dom";

const Home = ({ user }) => {
  const [searchTerm, setsearchTerm] = useState("");

  //firestore data instance
  const firestoreDb = getFirestore(firebaseApp);

  const [feeds, setFeeds] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ categoryId, setCategoryId ] = useState(null);

  const filterVideos = (value) => {
     //search in feeds and place searched videos into filteredFeed
     let tempfiltered = [];
     feeds.forEach(video => {
          if((video.title && video.title.includes(value)) || (video.description && video.description.includes(value))){
            tempfiltered.push(video);
          }
     });
     setFilteredFeed(tempfiltered);
     setsearchTerm(value);
  };

  //fetch the details
  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      categoryFeeds(firestoreDb, categoryId).then((data) => {
        setFeeds(data);
        setFilteredFeed(data);
        setLoading(false);
      });
    } else {
      // this function takes firebase instance as a parameter
      //this method will return a promise
      getAllFeeds(firestoreDb).then((data) => {
        setFeeds(data);
        setFilteredFeed(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  return (
    <>
      {/* <NavBar user={user}  /> */}
      <NavBar user={user} setsearchTerm={ filterVideos }/>


      <Flex width={"100vw"}>
        <Flex direction={"column"} justifyContent="start" alignItems={"center"} width="5%" >
          
          {/* render the category data  from data.js*/}
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
            {/* console.log(categories) */}
        </Flex>

        <Flex width={"95%"} px={4} justifyContent="center" alignItems={"center"} >
          <Routes>
            <Route path="/" element={<Feed  feeds={filteredFeed} loading = {loading}
            setCategoryId={ (value) => setCategoryId(value)} />} />
            
            {/* load category based feeds */}
            <Route path="/category/:categoryId" element={<Feed  feeds={filteredFeed} loading = {loading} 
            setCategoryId={ (value) => setCategoryId(value)}/>} />
            
            {/* load craete route */}
            <Route path="/create" element={<Create />} />
            
            <Route path="/videoDetail/:videoId" element={<VideoPinDetail />} />
            

            {/* If route is coming from search load the search */}
            <Route
              path="/search"
              element={<Search searchTerm={searchTerm} />}
             />
            
            <Route path="/userDetail/:userId" element={<UserProfile />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;