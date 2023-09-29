import React, { useState } from "react";

import logo from "../img/logo.png";
import logo_dark from "../img/logo_dark.png";

import { Link, useNavigate } from "react-router-dom";
// import { Input, Button, Text, VStack } from "@chakra-ui/react";

// prettier-ignore
import { Flex, Image, Button, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue,Text, VStack  } from "@chakra-ui/react";
import { IoAdd, IoLogOut, IoMoon, IoSearch, IoSunny } from "react-icons/io5";

// passing props
const NavBar = ({ user, setsearchTerm, searchTerm }) => {

  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex
    justifyContent={"space-between"}
    alignItems="center"
    width={"100vw"}
    p={4}
  >

    {/* LOGO */}
    {/* route/Take user to home on clicking the logo */}
    <Link to={"/"}>
      <Image src={colorMode == "light" ? logo_dark : logo} width={"180px"} />
    </Link>
    

    {/* SEARCH ICON */}
    <InputGroup mx={6} width="60vw">
    <InputLeftElement 
      pointerEvents='none'
      children={<IoSearch fontSize={25} />}
      />

      {/* SEARCH */}
     <Input
          type="text"
          placeholder="Search..."
          fontSize={18}
          fontWeight="medium"
          variant={"filled"}
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
          // onFocus={() => navigate("/search")}
        />

      </InputGroup>


      {/* Color TOGGLE ICON */}
      <Flex justifyContent={"center"} alignItems="center">
        <Flex
          width={"40px"}
          height="40px"
          justifyContent={"center"}
          alignItems="center"
          cursor={"pointer"}
          borderRadius="5px"
          onClick={toggleColorMode}
        >
          {colorMode == "light" ? (
            <IoMoon fontSize={25} />
          ) : (
            <IoSunny fontSize={25} />
          )}
        </Flex>


        {/* CREATE Btn */}
        <Link to={"/create"}>
          <Flex
            justifyContent={"center"}
            alignItems="center"
            bg={bg}
            width="40px"
            height="40px"
            borderRadius="5px"
            mx={6}
            cursor="pointer"
            _hover={{ shadow: "md" }}
            transition="ease-in-out"
            transitionDuration={"0.3s"}
          >
            <IoAdd
              fontSize={25}
              color={`${colorMode == "dark" ? "#111" : "#f1f1f1"}`}
            />
          </Flex>
        </Link>

        {/* Usr Information : Menu Icon (Profile,Logout) */}
        <Menu>

          {/* Load photo of user */}
          <MenuButton>
            <Image src={user?.photoURL} width="40px" height="40px" rounded="full" />
          </MenuButton>

          <MenuList shadow={"lg"}>
            <Link to={`/userDetail/${user?.uid}`}>

              {/* MyAccount/User Profile */}
              <MenuItem>My Account</MenuItem>
            </Link>

            <MenuItem flexDirection={"row"} alignItems="center" gap={4} 
                onClick={() => { localStorage.clear();
                navigate("/login", { replace: true });
              }}
            >
              {/* Logout Icon */}
              Logout <IoLogOut fontSize={20} />
            </MenuItem>

          </MenuList>
      </Menu>

        </Flex>
    </Flex>
  )
}

export default NavBar