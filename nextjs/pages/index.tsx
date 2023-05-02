import styles from "../styles/Home.module.css";
import * as React from "react";
import {useRef} from "react";
import Image from "next/image";

import {useQuery} from "react-query";
import Button from "./components/Button";
import Input from "./components/Input";
import TextareaAutosize from "@mui/base/TextareaAutosize";

export default function Home(this: any) {
    let nodes = useRef(new Set<String>());
    let edges = useRef(new Set<[String, String, String?]>());
    let graphType = useRef("");
    let algo = useRef("");
    let InputNodes = useRef("");

    // console.log("🚀 ~ file: index.tsx:21 ~ useEffect ~ nodes:", nodes);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(
        nodes.current.size === 0 && edges.current.size === 0
            ? {
                nodes: ["1", "2", "3", "4", "5"],
                edges: [
                    ["1", "2", "3"],
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
        queryKey: "graph", queryFn: () => fetch(
            `http://localhost:9091/api/graph?graphType=${
                graphType.current || "directed"
            }`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result: { graphUrl: string }) => {
                // console.log(result.graphUrl);
                return result.graphUrl;
            }),

    });

    let rawAlgo = JSON.stringify({
        nodes: ["1", "2", "3", "4", "5"],
        edges: [
            ["1", "2"],
            ["1", "3"],
            ["2", "4"],
            ["2", "5"],
        ],
        start: InputNodes.current || "2",
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
        isLoading: isAlgoImageLoading
    } = useQuery("algoResult", {
        queryFn: () =>
            fetch(
                `http://localhost:9091/api/graph?graphType=${
                    graphType.current || "directed"
                }&algo=${algo.current || "bfs"}`,
                requestOptionsAlgo
            )
                .then((response) => response.json())
                .then((result: { graphUrl: string }) => result.graphUrl)
        ,
        enabled: isSuccess
    });


    if (error) return <p>an error has occurred</p>;
    const changeHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        const lines = input.split("\n");
        const NewNodes = new Set<String>();
        const NewEdges = new Set<[String, String, String?]>();
        lines.forEach((line) => {
            line.split(" ")[0] && NewNodes.add(line.split(" ")[0]);
            console.log(line.split(" ")[1]);
            console.log(line.split(" "));
            if (line.split(" ")[1]) {
                line.split(" ")[2]
                    ? NewEdges.add([
                        line.split(" ")[0],
                        line.split(" ")[1],
                        line.split(" ")[2],
                    ])
                    : NewEdges.add([line.split(" ")[0], line.split(" ")[1]]);
            }
        });

        nodes.current = NewNodes;
        edges.current = NewEdges;
        await refetch();
    };
    const submitHandler = async (Nodes: string, inputAlgo: string) => {
        algo.current = inputAlgo;
        InputNodes.current = Nodes;
        await refetchAlgoImageLink();
        console.log("algo", algo.current);
    };
    return (
        <div className={styles.container}>
            <div>

                <p> Add your nodes and edges here:</p>
                <TextareaAutosize
                    onChange={changeHandler}
                    aria-label="empty textarea"
                    placeholder={"1 2\n1 3\n2 4\n2 5"}
                    style={{
                        width: "400px",
                        margin: "auto",
                        height: 100,
                        padding: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                />
                <div className={styles.controlButtons}>
                    <Button
                        onClick={async function () {
                            graphType.current = "directed";
                            await refetch();
                        }}
                        isDisabled={graphType.current === "directed"}
                        message="Directed"
                    />
                    <Button
                        onClick={async function () {
                            graphType.current = "undirected";
                            await refetch();
                        }}
                        isDisabled={graphType.current === "undirected"}
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
                        placeHolder="Enter The  Starting Node"
                        regex="^\d+$|^[a-zA-Z]+$"
                    />
                    <Input
                        disabled={isAlgoImageLoading}
                        onSubmit={(InputNodes) => submitHandler(InputNodes, "dfs")}
                        message="DFS"
                        placeHolder="Enter The  Starting Node"
                        regex="^\d+$|^[a-zA-Z]+$"
                    />
                </div>
                <div className={styles.controlButtons}>
                    <Input
                        disabled={isAlgoImageLoading}
                        onSubmit={
                            (Nodes) =>
                                // submitHandler(InputNodes, "dijkstra")
                                console.log(Nodes.split(","))
                            // todo add submitHandler
                        }
                        message="dijkstra"
                        placeHolder="Enter The  (Starting Node,Target Node)"
                        regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
                    />
                    <Input
                        disabled={isAlgoImageLoading}
                        onSubmit={
                            (Nodes) =>
                                submitHandler(Nodes, "bellman ford")
                            // console.log(Nodes.split(","))
                            // todo add submitHandler
                        }
                        message="bellman-ford"
                        placeHolder="Enter The (Starting Node:Target Node)"
                        regex="^([a-zA-Z]|[0-9]),([a-zA-Z]|[0-9])$"
                    />
                </div>
            </div>
            <div className={styles.graph} style={{height: "550px", width: "640px"}}>
                <p> Input Graph:</p>
                {isSuccess ? (
                    <Image
                        width="640"
                        height="480"
                        src={imgLink}
                        alt="graph"
                    />
                ) : (
                    <div style={{
                        width: "250px",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <p> loading graph...</p>
                    </div>
                )}
            </div>
            <div className={styles.graph} style={{height: "550px", width: "640px"}}>
                <p>
                    {algo.current
                        ? algo.current + " from " + InputNodes.current
                        : "bfs from 2"}
                </p>

                {isFetchImageAlgoSuccess ? (
                    <Image
                        width="640"
                        height="480"
                        src={AlgoResultImageLink}
                        alt="graph"
                    />
                ) : (
                    <div style={{
                        width: "250px",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}><p> loading graph...</p>

                    </div>
                )}

            </div>
        </div>
    );
}
