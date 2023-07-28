import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Img,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useApp from "../hook/useApp";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiClient from "../config/axiosClient";

export default function PayButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const cancelRef1 = React.useRef(null);
  const cancelRef2 = React.useRef(null);
  const { user, setUser, pay } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getValues } = useForm();
  const [payment, setPayment] = useState<"MP" | "CASH">("MP");

  const onSubmit = async () => {
    setIsLoading(true);
    const formData = getValues();
    if (
      formData.addres &&
      formData.addres.length > 3 &&
      formData.dni &&
      formData.dni.length == 8 &&
      (formData.dni = Number(formData.dni)) &&
      formData.phone && formData.phone.length > 5 && formData.phone.length < 15
    ) {
      try {
        const response = await apiClient.post("/customer", {
          ...formData,
          user: user?.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.ok) {
          setUser({ ...user!, customer: response.data.body });
          localStorage.setItem("user", JSON.stringify({ ...user!, customer: response.data.body }))
          setIsLoading(false);
          pay(payment, Number(response.data.body.id));
        } else {
          throw new Error("Coudn't create customer");
        }
      } catch (error) {
        toast({
          title: "Error de servidor o valores no Validos",
          status: "error",
          duration: 1000,
          position: "top-left",
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }
    } else {
      toast({
        title: "Valores No validos",
        status: "error",
        duration: 1000,
        position: "top-left",
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
  };

  const onSubmitPayment = () => {
    if (user && user.customer) pay(payment, Number(user.customer.id));
    onClose2();
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!user) {
            onOpen();
            return;
          }
          if (!user.customer) {
            onOpen1();
            return;
          }
          onOpen2();
          return;
        }}
        my={5}
        p={5}
        backgroundColor="blue.500"
        color="white"
        fontWeight={"semibold"}
        variant="outline"
      >
        Pagar
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Inicia Sesion Para Comprar</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Para comprar inicia sesion antes</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>No</Button>
            <Button
              onClick={() => navigate("/auth/login")}
              colorScheme="blue"
              ml={3}
            >
              Iniciar Sesion
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        leastDestructiveRef={cancelRef1}
        motionPreset="slideInBottom"
        onClose={onClose1}
        isOpen={isOpen1}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Ingresa los siguientes Datos</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Direccion</FormLabel>
                <Input
                  {...register("addres")}
                  type="text"
                  placeholder="Tu direccion/barrio ej: Valintin alsina 900 san roque"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Dni </FormLabel>
                <Input
                  {...register("dni")}
                  type="text"
                  placeholder="Tu dni (sin puntos ) ej: 48965238"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Numero de Contacto</FormLabel>
                <Input
                  {...register("phone")}
                  type="text"
                  placeholder="Tu numero ej: 3794673547"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormControl mb={6}>
                  <FormLabel>Metodo de Pago</FormLabel>
                  <Flex gap={2} alignItems={"center"}>
                    <Button
                      type="button"
                      variant={payment === "MP" ? "solid" : "outline"}
                      colorScheme={payment === "MP" ? "blue" : "gray"}
                      onClick={() => setPayment("MP")}
                    >
                      <Img
                        rounded={"xl"}
                        w={45}
                        h={38}
                        src="mercadopago.webp"
                      ></Img>

                      <Text ml={3}> Mercado Pago</Text>
                    </Button>

                    <Button
                      type="button"
                      variant={payment === "CASH" ? "solid" : "outline"}
                      colorScheme={payment === "CASH" ? "blue" : "gray"}
                      onClick={() => setPayment("CASH")}
                    >
                      💵 Efectivo
                    </Button>
                  </Flex>
                </FormControl>
              </FormControl>
              {isLoading ? (
                <Flex mt={4} justifyContent={"center"} alignItems={"center"}>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              ) : (
                <Flex gap={2}>
                <Button type="submit"  colorScheme="blue" width={"full"}>
                  Confirmar
                </Button>
                   <Button colorScheme="red" onClick={onClose1}>
                   Cerrar
                 </Button>
                 </Flex>
              )}
            </form>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        leastDestructiveRef={cancelRef2}
        motionPreset="slideInBottom"
        onClose={onClose2}
        isOpen={isOpen2}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Ingresa los siguientes Datos</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <form onSubmit={handleSubmit(onSubmitPayment)}>
              <FormControl mb={6}>
                <FormLabel>Metodo de Pago</FormLabel>
                <Flex gap={2} alignItems={"center"}>
                  <Button
                    type="button"
                    variant={payment === "MP" ? "solid" : "outline"}
                    colorScheme={payment === "MP" ? "blue" : "gray"}
                    onClick={() => setPayment("MP")}
                  >
                    <Img
                      rounded={"xl"}
                      w={45}
                      h={38}
                      src="https://play-lh.googleusercontent.com/YCT9pYI8KOkOuvVtAkB8103BektOn973BW-t4srwhSMbpj0HUVQf10hVusFpmTTbHg"
                    ></Img>

                    <Text ml={3}> Mercado Pago</Text>
                  </Button>

                  <Button
                    type="button"
                    variant={payment === "CASH" ? "solid" : "outline"}
                    colorScheme={payment === "CASH" ? "blue" : "gray"}
                    onClick={() => setPayment("CASH")}
                  >
                    💵 Efectivo
                  </Button>
                </Flex>
              </FormControl>

              {isLoading ? (
                <Flex mt={4} justifyContent={"center"} alignItems={"center"}>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              ) : (
                <Flex alignItems={"center"} gap={3}>
                  <Button type="submit" colorScheme="blue" width={"full"}>
                    Confirmar
                  </Button>
                  <Button colorScheme="red" onClick={onClose2}>
                    Cerrar
                  </Button>
                </Flex>
              )}
            </form>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
