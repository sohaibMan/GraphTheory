import React, { useRef } from "react";
import styles from "../../styles/Input.module.css";
function Input({
  message,
  placeHolder,
  onSubmit,
}: {
  message: string;
  placeHolder: string;
  onSubmit: (startingNode: string) => void;
}) {
  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        onSubmit(e.currentTarget.elements.startingNode.value);
        e.currentTarget.elements.startingNode.value = "";
      }}
      className={styles["input-group"]}
    >
      <input
        type="text"
        className={styles.input}
        id="startingNode"
        name="startingNode"
        placeholder={placeHolder}
        autoComplete="off"
        required
      />
      <button type="submit" className={styles["button--submit"]}>
        {message}
      </button>
    </form>
  );
}

export default Input;
