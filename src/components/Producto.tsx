import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  Button,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberInputField,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { ProductInterface } from "../interfaces/product";
import useApp from "../hook/useApp";
import { useState, useRef, useEffect } from "react";
import apiClient from "../config/axiosClient";
import { releaseImgUrl } from "../helpers/cloudinaty.helper";
import {
  createFormData,
  getDifferentFields,
  validateExistChangesToUpdate,
} from "../utils/validators";
import { useToastResponses } from "../hook/useToastResponses";
import { CategoryInterface } from "../interfaces/category";
import { updateProduct } from "../api/product.api";
import { sizesForm, updateProductsRX } from "../helpers/subjectsRx.helper";
import { ImageModal } from "./ImageModal";
import { SizeInterface } from "../interfaces/size";
type productoProp = {
  producto: ProductInterface;
  key: number;
  isAdmin: boolean;
};

interface ProductForm {
  img?: string | File | FileList;
  category?: CategoryInterface | number | string;
  name?: string;
  description?: string;
  price?: number | string;
}

const sizeInitial = {
  id: 0,
  name: "",
  description: "",
};

export default function Producto({ producto, isAdmin = false }: productoProp) {
  const { handleAddToCarrito, categories } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<SizeInterface>(sizeInitial);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { error, success, warning } = useToastResponses();
  const [editProduct, setEditProduct] = useState<ProductForm>({
    category: producto.category,
    description: producto.description,
    img: producto.img,
    name: producto.name,
    price: producto.price,
  });
  const [selectedImage, setSelectedImage] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen1) {
      setEditProduct({
        category: producto.category,
        description: producto.description,
        img: producto.img,
        name: producto.name,
        price: producto.price,
      });
    }
  }, [isOpen1, producto]);

  const handleChangeProduct = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput?.files?.length) {
        const file = fileInput.files[0]; // Accedemos al archivo seleccionado
        setEditProduct({ ...editProduct, img: file });
      }
    } else {
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };

  const onSubmitEditProduct = async () => {
    setIsLoading(true);
    const formData: ProductForm = getDifferentFields(editProduct, producto);
    if (!validateExistChangesToUpdate(formData)) {
      warning("No existen cambios por actualizar");
      setIsLoading(false);
      return;
    }
    if (
      formData.description === "" ||
      formData.price === "" ||
      formData.name === "" ||
      formData.category === ""
    ) {
      setIsLoading(false);
      error("Faltan Campos Porfavor completalos");
      return;
    }
    if (formData.price) formData.price = Number(formData.price);
    if (formData.category) formData.category = Number(formData.category);

    const formDataa = createFormData(formData);
    try {
      const response = await updateProduct(formDataa, producto.id);
      if (!response.data.ok) throw new Error("err");
      updateProductsRX.setSubject(true);
      success("Changes Saved Successfuly");
      onClose1();
      setIsLoading(false);
      return;
    } catch (errorFromCatch) {
      error("Valores Invalidos"), setIsLoading(false);
      return;
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(false);
  };
  return (
    <Card
      maxW="sm"
      boxShadow="2px 6px 10px rgba(254, 189, 87, 0.5)" // Sombra con color rojo
      bg={"ly.900"}
    >
      <CardBody color={"ly.400"} pb={1}>
        <Image
          src={releaseImgUrl(producto.img)}
          w={400}
          h={300}
          borderRadius="lg"
          onClick={() => setSelectedImage(true)}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{producto.name}</Heading>
          <Text>{producto.description}</Text>
          <Text color="ly.700" fontSize="2xl">
            ${producto.price}
          </Text>
        </Stack>
      </CardBody>
      {!isAdmin && (
        <>
          <Divider />
          <Text
            pb={1}
            color="ly.700"
            fontSize="xl"
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Talles Disponibles
          </Text>
          <Text
            color="ly.700"
            fontSize="m"
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Escoje uno
          </Text>

          <Divider />
          <Flex justifyContent={"space-evenly"} alignItems={"center"} gap={2}>
            {producto.productsSizes?.map((productS) => {
              return (
                <Text
                  bgColor={productS.size?.id == size.id ? "ly.700" : "ly.800"}
                  color={productS.size?.id == size.id ? "ly.800" : "ly.700"}
                  rounded={"lg"}
                  p={2}
                  my={1}
                  cursor={"pointer"}
                  onClick={() =>
                    productS.size?.id == size.id
                      ? setSize(sizeInitial)
                      : setSize(productS.size!)
                  }
                >{`${productS.size?.name}`}</Text>
              );
            })}
          </Flex>
        </>
      )}
      {isAdmin && (
        <>
          <Text pb={1} color="ly.700" fontSize="xl" textAlign={"center"}>
            Talles y stock
          </Text>
          <Divider />
          <Flex justifyContent={"space-evenly"} alignItems={"center"} gap={2}>
            {producto.productsSizes?.map((productS) => {
              return (
                <Text
                  bgColor={"ly.800"}
                  color="ly.700"
                  rounded={"lg"}
                  p={2}
                  my={1}
                >{`${productS.size?.name} : ${productS.quantity}`}</Text>
              );
            })}
          </Flex>
        </>
      )}
      <Divider />
      <CardFooter>
        {isAdmin ? (
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
            direction={{ base: "row" }}
            w={"full"}
          >
            <Button
              onClick={() => onOpen1()}
              variant="solid"
              colorScheme="blue"
              shadow={"xl"}
            >
              Editar
            </Button>
            <Button
              onClick={() => onOpen()}
              variant="solid"
              colorScheme="red"
              shadow={"xl"}
            >
              Eliminar
            </Button>
            <Button
              onClick={() => {
                sizesForm.setSubject([
                  "updateProduct",
                  true,
                  producto.id,
                  producto.productsSizes,
                ]);
              }}
              color="white"
              _hover={{
                bg: "#E79900",
              }}
              bg={"#E69618"}
              shadow={"xl"}
            >
              Stock
            </Button>
          </Flex>
        ) : (
          <Flex
            justifyContent={"space-evenly"}
            alignItems={"center"}
            w={"full"}
            mt={2}
            direction={{ base: "row", md: "column", xl: "row" }}
          >
            <NumberInput
              size="lg"
              color={"ly.400"}
              bg={"ly.800"}
              maxW={20}
              max={ size.id != 0
                ? producto.productsSizes?.find(
                    (fromProduct) => fromProduct.size?.id == size.id
                  )?.quantity
                : 1}
              min={1}
              value={quantity}
              onChange={(_, value) => setQuantity(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper color={"ly.400"} />
                <NumberDecrementStepper color={"ly.400"} />
              </NumberInputStepper>
            </NumberInput>
            <Button
              onClick={() => {
                if(size.id == 0){
                  error("Debes seleccionar almenos un talle para agregar al carrito")
                  return
                }
                handleAddToCarrito({ ...producto, quantity, size });
              }}
              variant="ghost"
              color={"ly.900"}
              bg={"ly.700"}
            >
              Añadir al Carrito
            </Button>
          </Flex>
        )}
      </CardFooter>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Presiona si para confirmar?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Estas seguro que deseas eliminar?</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>No</Button>
            {isLoading ? (
              <Flex justifyContent={"center"} alignItems={"center"}>
                <CircularProgress isIndeterminate color="green.300" />
              </Flex>
            ) : (
              <Button
                onClick={async () => {
                  try {
                    const productSizesToUpdate = producto.productsSizes?.map(
                      (productSize) => {
                        return apiClient.delete(
                          `/productsSizes/${productSize.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        updateProductsRX.setSubject(true);
                      }
                    );
                    if (
                      productSizesToUpdate &&
                      productSizesToUpdate.length > 0
                    ) {
                      const response = await Promise.all(productSizesToUpdate);
                      if (response.some((res) => !res.data.ok)) {
                        throw new Error("no update");
                        return;
                      }
                      setIsLoading(false);
                      toast({
                        title: "Producto eliminado correctamente",
                        status: "error",
                        duration: 2000,
                        position: "top-left",
                        isClosable: true,
                      });
                      onClose();
                      return;
                    } else {
                      toast({
                        title: "No existen talles para actualizar",
                        status: "warning",
                        duration: 2000,
                        position: "top-left",
                        isClosable: true,
                      });
                      return;
                    }
                  } catch (error) {
                    setIsLoading(false);
                    toast({
                      title: "Error on Server",
                      status: "error",
                      duration: 2000,
                      position: "top-left",
                      isClosable: true,
                    });
                  }
                }}
                colorScheme="red"
                ml={3}
              >
                Si
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Modal isOpen={isOpen1} onClose={onClose1}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Heading mb={4}>Editar Producto</Heading>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeProduct}
                  value={editProduct.name}
                  placeholder="Your product name"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Descripcion</FormLabel>
                <Input
                  type="text"
                  name="description"
                  onChange={handleChangeProduct}
                  value={editProduct.description}
                  placeholder="Your description"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Imagen</FormLabel>
                <input type="file" onChange={handleChangeProduct} name="img" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Categoria</FormLabel>

                <Select
                  defaultValue={
                    (editProduct.category as ProductInterface).id || 1
                  }
                  placeholder="Select category"
                  name="category"
                  onChange={handleChangeProduct}
                >
                  {categories?.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Precio</FormLabel>
                <Input
                  onChange={handleChangeProduct}
                  value={editProduct.price}
                  type="number"
                  name="price"
                  placeholder="Your price"
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
                onClick={() => onSubmitEditProduct()}
                type="submit"
                colorScheme="blue"
                width={"full"}
              >
                Guardar Cambios
              </Button>
            )}
            <Button colorScheme="red" ml={1} onClick={onClose1}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {selectedImage && (
        <ImageModal imageUrl={producto.img} onClose={handleCloseModal} />
      )}
    </Card>
  );
}
