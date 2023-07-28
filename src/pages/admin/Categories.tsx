import {
  Flex,
  Button,
  Tabs,
  TabList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  CircularProgress,
  useDisclosure,
  SimpleGrid,
  Box,
  Text,
} from "@chakra-ui/react";
import MenuMobile from "../../components/MenuMobile";
import { useMediaQuery } from "react-responsive";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useApp from "../../hook/useApp";
import { CategoryCard } from "../../components/CategoryCard";
import { createFormData } from "../../utils/validators";
import { useToastResponses } from "../../hook/useToastResponses";
import { createNewCategory, getAllCategories } from "../../api/category.api";
import { updateCategoriesRX } from "../../helpers/subjectsRx.helper";
import { CategoryInterface } from "../../interfaces/category";

export default function Categories() {
  const { categories } = useApp();

  const [categoriesAdmin, setCategoriesAdmin] = useState<
    CategoryInterface[] | null
  >(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, register, getValues, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { error, success } = useToastResponses();

  useEffect(() => {
    const getCategoriesAdmin = async () => {
      const response = await getAllCategories(true);
      setCategoriesAdmin(response.data.body);
    };
    getCategoriesAdmin();
  }, [categories]);

  const onSubmitNewCategory = async () => {
    setIsLoading(true);
    const name: string = getValues("name").toString().trim();
    const img = getValues("img");
    if (name === "") {
      error("Ingrese un Nombre Valido");
      setIsLoading(false);
      return;
    }
    if (img.length < 1) {
      error("Ingrese una Imagen Valida");
      setIsLoading(false);
      return;
    }
    const formData = createFormData(getValues());
    try {
      reset();
      const response = await createNewCategory(formData);
      if (!response.data.ok) throw new Error("err");
      success(`${response.data.body.name} categoria creada Exitomasamente`);
      setIsLoading(false);
      updateCategoriesRX.setSubject(true);
      onClose();
    } catch (errorFromCatch) {
      error("Error de Servidor");
      setIsLoading(false);
      console.log(errorFromCatch);
    }
  };

  return (
    <>
      {isMobile ? (
        <Flex
          shadow={"2xl"}
          justifyContent={"flex-start"}
          alignContent={"center"}
          pb={4}
          gap={5}
        >
          <MenuMobile />
          <Button
            onClick={onOpen}
            _hover={{ bgColor: "orange.400" }}
            bgColor={"orange.300"}
            rounded={"md"}
          >
            Crear Nueva Categoria
          </Button>
        </Flex>
      ) : (
        <Tabs position="relative" variant="unstyled">
          <TabList>
            <Button
              mb={2}
              onClick={onOpen}
              _hover={{ bgColor: "orange.400" }}
              bgColor={"orange.300"}
              rounded={"md"}
            >
              Crear Nueva Categoria
            </Button>
          </TabList>
        </Tabs>
      )}

      <Flex justifyContent={"center"}>
        <Box
          boxShadow="0px 4px 10px rgba(254, 189, 87, 0.5)" // Sombra con color rojo
          display="inline-block"
          rounded={"2xl"}
          py={2}
          px={3}
          color={"ly.700"}
        >
          <Text fontSize={"4xl"} fontWeight={"bold"} shadow={"2xl"}>
            Categorias
          </Text>
        </Box>
      </Flex>
      <Text
        display={"block"}
        textAlign={"center"}
        fontSize={"2xl"}
        my={8}
        color={"ly.400"}
      >
        Edita tus Categorias
      </Text>

      <Flex justifyContent={"center"}>
        <SimpleGrid gap={5} columns={[1, 1, 2, 2, 3]}>
          {categoriesAdmin?.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </SimpleGrid>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form encType="multipart/form-data">
              <Heading mb={4}>Crear Nueva Categoria</Heading>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Tu nombre de categoria"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Imagen</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  {...register("img")}
                  name="img"
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            {isLoading ? (
              <Flex justifyContent={"center"} alignItems={"center"}>
                <CircularProgress isIndeterminate color="green.300" />
              </Flex>
            ) : (
              <Button
                onClick={handleSubmit(onSubmitNewCategory)}
                type="submit"
                colorScheme="blue"
                width={"full"}
              >
                Crear
              </Button>
            )}
            <Button colorScheme="red" ml={1} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
