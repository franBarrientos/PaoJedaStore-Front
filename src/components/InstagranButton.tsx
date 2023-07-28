import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useMediaQuery } from '@chakra-ui/react';

export const InstagramButton = () => {
  const ig = import.meta.env.VITE_IG;
  const [isSmallScreen] = useMediaQuery('(min-width: 768px)');
  const openIg = () => {
    window.open(ig, "_blank");
  };
  return (
    <a
      href="#"
      style={{
        position: "fixed",
        bottom:isSmallScreen? "20px" : "90px",
        left: isSmallScreen? "100px" : "20px",
        backgroundColor: "#F60276",
        color: "white ",
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      }}
      onClick={openIg}
    >
      <FontAwesomeIcon icon={faInstagram} size="xl" />
    </a>
  );
};
