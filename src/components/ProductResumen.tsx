import {
  Card,
  Text,
  Image,
  CardBody,
  Heading,
  Stack,
  CardFooter,
  Button,
  Flex,
} from "@chakra-ui/react";
import { ProductInterface } from "../interfaces/product";
import useApp from "../hook/useApp";
import { releaseImgUrl } from "../helpers/cloudinaty.helper";

export default function ProductResumen(props: { product: ProductInterface }) {
  const { handleRemoveProductFromCarrito } = useApp();
  return (
    <Card
      w={"52"}
      direction={{ base: "row", md: "column" }}
      display={"flex"}
      alignItems={"center"}
      mt={2}
      py={2}
      bg={"ly.800"}
      color={"ly.400"}
    >
      <Image
        objectFit="cover"
        w={{ base: 60, md: 80 }}
        src={releaseImgUrl(props.product.img)}
        alt={props.product.name}
      />

      <Stack>
        <CardBody pb={0}>
          <Heading size="md">{props.product.name}</Heading>

          <Text py="2">{props.product.description}</Text>
        </CardBody>
        <Flex justifyContent={"center"} >
          <Button
            px={1}
            w={{ base: "28", md: "36" }}
            variant="solid"
            py={6}
            paddingX={{base:10, md:0}}
            colorScheme="yellow"
          >
            <Flex
              direction={"column"}
              gap={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text fontWeight={"semibold"} fontSize={"lg"} color={"ly.900"}>
                Cantidad: {props.product.quantity}
              </Text>
              <Text fontWeight={"semibold"} fontSize={"lg"} color={"ly.900"}>
                Talle: {props.product.size?.name}
              </Text>
            </Flex>
          </Button>
        </Flex>
        <CardFooter
          display={"flex"}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          py={1}
        >
          <Button
            px={2}
            variant="solid"
            colorScheme="blue"
            w={{ base: "24", md: "20" }}
          >
            ${props.product.price}
          </Button>
          <Button
            onClick={() => handleRemoveProductFromCarrito(props.product.id)}
            variant="solid"
            w={{ base: "24", md: "20" }}
            colorScheme="red"
          >
            Quitar
          </Button>
          {/*  <Box my={{ base: 1, md: 0 }} display={"flex"}>
          </Box> */}
        </CardFooter>
      </Stack>
    </Card>
  );
}
