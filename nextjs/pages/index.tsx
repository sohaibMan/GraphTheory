import styles from "../styles/Home.module.css";
import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import Button from "./components/Button";
import Input from "./components/Input";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import CircularIndeterminate from "@/pages/components/CircularIndeterminate";

const defaultGraphValues = {
  nodes: new Set<String>(["1", "2", "3", "4", "5"]),
  edges: new Set<[String, String, String?]>([
    ["1", "2"],
    ["1", "3"],
    ["2", "4"],
    ["2", "5"],
  ]),
  graphType: "directed",
  algo: "bfs",
  InputNodes: "2",
};

export default function Home(this: any) {
  const [graphState, setGraphState] = useState(() => defaultGraphValues);

  let myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    nodes: Array.from(graphState.nodes),
    edges: Array.from(graphState.edges),
  });

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
  } = useQuery({
    queryKey: ["graph"],
    queryFn: () =>
      fetch(
        `http://${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}/api/graph?graphType=${graphState.graphType}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result: { graphUrl: string }) => result.graphUrl),
  });

  let rawAlgo = JSON.stringify({
    nodes: Array.from(graphState.nodes),
    edges: Array.from(graphState.edges),
    start: graphState.InputNodes,
  });

  let requestOptionsAlgo: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: rawAlgo,
    redirect: "follow",
  };

  const {
    data: AlgoResultImageLink,
    isSuccess: isFetchImageAlgoSuccess,
    refetch: refetchAlgoImageLink,
    isLoading: isAlgoImageLoading,
  } = useQuery(
    ["algoResult", graphState.algo, graphState.InputNodes],
    () =>
      fetch(
        `http://${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}/api/graph?graphType=${graphState.graphType}&algo=${graphState.algo}`,
        requestOptionsAlgo
      )
        .then((response) => response.json())
        .then((result: { graphUrl: string }) => result.graphUrl),
    { enabled: isSuccess }
  );

  if (error) return <p>an error has occurred</p>;
  const changeHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const lines = input.split("\n");
    const nodes = new Set<String>();
    const edges = new Set<[String, String, String?]>();
    lines.forEach((line) => {
      line.split(" ")[0] && nodes.add(line.split(" ")[0]);
      if (line.split(" ")[1]) {
        line.split(" ")[2]
          ? edges.add([
              line.split(" ")[0],
              line.split(" ")[1],
              line.split(" ")[2],
            ])
          : edges.add([line.split(" ")[0], line.split(" ")[1]]);
      }
    });

    // edges.current = NewEdges;
    setGraphState((prevState) => {
      prevState.nodes = nodes;
      prevState.edges = edges;
      return prevState;
    });
    // NewEdges;

    await refetch();
  };
  const submitHandler = async (InputNodes: string, inputAlgo: string) => {
    // console.log(Nodes)

    setGraphState((prevState) => {
      prevState.algo = inputAlgo;
      prevState.InputNodes = InputNodes;
      return prevState;
    });

    await refetchAlgoImageLink();
    // await refetchAlgoImageLink();
  };
  return (
    <div className={styles.container}>
      <div className={styles.graphController}>
        <TextareaAutosize
          onChange={changeHandler}
          aria-label="empty textarea"
          placeholder={"node->edge->weight\n1 2\n1 3\n2 4\n2 5"}
          style={{
            width: "450px",
            margin: "auto",
            height: 100,
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa",
            borderRadius: "5px",
          }}
        />
        <div className={styles.controlButtons}>
          <Button
            onClick={async function () {
              setGraphState((prevState) => {
                prevState.graphType = "directed";
                return prevState;
              });
              await refetch();
            }}
            isDisabled={graphState.graphType === "directed"}
            message="Directed"
          />
          <Button
            onClick={async function () {
              setGraphState((prevState) => {
                prevState.graphType = "undirected";
                return prevState;
              });
              await refetch();
            }}
            isDisabled={graphState.graphType === "undirected"}
            message="Undirected"
          />
          <Button
            onClick={async function () {
              await refetch();
            }}
            isDisabled={false}
            message="Redraw"
          />
        </div>
        <div className={styles.controlButtons}>
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "bfs")}
            message="BFS"
            placeHolder="start"
            regex="^\d+$|^[a-zA-Z]+$"
          />
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "dfs")}
            message="DFS"
            placeHolder="start"
            regex="^\d+$|^[a-zA-Z]+$"
          />
        </div>
        <div className={styles.controlButtons}>
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "dijkstra")}
            message="dijkstra"
            placeHolder="start,target"
            regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
          />
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "bellman ford")}
            message="bellman-ford"
            placeHolder="start:target"
            regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
          />
        </div>
        <div className={styles.controlButtons}>
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "kosaraju")}
            message="kosaraju"
            placeHolder="start:target"
            regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
          />
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) => submitHandler(InputNodes, "prime")}
            message="prime"
            placeHolder="start:target"
            regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
          />
        </div>
      </div>
      <div className={styles.graphContainer}>
        <div className={styles.graph}>
          {isSuccess ? (
            <img src={imgLink} alt="graph" />
          ) : (
            // <h1>hello</h1>
            // <></>

            <CircularIndeterminate />
          )}
        </div>
        <div className={styles.graph}>
          {isFetchImageAlgoSuccess ? (
            <img src={AlgoResultImageLink} alt="graph" />
          ) : (
            // <></>
            <CircularIndeterminate />
          )}
          {/*</div>*/}
        </div>
        {/*</div>*/}
      </div>
    </div>
  );
}
