import { Box, Text } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import useApp from "../hook/useApp";
import ProductResumen from "./ProductResumen";
import PayButton from "./PayButton";

export default function Resumen() {
  const { carrito, totalCarrito } = useApp();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return isMobile ? null : (
    <Box
      h="100vh"
      py={5}
      px={2}
      overflowY={"auto"}
      overflowX={"hidden"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      bg={"ly.900"}
      color={"ly.700"}
    >
      <Box
        boxShadow="0px 4px 10px rgba(254, 189, 87, 0.5)"
        display="inline-block"
        rounded={"2xl"}
        p={2}
        mb={5}
      >
        <Text fontSize={"4xl"} fontWeight={"bold"} fontFamily={"-moz-initial"}>
          🛒 Carrito
        </Text>
      </Box>
      {carrito!.length == 0 ? (
        <Text
          fontSize={"xl"}
          textAlign={"center"}
          fontWeight={"semibold"}
          my={3}
        >
          Agregue algo al carrito
        </Text>
      ) : (
        <Box>
          {carrito?.map((product) => (
            <ProductResumen product={product} key={product.id} />
          ))}
          <Text
            mt={8}
            fontSize={"2xl"}
            fontWeight={"bold"}
            textAlign={"center"}
          >
            💵 Total: ${totalCarrito()}
          </Text>
          <Box display={"flex"} justifyContent={"center"}>
            <PayButton />
          </Box>
        </Box>
      )}
    </Box>
  );
}
