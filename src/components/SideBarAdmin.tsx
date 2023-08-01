import {
  Box,
  Button,
  Flex,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import useApp from "../hook/useApp";
import { useAuth } from "../hook/useAuth";
import { useMediaQuery } from "react-responsive";
import Categoria from "./Categorias";
import { useState } from "react";
import MenuMobile from "./MenuMobile";
export default function SideBarAdmin() {
  const { user, categoriesAdmin } = useApp();
  const { logout } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  return (
    <Flex flexDirection={"column"} w={["full", "full", "56", "60"]}>
      {isMobile ? (
        <>
          <Flex justifyContent={"space-evenly"} alignItems={"flex-start"}>
            <Img src="logo.webp" alt="logo svg" w={"44"} />

            <Flex flexDirection={"column"} alignItems={"flex-start"} mb={1}>
              <Text
                fontSize={["2xl", "3xl"]}
                color={"ly.700"}
                fontWeight="bold"
                textAlign={"center"}
                mt={2}
                ml={1}
                mb={1}
              >
                Hola!{" "}
              </Text>
              <Text fontWeight={"bold"} display={"inline"} color={"orange.400"}>
                {user?.firstName?.toUpperCase()}
              </Text>

              <Flex w={"full"} justifyContent={"space-between"} my={2} gap={5}>
                <Box>
                  <Menu>
                    <MenuButton as={Button}>
                      <Img src="me.svg" w={6}></Img>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        bgColor="red"
                        color={"white"}
                        fontSize={"md"}
                        fontWeight={"semibold"}
                        onClick={() => {
                          logout();
                        }}
                      >
                        Cerrar Sesion
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </Flex>
              <MenuMobile isAdmin={true} />
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Img src="logo.webp" alt="logo svg" w={["40", "60", "80"]} />
          <Text
            bgClip="text"
            fontSize={["2xl", "3xl"]}
            color={"ly.700"}
            fontWeight="semibold"
            textAlign={"center"}
            mb={4}
          >
            Hola!{" "}
            <Text fontWeight={"bold"} display={"inline"} color={"orange.400"}>
              {user?.firstName?.toUpperCase()}
            </Text>
          </Text>
          <Box mt={2}>
            {categoriesAdmin?.map((categoria) => (
              <Categoria
                isAdmin={true}
                category={categoria}
                key={categoria.id}
              />
            ))}
          </Box>
          <Button
            colorScheme="red"
            rounded={"none"}
            isLoading={isLoadingLogout}
            fontSize={"lg"}
            loadingText="Submitting"
            my={3}
            onClick={() => {
              setIsLoadingLogout(true);
              logout();
              setIsLoadingLogout(false);
            }}
          >
            Cerrar Sesion
          </Button>
        </>
      )}
    </Flex>
  );
}
