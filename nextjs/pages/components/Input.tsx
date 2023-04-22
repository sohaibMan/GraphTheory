import React, { useRef } from "react";
import styles from "../../styles/Input.module.css";
function Input({
  message,
  placeHolder,
  onSubmit,
    regex,
    disabled
}: {
  message: string;
  placeHolder: string;
  onSubmit: (startingNode: string, endNode?: string) => void;
  regex?: string;
    disabled: boolean;
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
        pattern={regex}
        disabled={disabled}
      />
      <button type="submit" className={styles["button--submit"]}>
        {message}
      </button>
    </form>
  );
}

export default Input;
