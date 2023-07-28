import {
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import useApp from "../../hook/useApp";
import MenuMobile from "../../components/MenuMobile";
import Home from "../home/Home";
import { useToastResponses } from "../../hook/useToastResponses";
import { createFormData } from "../../utils/validators";
import { createNewProduct } from "../../api/product.api";
import { sizesForm } from "../../helpers/subjectsRx.helper";
import { FormularioSizes } from "../../components/FormularioSizes";

export default function Products() {
  const { categories, handleClickCategory } = useApp();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, getValues, reset } = useForm();
  const { error, success } = useToastResponses();

  const validateProduct = () => {
    const name: string = getValues("name").toString().trim();
    const description: string = getValues("description").toString().trim();
    const img = getValues("img");
    const category: string = getValues("category").toString().trim();
    const price: string = getValues("price").toString().trim();
    if (name === "") {
      error("Ingrese un Nombre Valido");
      return false;
    }

    if (description === "") {
      error("Ingrese una Descripcion Valida");
      return false;
    }
    if (category === "") {
      error("Ingrese una Categoria Valida");
      return false;
    }

    if (img.length < 1) {
      error("Ingrese una Imagen Valida");
      return false;
    }

    if (price === "" || isNaN(Number(price))) {
      error("Ingrese una Precio Valido");
      return false;
    }
    return true;
  };

  const onSubmitNewProduct = async () => {
    setIsLoading(true);
    if (!validateProduct()) {
      setIsLoading(false);
      return;
    }

    const formData = createFormData(getValues());
    try {
      reset();
      const response = await createNewProduct(formData);
      if (!response.data.ok) throw new Error("err");
      success(`${response.data.body.name} creado correctamente`);
      setIsLoading(false);
      sizesForm.setSubject([
        "createProduct",
        true,
        Number(response.data.body.id),
      ]);
      onClose();
    } catch (errorFromCatch) {
      console.log(errorFromCatch);
      error("Error de Servidor");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isMobile ? (
        <Flex
          shadow={"2xl"}
          justifyContent={"flex-start"}
          alignContent={"center"}
          pb={1}
          gap={5}
        >
          <MenuMobile />
          <Button
            onClick={onOpen}
            _hover={{ bgColor: "orange.400" }}
            bgColor={"orange.300"}
            rounded={"md"}
          >
            Crear Nuevo Producto
          </Button>
        </Flex>
      ) : (
        <Flex w={"full"}>
          <Tabs position="relative" variant="unstyled" flex={3}>
            <TabList gap={2}>
              <Button
                onClick={onOpen}
                _hover={{ bgColor: "orange.400" }}
                bgColor={"orange.300"}
                rounded={"md"}
              >
                Crear Nuevo Producto
              </Button>
              {categories?.map((category) => (
                <Tab
                  fontSize={"lg"}
                  p={2}
                  color={"ly.700"}
                  onClick={() => handleClickCategory(category.id)}
                >
                  {category.name}
                </Tab>
              ))}
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="4px"
              bg="orange.300"
              borderRadius="1px"
            />
          </Tabs>
        </Flex>
      )}
      <Home isAdmin={true} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form encType="multipart/form-data">
              <Heading mb={4}>Nuevo Producto</Heading>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Tu nombre del producto"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Descripcion</FormLabel>
                <Input
                  {...register("description")}
                  type="text"
                  placeholder="Tu descripcion"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Imagen</FormLabel>
                <input type="file" accept="image/*" {...register("img")} name="img" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Categoria</FormLabel>

                <Select
                  defaultValue={1}
                  placeholder="Tu categoria"
                  {...register("category")}
                >
                  {categories?.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Precio</FormLabel>
                <Input
                  {...register("price")}
                  type="text"
                  placeholder="Tu precio (sin puntos) ej : 23000"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
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
                onClick={handleSubmit(onSubmitNewProduct)}
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
     <FormularioSizes />
      {/*Modal of Create */}
    </>
  );
}
