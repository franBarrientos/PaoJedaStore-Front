import { CloseButton, Flex } from "@chakra-ui/react";

type props = {
  imageUrl: any;
  onClose: any;
};
export const ImageModal = ({ imageUrl, onClose }: props) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxHeight: "90%",
          maxWidth: "90%",
          overflow: "hidden",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            maxHeight:"70vh",
            maxWidth:"70vh",
            objectFit: "contain",
          }}
          src={imageUrl}
          alt="Ampliada"
        />
        <Flex justifyContent={"center"} alignItems={"center"}>
          <CloseButton mt={5} color={"ly.400"} size={"lg"}  onClick={onClose} />
        </Flex>
      </div>
    </div>
  );
};
