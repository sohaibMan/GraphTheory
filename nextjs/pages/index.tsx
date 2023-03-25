import styles from "../styles/Home.module.css";
import { useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import TextAreaWithLineNumber from "@/pages/components/textAreaWithLineNumber";
import { useQuery } from "react-query";
import Button from "./components/Button";

export default function Home() {
  let nodes = useRef(new Set<String>());
  let edges = useRef(new Set<[String, String]>());
  let graphType = useRef("");

  console.log("🚀 ~ file: index.tsx:21 ~ useEffect ~ nodes:", nodes);

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(
    nodes.current.size === 0 && edges.current.size === 0
      ? {
          nodes: ["1", "2", "3", "4", "5"],
          edges: [
            ["1", "2"],
            ["1", "3"],
            ["2", "4"],
            ["2", "5"],
          ],
        }
      : {
          nodes: Array.from(nodes.current),
          edges: Array.from(edges.current),
        }
  );
  console.log("🚀 ~ file: index.tsx:29 ~ Home ~ raw:", raw);

  // console.log("🚀 ~ file: index.tsx:21 ~ useEffect ~ raw:", raw);

  let requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const {
    error,
    data: imgLink,
    isSuccess,
    refetch,
  } = useQuery("graph", () =>
    fetch(
      `http://localhost:9091/api/graph?graphType=${
        graphType.current || "directed"
      }`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result: { graphUrl: string }) => {
        console.log(result.graphUrl);
        return result.graphUrl;
      })
  );

  // useEffect(() => {
  //   ["1", "2", "3", "4", "5"].forEach((node) => nodes.current.add(node));
  //   [
  //     ["1", "2"],
  //     ["1", "3"],
  //     ["2", "4"],
  //     ["2", "5"],
  //   ].forEach((edge) => edges.current.add([edge[0], edge[1]]));
  //   refetch();
  // }, []);
  const myLoader = ({ src }: { src: String }) => {
    return `${src}`;
  };
  if (error) return <p>an error has occurred</p>;
  const changeHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const lines = input.split("\n");
    const NewNodes = new Set<String>();
    const NewEdges = new Set<[String, String]>();
    lines.forEach((line) => {
      line.split(" ")[0] &&
        NewNodes.add(line.split(" ")[0]) &&
        line.split(" ")[1] &&
        NewEdges.add([line.split(" ")[0], line.split(" ")[1]]);
    });
    nodes.current = NewNodes;
    edges.current = NewEdges;

    await refetch();
    // console.log("🚀 ~ file: index.tsx:50 ~ changeHandler ~ nodes:", nodes);
    //  lines.for
    // lines[0].split(" ")
  };

  return (
    <div className={styles.container}>
      <div>
        <p> Add your nodes and edges here:</p>
        <TextAreaWithLineNumber
          onChange={changeHandler}
          placeholder={"1 2\n1 3\n2 4\n2 5"}
        />
        <div className={styles.controlButtons}>
          <Button
            onClick={function () {
              graphType.current = "directed";
              refetch();
            }}
            isDisabled={graphType.current === "directed" ? true : false}
            message="Directed"
          />
          <Button
            onClick={function () {
              graphType.current = "undirected";
              refetch();
            }}
            isDisabled={graphType.current === "undirected" ? true : false}
            message="Undirected"
          />
        </div>
      </div>
      <div>
        <div
          className={styles.graph}
          style={{ height: "500px", width: "500px" }}
        >
          {isSuccess ? (
            <Image
              loader={myLoader}
              width="500"
              height="500"
              src={imgLink}
              alt="graph"
            />
          ) : (
            <p> loading graph...</p>
          )}
        </div>
      </div>
    </div>
  );
}
