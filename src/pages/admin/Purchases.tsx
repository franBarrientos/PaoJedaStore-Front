import { SimpleGrid, Text, Box, Flex } from "@chakra-ui/react";
import useSWR from "swr";
import apiClient from "../../config/axiosClient";
import {  useEffect, useState } from "react";
import { Paginacion } from "../../components/Paginacion";
import { CardPurchaseAdmin } from "../../components/CardPurchaseAdmin";
import { SearchPurchasestButton } from "../../components/SearchPurchasesButton";
import { updatePurchasesAdminRx } from "../../helpers/subjectsRx.helper";

export const Purchases = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  
  const generateUrlWithPagination = (): string =>
    `/purchase?skip=${currentPage}`;

  const fetcher = async (url: string) => {
    const response = await apiClient(url);
    setTotalPages(response.data.body.totalPages);
    setIsLoadingFetch(false);
    return response.data;
  };

  const { data, isLoading, error, mutate } = useSWR(
    generateUrlWithPagination(),
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  useEffect(() => {
    const subscription = updatePurchasesAdminRx.getSubject.subscribe(
      (value) => {
        if (value) {
         mutate()
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentPage]);


  if (isLoading) return <Text>Loading...</Text>;
  if (error)
    return (
      <Text color="ly.700" textAlign={"center"} fontSize={"2xl"}>
        Aun no hay ventas
      </Text>
    );

  return (
    <Box justifyContent={"center"}>
      <Flex w={"full"} justifyContent={"center"}>
        <SearchPurchasestButton />
      </Flex>
      <SimpleGrid mt={10} gap={4} columns={[1, 2, 2, 3, 4]}>
        {data.body.purchases.map((purchase: any) => {
          return <CardPurchaseAdmin purchase={purchase} key={purchase.id} />;
        })}
      </SimpleGrid>
      <Paginacion
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoadingFetch={isLoadingFetch}
        setIsLoadingFetch={setIsLoadingFetch}
        totalPages={totalPages}
      />
    </Box>
  );
};
