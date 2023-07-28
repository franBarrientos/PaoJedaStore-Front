import { Box, Img, Text } from "@chakra-ui/react";
import useApp from "../hook/useApp";
import { CategoryInterface } from "../interfaces/category";

type props = {
  category: CategoryInterface;
  isAdmin?: boolean;
};

export default function Categoria({ category, isAdmin = false }: props) {
  const {
    handleClickCategory,
    actualCategory,
    handleClickCategoryAdmin,
    featureAdmin,
  } = useApp();

  return (
    <Box
      onClick={() =>
        isAdmin ? handleClickCategoryAdmin(category.id) : handleClickCategory(category.id)
      }
      display={"flex"}
      alignItems={"center"}
      gap={2}
      color={
        !isAdmin
          ? actualCategory!.id === category.id
            ? "#ly.900"
            : "ly.700"
          : featureAdmin!.id === category.id
          ? "#ly.900"
          : "ly.700"
      }
      borderColor={"gray.100"}
      w={"full"}
      p={1}
      _hover={{ backgroundColor: "#FFC200", cursor: "pointer", color:"ly.900" }}
      bgColor={
        !isAdmin
          ? actualCategory!.id === category.id
            ? "#FFC200"
            : "ly.800"
          : featureAdmin!.id === category.id
          ? "#FFC200"
          : "ly.800"
      }
    >
      <Img rounded={"full"} w={"12"} height={"14"} src={category.img}></Img>
      <Text fontSize="xl" fontWeight={"semibold"}>
        {" "}
        {category.name}{" "}
      </Text>
    </Box>
  );
}
