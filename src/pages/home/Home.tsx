import useSWR, { SWRResponse } from "swr";
import apiClient from "../../config/axiosClient";
import useApp from "../../hook/useApp";
import {
  Flex,
  Text,
  SimpleGrid,
  Box,
  CircularProgress,
} from "@chakra-ui/react";
import Producto from "../../components/Producto";
import { ProductInterface } from "../../interfaces/product";
import ModalHistory from "./ModalHistory";
import { useState, useEffect } from "react";
import { Paginacion } from "../../components/Paginacion";
interface props {
  isAdmin?: boolean;
}

export default function Home({ isAdmin = false }: props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const { actualCategory, spinnerPayMercadoP } = useApp();

  const fetcher = async (url: string) => {
    const response = await apiClient(url);
    setIsLoadingFetch(false);
    setTotalPages(response.data.body.totalPages);
    return response.data;
  };

  const { data, isLoading, error }: SWRResponse = useSWR(
    `/product?skip=${currentPage}&&category=${actualCategory?.id}`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [actualCategory]);

  if (isLoading) {
    return (
      <CircularProgress
        isIndeterminate
        color="green.500"
        size="120px"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
    );
  }
  if (error)
    return (
      <Text color="ly.700" textAlign={"center"} fontSize={"2xl"}>
        Ups! Algo ocurrio en el servidor...
      </Text>
    );
  const productos: ProductInterface[] = data?.body?.products || [];
  return (
    <>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        my={2}
        px={5}
        color={"ly.700"}
        position={"relative"}
        justifyContent={"space-between"}
      >
        <Box
          boxShadow="0px 4px 10px rgba(254, 189, 87, 0.5)" // Sombra con color rojo
          display="inline-block"
          rounded={"2xl"}
          py={2}
          px={3}
        >
          <Text fontSize={"4xl"} fontWeight={"bold"} shadow={"2xl"}>
            {actualCategory?.name}
          </Text>
        </Box>
        <Text fontSize={"2xl"} my={8} color={"ly.400"}>
          Elija y Personalize su pedido
        </Text>
        <SimpleGrid
          gap={5}
          justifyContent={"center"}
          columns={[1, 1, 2, 2, 3]}
        >
          {productos.map((producto: ProductInterface) => (
            <Producto producto={producto} key={producto.id} isAdmin={isAdmin} />
          ))}
        </SimpleGrid>

        <Paginacion
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoadingFetch={isLoadingFetch}
          setIsLoadingFetch={setIsLoadingFetch}
          totalPages={totalPages}
        />
      </Flex>
      <ModalHistory />
      {spinnerPayMercadoP && (
        <CircularProgress
          isIndeterminate
          color="green.500"
          size="120px"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </>
  );
}
