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
import Categoria from "./Categorias";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import MenuMobile from "./MenuMobile";
import ModalCarrito from "./ModalCarrito";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { modalesRX } from "../helpers/subjectsRx.helper";
export default function Sidebar() {
  const { categories, user, carrito } =
    useApp();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      w={["full", "full", "56", "60"]}
      bg={"ly.900"}
    >
      {isMobile ? (
        <>
          <ModalCarrito />
          <Flex justifyContent={"space-evenly"} alignItems={"flex-start"}>
            <Img src="logo.webp" h={"auto"} alt="logo svg" w={"44"} />

            <Flex flexDirection={"column"} alignItems={"flex-start"} mb={2}>
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
              <Text
                fontWeight={"bold"}
                display={"inline"}
                fontSize={["xl", "2xl"]}
                color={"orange.400"}
              >
                {user?.firstName?.toUpperCase()}
              </Text>

              <Flex w={"full"} my={2} gap={5}>
                <Box>
                  <Menu>
                    <MenuButton as={Button} bg={"ly.400"}>
                      <Flex gap={1}>
                        <Text fontSize={"xl"}>Yo</Text>
                        <Img src="me.svg" width={6} height={6}></Img>
                      </Flex>
                    </MenuButton>
                    <MenuList>
                      {user ? (
                        <>
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
                          {user.customer && (
                            <MenuItem
                              bgColor="blue.500"
                              color={"white"}
                              fontSize={"md"}
                              fontWeight={"semibold"}
                              onClick={() => {
                                modalesRX.setSubject(["history", true]);
                              }}
                            >
                              Historial de Compras
                            </MenuItem>
                          )}
                        </>
                      ) : (
                        <MenuItem
                          bgColor="blue.500"
                          color={"white"}
                          fontSize={"md"}
                          fontWeight={"semibold"}
                          onClick={() => {
                            navigate("/auth/login");
                          }}
                        >
                          Iniciar Sesion
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </Box>

                <Box
                  animation={
                    carrito!.length > 0
                      ? "breathing 2s ease-in-out infinite"
                      : ""
                  }
                  css={{
                    "@keyframes breathing": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.2)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                >
                  <Button
                    onClick={() => modalesRX.setSubject(["carrito", true])}
                    my={0}
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    bg={"ly.700"}
                  >
                    🛒
                  </Button>
                </Box>
              </Flex>

              <MenuMobile />
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Img
            src="logo.webp"
            h={"auto"}
            alt="logo svg"
            w={["40", "60", "80"]}
          />
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



          <Flex maxHeight={{base:"40vh", "2xl":"50vh"}} overflowY={"auto"} direction={"column"} alignItems={"center"} justifyContent={"flex-start"} gap={2}>

            {categories?.map((categoria) => (
              <Categoria category={categoria} key={categoria.id} />
            ))}

          </Flex>





          {user ? (
            <>
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
              {user.customer && (
                <Button
                  colorScheme="blue"
                  rounded={"none"}
                  fontSize={"lg"}
                  onClick={() => {
                    modalesRX.setSubject(["history", true]);
                  }}
                >
                  🛍 Historial de Compras
                </Button>
              )}
            </>
          ) : (
            <Button
              colorScheme="blue"
              rounded={"none"}
              isLoading={isLoadingLogout}
              fontSize={"lg"}
              my={3}
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              Iniciar Sesion
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
