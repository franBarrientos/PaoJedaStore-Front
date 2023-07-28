import {
  Button,
  CircularProgress,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import useApp from "../../hook/useApp";
import { useState, useEffect } from "react";
import { PurchaseInterface } from "../../interfaces/purchase";
import { CardHistory } from "./CardHistory";
import { modalesRX } from "../../helpers/subjectsRx.helper";
import { getPurchasesByCustomer } from "../../api/purchase.api";
export default function ModalHistory() {
  const { user } = useApp();
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<PurchaseInterface[] | null>(null);
  const observable = modalesRX.getSubject;
  const fetchPurchases = async () => {
    try {
      const { data } = await getPurchasesByCustomer(
        user?.customer?.id ? user?.customer?.id : 999
      );
      setPurchases(data.body);
    } catch (error) {
      setTimeout(() => {
        setOpenHistory(false);
      }, 2000);
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const subscription = observable.subscribe(([objeto, value]) => {
      if (objeto == "history" && value) {
        console.log("data");
        setOpenHistory(true);
        setIsLoading(true);
        fetchPurchases();
      } else {
        objeto == "history" && setOpenHistory(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <>
      <Modal isOpen={openHistory} onClose={() => setOpenHistory(false)}>
        <ModalOverlay />
        <ModalContent
          maxH={"90%"}
          overflowY={"scroll"}
          bg={"ly.900"}
          color={"ly.700"}
        >
          {!purchases ? (
            <ModalHeader>Aun no Hay compras realizadas..</ModalHeader>
          ) : (
            <>
              <ModalHeader>🛍 Compras 🛍</ModalHeader>
              <ModalCloseButton />
              {isLoading ? (
                <Flex mt={4} justifyContent={"center"} alignItems={"center"}>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              ) : (
                <ModalBody>
                  {purchases?.map((purchase) => {
                    return <CardHistory key={purchase.id} {...purchase} />;
                  })}
                </ModalBody>
              )}

              <ModalFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => setOpenHistory(false)}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
