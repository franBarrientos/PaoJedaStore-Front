import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const WhatsappButton = () => {
  const numeroWhatsApp = import.meta.env.VITE_WPP;

  const openWhatsApp = () => {
    const mensaje = "¡Hola Pao 😊! necesito ayuda en ";
    const enlaceWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(
      mensaje
    )}&type=phone_number`;
    window.open(enlaceWhatsApp, "_blank");
  };
  return (
    <a
      href="#"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        backgroundColor: "green",
        color: "white",
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
      onClick={openWhatsApp}
    >
      <FontAwesomeIcon icon={faWhatsapp} size="xl" />{" "}
    </a>
  );
};

export default WhatsappButton;
