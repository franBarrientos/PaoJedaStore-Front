import {
  Card,
  Stack,
  CardBody,
  Heading,
  Text,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { PurchaseInterface } from "../../interfaces/purchase";
import { ProductInterface } from "../../interfaces/product";
import { formatDate } from "../../utils/dates";

export const CardHistory: React.FC<PurchaseInterface> = ({
  payment,
  state,
  id,
  purchasesProducts,
  totalPurchase,
  createdAt,
}) => {
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        bg={"ly.800"}
        color={"ly.400"}
      >
        <Stack>
          <CardBody>
            <Heading size="md">Nro de Compra: {id}</Heading>
            <Heading size="md">
              Estado de Compra: {state == "paid" ? "Pagado" : state}
            </Heading>
            <Heading size="md">Productos: </Heading>
            <UnorderedList>
              {purchasesProducts?.map((purchase: any) => {
                return (
                  <Stack
                    key={purchase.id}
                    rounded={"xl"}
                    p={1}
                    direction={"column"}
                    spacing={1}
                  >
                    <ListItem>
                      {(purchase.product as ProductInterface).name}
                    </ListItem>
                    <Text>
                      Cantidad: {purchase.quantity} en {purchase.size.name || ""}
                    </Text>
                  </Stack>
                );
              })}
            </UnorderedList>
            <Heading size="md">
              Pago: {payment == "MP" ? "Mercado Pago" : "Efectivo"}
            </Heading>
            <Heading size="md">Fecha: {formatDate(createdAt || "")}</Heading>
            <Heading mt={1} size="md">
              💵 Total: ${totalPurchase}
            </Heading>
          </CardBody>
        </Stack>
      </Card>
    </>
  );
};
