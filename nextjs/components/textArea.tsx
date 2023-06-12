import * as React from "react";
import TextareaAutosize from "@mui/base/TextareaAutosize";

export function TextArea(props: { onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => Promise<void> }) {
    return <TextareaAutosize
        onChange={props.onChange}
        aria-label="empty textarea"
        placeholder={"node->edge->weight\n1 2\n1 3\n2 4\n2 5"}
        style={{
            width: "450px",
            margin: "auto",
            height: 200,
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
            borderRadius: "5px",
        }}
    />;
}