import React from "react";
import styles from "../../styles/Buttons.module.css";
function Button({
  message,
  onClick,
  isDisabled,
}: {
  message: string;
  onClick: () => void;
  isDisabled: boolean;
}) {
  return (
    <button disabled={isDisabled} onClick={onClick} className={styles.button}>
      {message}
    </button>
  );
}

export default Button;
