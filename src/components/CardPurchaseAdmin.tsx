import { CheckIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  List,
  ListItem,
  Flex,
  ListIcon,
  Stack,
  Text,
  Button,
  CircularProgress,
} from "@chakra-ui/react";
import { formatDate } from "../utils/dates";
import apiClient from "../config/axiosClient";
import { useToastResponses } from "../hook/useToastResponses";
import { useState } from "react";
import { updatePurchasesAdminRx } from "../helpers/subjectsRx.helper";
type props = {
  purchase: any;
};
export const CardPurchaseAdmin: React.FC<props> = ({ purchase }) => {
  const { success, error } = useToastResponses();
  const [isLoading, setIsLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  return (
    <Card
      minH={"md"}
      display={"flex"}
      direction={"column"}
      alignItems={"flex-start"}
      bg={"ly.900"}
      p={2}
      color={"ly.400"}
    >
      <CardHeader display={"flex"} flexDirection={"column"} gap={1}>
        <Heading size="md">Cliente: {purchase.customer.user.firstName}</Heading>
        <Heading size="md">Dni: {purchase.customer.dni}</Heading>
        <Heading size="sm">Direccion: {purchase.customer.addres}</Heading>
        <Heading size="sm">Correo: {purchase.customer.user.email}</Heading>
        <Heading size="md">Telefono: {purchase.customer.phone}</Heading>
        <Heading size="md">
          Estado de Compra:{" "}
          {purchase.state == "paid" ? "Pagado" : purchase.state}
        </Heading>
        <Heading size="md">
          Pago: {purchase.payment == "MP" ? "Mercado Pago" : "Efectivo"}
        </Heading>
      </CardHeader>
      <CardBody>
        <Heading size="md">Productos</Heading>
        <List spacing={3} maxHeight={"64"} overflowY={"auto"}>
          {purchase.purchasesProducts.length > 0 ? (
            purchase.purchasesProducts.map((product: any) => {
              return (
                <ListItem pr={2}>
                  <Flex justifyContent={"flex-start"} alignItems={"center"}>
                    <ListIcon as={CheckIcon} color="green.500" />
                    <Text color={"ly.400"}>
                      <span>{product.quantity} </span>
                      {product.product.name}
                      <span> en talle {product.size.name} </span>
                    </Text>
                  </Flex>
                </ListItem>
              );
            })
          ) : (
            <ListItem>
              <ListIcon as={CheckIcon} color="green.500" />
              Vacio
            </ListItem>
          )}
        </List>{" "}
      </CardBody>
      <Flex
        justifyContent={"space-between"}
        w={"full"}
        p={6}
        alignItems={"center"}
      >
        <Heading size="md">Fecha: {formatDate(purchase.createdAt)}</Heading>
        <Stack
          direction={"column"}
          w={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing={1}
        >
          <Heading size="md"> 💵 Total: </Heading>
          <Heading size={"md"}> ${purchase.totalPurchase}</Heading>
          {purchase.state === "pendiente" && !paid && (
            <>
              {isLoading ? (
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              ) : (
                <Button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const response = await apiClient.put(
                        `/purchase/${purchase.id}`,
                        {
                          state: "paid",
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      if (!response.data.ok) throw new Error("err");
                      setPaid(true)
                      updatePurchasesAdminRx.setSubject(true)
                      success("Cambios guardados correctamente");
                      setIsLoading(false);
                    } catch (errorFromCatch) {
                      console.log(errorFromCatch);
                      error("No se pudo cambiar el estado");
                      setIsLoading(false);
                    }
                  }}
                  variant="solid"
                  colorScheme="red"
                  shadow={"xl"}
                  p={1}
                >
                  Pagado
                </Button>
              )}
            </>
          )}
        </Stack>
      </Flex>
    </Card>
  );
};
