import {
  Box,
  Input,
  Button,
  Flex,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Heading,
  SimpleGrid,
  CircularProgress,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import apiClient from "../config/axiosClient";
import { ProductInterface } from "../interfaces/product";
import { useState, useRef } from "react";
import Producto from "./Producto";
import { Paginacion } from "./Paginacion";
type props = {
  isAdmin?: boolean;
};
export const SearchProductButton = ({isAdmin = false}:props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [results, setResults] = useState<ProductInterface[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const name = useRef<HTMLInputElement>(null);
  const fetchByName = async () => {
    try {
      const response = await apiClient.get(
        `/product/byName?name=${
          name.current?.value ? name.current.value : ""
        }&&skip=${currentPage}`
      );
      setResults(response.data.body.products);
      setTotalPages(response.data.body.totalPages);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    onOpen();
    fetchByName();
  };
  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
          <Flex justifyContent={"center"} alignItems={"center"} gap={1}>
            <Input
              color={"ly.400"}
              type={"text"}
              ref={name}
              placeholder={"Ej: Jeans mom"}
            />
            <Button type="submit" /* onClick={handleSubmit} */>
              <Search2Icon />
            </Button>
          </Flex>
        </form>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"ly.800"} color={"ly.700"}>
          <ModalHeader>Resultados de la busqueda 🔍</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <CircularProgress
                isIndeterminate
                color="green.500"
                size="120px"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              />
            ) : (
              <Box>
                {!results ? (
                  <Heading>No se encontraron resultados.....</Heading>
                ) : (
                  <>
                    <SimpleGrid gap={5} justifyContent={"center"} columns={[1]}>
                      {results.map((producto: ProductInterface) => (
                        <Producto
                          producto={producto}
                          key={producto.id}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </SimpleGrid>
                    <Paginacion
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      isLoadingFetch={isLoading}
                      setIsLoadingFetch={setIsLoading}
                      totalPages={totalPages}
                      forceFetch={fetchByName}
                    />
                  </>
                )}
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
