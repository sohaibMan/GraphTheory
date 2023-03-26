import React from "react";
import styles from "../../styles/Buttons.module.css";

function ButtonDownload({ link, message }: { link: string; message: string }) {
  return (
    <button
      className={styles.button}
      onClick={() => {
        window.open(link);
      }}
      style={{ color: "#ecf0f1", textDecoration: "none" }}
    >
      {message}
    </button>
  );
}

export default ButtonDownload;
