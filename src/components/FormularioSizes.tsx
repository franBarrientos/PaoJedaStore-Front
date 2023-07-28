import {
  Flex,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  ModalFooter,
  Heading,
} from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import apiClient from "../config/axiosClient";
import { useToastResponses } from "../hook/useToastResponses";
import { sizesForm, updateProductsRX } from "../helpers/subjectsRx.helper";
import { useEffect, useState } from "react";
import { productsSizes } from "../interfaces/productsSizes";
import { SizeInterface } from "../interfaces/size";

type sizeToSend = {
  size: number;
  quantity: number;
  product: number;
}[];

export const FormularioSizes: React.FC = () => {
  const { register, getValues, reset } = useForm();
  const { error, success } = useToastResponses();
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [idProduct, setIdProduct] = useState<number>(1);
  const [sizes, setSizes] = useState<SizeInterface[] | null>(null);
  const [productsSizes, setProductsSizes] = useState<
    productsSizes[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const { data } = await apiClient("/size");
        setSizes(data.body);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSizes();
  }, []);

  useEffect(() => {
    const subscription = sizesForm.getSubject.subscribe(
      ([objeto, value, idProduct, productsSizes]) => {
        if (objeto == "createProduct" && value && idProduct) {
          setIdProduct(idProduct);
          setOpenHistory(true);
        } else {
          setProductsSizes(productsSizes);
          const defaultValues: FieldValues = {};
          sizes?.forEach((size) => {
            const productSize = productsSizes?.find(
              (item) => item?.size?.id === size.id
            );
            defaultValues[size.id] = productSize ? productSize.quantity : "";
          });
          reset(defaultValues);
          setIdProduct(idProduct);
          setOpenHistory(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [sizes]);


  const handleSubmitNewSizes = async () => {
    setIsLoading(true);
    const tallesFormulario: any = Object.entries(getValues()).filter(
      ([, cantidad]) => cantidad !== ""
    );

    if (Object.keys(tallesFormulario).length === 0) {
      error("Debes ingresar al menos 1 talle");
      setIsLoading(false);
      return;
    }
    try {
      const sizesArrToQuery = tallesFormulario.map(([talle, value]: any) => ({
        quantity: Number(value),
        size: Number(talle),
        product: idProduct,
      }));

      const response = await apiClient.post("/productsSizes", {
        sizesArrToQuery,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.data.ok) throw new Error("error sizesProducts");
      success("Talles guardados correctamente");
      reset();
      setOpenHistory(false);
    } catch (errorFromCatch) {
      console.log(errorFromCatch);
      error("Ocurrio un error al guardar los talles");
    }
    setIsLoading(false);
  };

  const handleSubmitUpdateSizes = async () => {
    setIsLoading(true);
    const talleCantidadArray: sizeToSend = Object.entries(getValues()).map(
      ([talle, cantidad]) => ({
        quantity: Number(cantidad),
        size: Number(talle),
        product: idProduct,
      })
    );

    const tallesExistentes = talleCantidadArray
      .map((talleCantidad) => {
        const existingTalle = productsSizes?.filter(
          (existingTalle) => existingTalle?.size?.id === talleCantidad.size
        );
        if (existingTalle && existingTalle.length > 0) {
          const hasDifferentQuantity = existingTalle.some(
            (item) => item.quantity !== talleCantidad.quantity
          );
          if (hasDifferentQuantity) {
            return { ...existingTalle[0], quantity: talleCantidad.quantity };
          }
        }
        return null;
      })
      .filter((existingTalle) => existingTalle !== null);

    const tallesNuevos = talleCantidadArray.filter((talleCantidad) => {
      if (
        talleCantidad.quantity > 0 &&
        !productsSizes?.find(
          (existingTalle) => existingTalle?.size?.id === talleCantidad.size
        )
      )
        return true;
    });

    try {
      const postCreate = apiClient.post("/productsSizes", {
        sizesArrToQuery: tallesNuevos,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const postUpdates = tallesExistentes.map((talle) => {
        console.log(talle);
        if (talle?.quantity! > 0) {
          return apiClient.put(`/productsSizes/${talle?.id}`, {
            quantity: talle?.quantity,
          },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } else {
          return apiClient.delete(`/productsSizes/${talle?.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }
      });

      const response = await Promise.all([postCreate, ...postUpdates]);
      if (response.some((res) => !res.data.ok)) {
        throw new Error("Error en alguna de las peticiones");
      }
      updateProductsRX.setSubject(true);
      success("Talles guardados correctamente");
      setIsLoading(false);
      setOpenHistory(false);
    } catch (errorFromCatch) {
      console.log(errorFromCatch);
      setIsLoading(false);
      error("Ocurrio un error al guardar los talles");
    }
  };

  console.log("productsSizes", productsSizes);
  return (
    <>
      <Modal isOpen={openHistory} onClose={() => setOpenHistory(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Ingresa los talles </ModalHeader>
          <ModalCloseButton />
          {isLoading ? (
            <Flex mt={4} justifyContent={"center"} alignItems={"center"}>
              <CircularProgress isIndeterminate color="green.300" />
            </Flex>
          ) : (
            <ModalBody>
              <form>
                <Heading mb={4}>Talles</Heading>
                <Flex justifyContent={"space-evenly"} w={"full"}>
                  <SimpleGrid columns={2} spacing={1}>
                    {sizes?.map((size) => {
                      return (
                        <FormControl mt={4}>
                          <FormLabel htmlFor="sizeS">
                            Talle {size.name}
                          </FormLabel>
                          <Input
                            type="text"
                            placeholder="Cantidad ej:1"
                            focusBorderColor="gray.600"
                            borderColor={"whiteAlpha.300"}
                            shadow={"xl"}
                            _placeholder={{ color: "gray.400" }}
                            {...register(`${size.id}`)}
                          />
                        </FormControl>
                      );
                    })}
                  </SimpleGrid>
                </Flex>
              </form>
            </ModalBody>
          )}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() =>
                productsSizes
                  ? handleSubmitUpdateSizes()
                  : handleSubmitNewSizes()
              }
            >
              Guardar
            </Button>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setOpenHistory(false)}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
