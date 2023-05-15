import styles from "../styles/Home.module.css";
import * as React from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import Button from "@/components/Button";
import Input from "@/components/Input";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import CircularIndeterminate from "@/components/CircularIndeterminate";

// @ts-ignore
export enum SupportedAlgo {
  bfs = "bfs",
  dfs = "dfs",
  prime = "prime",
  kosaraju = "kosaraju",
  dijkstra = "dijkstra",
  bellmanFord = "bellmanFord",
}

export interface GraphState {
  nodes: Set<Number>;
  edges: Set<[Number, Number, Number?]>;
  graphType: string;
  algo: SupportedAlgo;
  start: Number;
  target: Number;
}
const defaultGraphValues: GraphState = {
  nodes: new Set<Number>([1, 2, 3, 4, 5]),
  edges: new Set<[Number, Number, Number?]>([
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
  ]),
  graphType: "directed",
  algo: SupportedAlgo.bfs,
  // InputNodes: "2",
  start: 2,
  target: 1,
};

function isWeighted(edges: Set<[Number, Number, Number?]>): boolean {
  let result = true;
  edges.forEach((edge) => {
    if (edge.length === 2) result = false;
    return;
  });

  return result;
}

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
    start: graphState.start,
    target: graphState.target,
    // start: +graphState.InputNodes.split(",")[0],
    // target: +graphState.InputNodes.split(",")[1],
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
    ["algoResult", graphState.algo, graphState.start, graphState.target],
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
    const nodes = new Set<Number>();
    const edges = new Set<[Number, Number, Number?]>();
    lines.forEach((line) => {
      line.split(" ")[0] && nodes.add(+line.split(" ")[0]);
      line.split(" ")[1] && nodes.add(+line.split(" ")[1]);
      if (line.split(" ")[1]) {
        line.split(" ")[2]
          ? edges.add([
              +line.split(" ")[0],
              +line.split(" ")[1],
              +line.split(" ")[2],
            ])
          : edges.add([+line.split(" ")[0], +line.split(" ")[1]]);
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
    await refetchAlgoImageLink();
  };
  const submitHandler = async (
    inputNodes: string,
    inputAlgo: SupportedAlgo
  ) => {
    // console.log(Nodes)
    // graph traversal to a node who doesn't exist
    if (
      (inputAlgo === SupportedAlgo.bfs ||
        inputAlgo === SupportedAlgo.dfs ||
        inputAlgo === SupportedAlgo.bellmanFord) &&
      !graphState.nodes.has(+inputNodes.split(",")[0])
    ) {
      alert(inputNodes + " doesn't exist in the nodes list");
      return;
    }

    // alert(inputNodes);

    if (inputAlgo === SupportedAlgo.dijkstra && !isWeighted(graphState.edges)) {
      alert("To determine the shortest path your graph should be weighted");
      return;
    }
    if (inputAlgo === SupportedAlgo.dijkstra) {
      inputNodes.split(",").forEach((node) => {
        if (!graphState.nodes.has(+node)) {
          alert(node + " doesn't exist in the nodes list");
          return;
        }
      });
    }
    // console.log(inputAlgo);

    // MST can't be in a no weighted graph
    // if (
    //   (inputAlgo === SupportedAlgo.prime ||
    //     inputAlgo === SupportedAlgo.kosaraju) &&
    //   !isWeighted(graphState.edges)
    // ) {
    //   alert("the graph type should be weighted to run " + inputAlgo);
    //   return;
    // }

    setGraphState((prevState) => {
      prevState.algo = inputAlgo;
      // prevState.InputNodes = inputNodes;
      prevState.start = +inputNodes.split(",")[0];
      prevState.target = +inputNodes.split(",")[1];
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
              await refetchAlgoImageLink();
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
              await refetchAlgoImageLink();
            }}
            isDisabled={graphState.graphType === "undirected"}
            message="Undirected"
          />

          <Button
            onClick={async function () {
              await submitHandler("", SupportedAlgo.kosaraju);
            }}
            isDisabled={false}
            message="kosaraju"
          />
          <Button
            onClick={async function () {
              await submitHandler("", SupportedAlgo.prime);
            }}
            isDisabled={false}
            message="prime"
          />

          <Button
            onClick={async function () {
              await refetch();
              await refetchAlgoImageLink();
            }}
            isDisabled={false}
            message="Redraw"
          />
        </div>
        <div className={styles.controlButtons}>
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) =>
              submitHandler(InputNodes, SupportedAlgo.bfs)
            }
            message="BFS"
            placeHolder="start"
            regex="^\d+$"
          />
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) =>
              submitHandler(InputNodes, SupportedAlgo.dfs)
            }
            message="DFS"
            placeHolder="start"
            regex="^\d+$"
          />
        </div>
        <div className={styles.controlButtons}>
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) =>
              submitHandler(InputNodes, SupportedAlgo.dijkstra)
            }
            message="dijkstra"
            placeHolder="start,target"
            regex="^([a-zA-Z]|\d+$),[a-zA-Z]|\d+$)"
          />
          <Input
            disabled={isAlgoImageLoading}
            onSubmit={(InputNodes) =>
              submitHandler(InputNodes, SupportedAlgo.bellmanFord)
            }
            message="bellman-ford"
            placeHolder="source"
            regex="^\d+$"
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
