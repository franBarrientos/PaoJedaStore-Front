import {
  Card,
  Stack,
  CardBody,
  Heading,
  CardFooter,
  Button,
  Image,
  useDisclosure,
  CircularProgress,
  Flex,
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { CategoryInterface } from "../interfaces/category";
import React, { useEffect, useRef, useState } from "react";
import {
  createFormData,
  getDifferentFields,
  validateExistChangesToUpdate,
} from "../utils/validators";
import { useToastResponses } from "../hook/useToastResponses";
import { updateCategory } from "../api/category.api";
import { updateCategoriesRX } from "../helpers/subjectsRx.helper";
import apiClient from "../config/axiosClient";

type props = {
  category: CategoryInterface;
};
export const CategoryCard: React.FC<props> = ({ category }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [editCategory, setEditCategory] = useState<{
    name?: string;
    img?: string | File;
  }>({ name: category.name, img: category.img });
  const { error, success, warning } = useToastResponses();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen1) {
      // Si el modal se cierra, restablecer el estado con los valores originales
      setEditCategory({ name: category.name, img: category.img });
    }
  }, [isOpen1, category]);

  const handleChangeCategory = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput?.files?.length) {
        const file = fileInput.files[0]; // Accedemos al archivo seleccionado
        setEditCategory({ ...editCategory, img: file });
      }
    } else {
      setEditCategory({ ...editCategory, [e.target.name]: e.target.value });
    }
  };

  const onSubmitEditCategory = async () => {
    setIsLoading(true);
    const formData: { name?: string; img?: string | File } = getDifferentFields(
      editCategory,
      category
    );
    if (!validateExistChangesToUpdate(formData)) {
      warning("No existen cambios por actualizar");
      setIsLoading(false);
      return;
    }

    if (formData.name === "") {
      setIsLoading(false);
      error("Agrege un nombre Valido");
      return;
    }
    const formDataa = createFormData(formData);
    try {
      const response = await updateCategory(formDataa, category.id);
      if (!response.data.ok) throw new Error("err");
      updateCategoriesRX.setSubject(true);
      success("Cambios guardados correctamente");
      onClose1();
      setIsLoading(false);
      return;
    } catch (errorFromCatch) {
      console.log(errorFromCatch);
      error("Valores invalidos", "Intente de nuevo por favor");
      setIsLoading(false);
      return;
    }
  };

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      display={"flex"}
      justifyContent={"center"}
      maxW="sm"
      boxShadow="2px 6px 10px rgba(254, 189, 87, 0.5)" // Sombra con color rojo
      bg={"ly.900"}
      color={"ly.700"}
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={category.img}
        alt={category.name}
      />

      <Stack>
        <CardBody>
          <Heading size="md">{category.name}</Heading>
        </CardBody>

        <CardFooter>
          <Stack direction={"column"} spacing={2}>
            <Button
              onClick={() => onOpen1()}
              variant="solid"
              colorScheme="blue"
              shadow={"xl"}
            >
              Editar
            </Button>
            {category.state ? (
              <Button
                onClick={() => onOpen()}
                variant="solid"
                colorScheme="red"
                shadow={"xl"}
              >
                Eliminar
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const categoryUpdated = await apiClient.put(
                      `/category/${category.id}`,
                      {
                        state: true,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    if (categoryUpdated && categoryUpdated.data.ok) {
                      success("Categoria actualizada correctamente");
                      setIsLoading(false);
                      onClose();
                      updateCategoriesRX.setSubject(true);
                    }
                  } catch (errorFromCatch) {
                    console.log(errorFromCatch);
                    setIsLoading(false);
                    error(
                      "No se ha podido dar de alta la categoria algo ocurrio.."
                    );
                  }
                }}
                variant="solid"
                colorScheme="green"
                shadow={"xl"}
              >
                Alta
              </Button>
            )}
          </Stack>
        </CardFooter>
      </Stack>
      <Modal isOpen={isOpen1} onClose={onClose1}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Heading mb={4}>Editar Categoria</Heading>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeCategory}
                  value={editCategory.name}
                  placeholder="Tu nombre de producto"
                  focusBorderColor="gray.600"
                  borderColor={"whiteAlpha.300"}
                  shadow={"xl"}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Imagen</FormLabel>
                <input type="file" onChange={handleChangeCategory} name="img" />
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
                onClick={() => onSubmitEditCategory()}
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
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Presiona si para confirmar</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Estas seguro que deseas eliminar? Se eliminaran todos los productos
            de esta categoria
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>No</Button>
            {isLoading ? (
              <Flex justifyContent={"center"} alignItems={"center"}>
                <CircularProgress isIndeterminate color="green.300" />
              </Flex>
            ) : (
              <Button
                colorScheme="red"
                ml={3}
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const categoryUpdated = await apiClient.put(
                      `/category/${category.id}`,
                      {
                        state: false,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    if (categoryUpdated && categoryUpdated.data.ok) {
                      success("Categoria eliminada correctamente");
                      setIsLoading(false);
                      onClose();
                      updateCategoriesRX.setSubject(true);
                    }
                  } catch (errorFromCatch) {
                    console.log(errorFromCatch);
                    setIsLoading(false);
                    error("No se ha podido elimar la categoria algo ocurrio..");
                  }
                }}
              >
                Si
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
