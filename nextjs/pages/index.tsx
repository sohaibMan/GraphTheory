import styles from "../styles/Home.module.css";
import * as React from "react";
import {useState} from "react";
import {useMutation, useQuery} from "react-query";
import Button from "@/components/Button";
import Input from "@/components/Input";
import CircularIndeterminate from "@/components/CircularIndeterminate";
import Image from "next/image";
import {SupportedAlgo} from "@/types/graphTypes";
import {defaultGraphValues, isWeighted, makeAlgoRequestOptions, makeRequestOptions} from "@/helpers/helpers";
import {TextArea} from "@/components/textArea";


export default function Home() {

    // to store the graph state
    const [graphState, setGraphState] = useState(() => defaultGraphValues);

    // to fetch the image of the graph
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
                    makeRequestOptions(graphState.nodes, graphState.edges)
                )
                    .then((response) => response.json())
                    .then((result: { graphUrl: string }) => result.graphUrl),
        }
    )

    // to fetch the image of the graph with the algo result
    const {
        data: AlgoResultImageLink,
        isSuccess: isFetchImageAlgoSuccess,
        mutateAsync: refetchAlgoImageLink,
        isLoading: isAlgoImageLoading
    } = useMutation(
        ["algoResult"],
        {
            mutationFn: (variables: { graphType: string, algo: SupportedAlgo, start: string, target?: string }) =>
                fetch(
                    `http://${process.env.NEXT_PUBLIC_HOSTNAME}:${process.env.NEXT_PUBLIC_PORT}/api/graph?graphType=${variables.graphType}&algo=${variables.algo}`,
                    makeAlgoRequestOptions(variables.start, graphState.nodes, graphState.edges, variables.target)
                )
                    .then((response) => response.json())
                    .then((result: { graphUrl: string }) => result.graphUrl),

        }
    );

    if (error) return <p>an error has occurred</p>;

    // this code is responsible for the graph image (draw per user input change)
    const changeHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        const lines = input.split("\n");
        const nodes = new Set<string>();
        const edges = new Set<[string, string, number?]>();
        // this code does the following things
        // split the input to lines
        //each line is in this format Node Edge Weight (weight is optional)
        lines.forEach((line) => {
            line.split(" ")[0] && nodes.add(line.split(" ")[0]);
            line.split(" ")[1] && nodes.add(line.split(" ")[1]);
            if (line.split(" ")[1]) {
                line.split(" ")[2]
                    ? edges.add([
                        line.split(" ")[0],
                        line.split(" ")[1],
                        +line.split(" ")[2],
                    ])
                    : edges.add([line.split(" ")[0], line.split(" ")[1]]);
            }
        });

        //mutate the graph state
        setGraphState((prevState) => {
            prevState.nodes = nodes;
            prevState.edges = edges;
            return prevState;
        });
        // re draw the graph
        await refetch();
    };

    // this code is responsible for the algo result image (draw per user button click)
    const submitHandler = async (
        inputNodes: string,
        algo: SupportedAlgo
    ) => {
        // graph traversal to a node who doesn't exist
        if (
            (algo === SupportedAlgo.bfs ||
                algo === SupportedAlgo.dfs ||
                algo === SupportedAlgo.bellmanFord) &&
            !graphState.nodes.has(inputNodes.split(",")[0])
        ) {
            alert(inputNodes + " doesn't exist in the nodes list");
            return;
        }


        if (algo === SupportedAlgo.dijkstra && !isWeighted(graphState.edges)) {
            alert("To determine the shortest path your graph should be weighted");
            return;
        }
        if (algo === SupportedAlgo.dijkstra) {
            let nodeExists = true;
            inputNodes.split(",").forEach((node) => {
                if (!graphState.nodes.has(node)) {
                    nodeExists = false;
                    alert(node + " doesn't exist in the nodes list");
                }
            });

            if (!nodeExists) return;
        }

        // MST can't be in a no weighted graph or directed
        if (
            algo === SupportedAlgo.prime &&
            (graphState.graphType === "directed" ||
                !isWeighted(graphState.edges))
        ) {
            alert("the graph  should be undirected and weighted to run " + algo);
            return;
        }

        if (
            algo === SupportedAlgo.bellmanFord &&
            !isWeighted(graphState.edges)
        ) {
            alert("the graph  should be  weighted to run " + algo);
            return;
        }


        setGraphState((prevState) => {
            prevState.algo = algo;
            // prevState.InputNodes = inputNodes;

            return prevState;
        });
        const start = inputNodes.split(",")[0];
        const target = inputNodes.split(",")[1];

        await refetchAlgoImageLink({
            graphType: graphState.graphType,
            algo,
            start,
            target
        });

    };


    return (
        <div className={styles.container}>
            <div>
                <TextArea onChange={changeHandler}/>
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
                            // await refetchAlgoImageLink();
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
                        regex="[A-Za-z0-9]+"
                    />
                    <Input
                        disabled={isAlgoImageLoading}
                        onSubmit={(InputNodes) =>
                            submitHandler(InputNodes, SupportedAlgo.dfs)
                        }
                        message="DFS"
                        placeHolder="start"
                        regex="[A-Za-z0-9]+"
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
                        regex="^([a-zA-Z0-9]+(?:,[a-zA-Z0-9]+)+)$"
                    />
                    <Input
                        disabled={isAlgoImageLoading}
                        onSubmit={(InputNodes) =>
                            submitHandler(InputNodes, SupportedAlgo.bellmanFord)
                        }
                        message="bellman-ford"
                        placeHolder="source"
                        regex="^[A-Za-z0-9]+"
                    />
                </div>
            </div>
            <div className={styles.graphContainer}>
                <div className={styles.graph}>
                    {isSuccess ? (
                        <Image width={480} height={500} src={imgLink} alt="graph"/>
                    ) : (
                        <CircularIndeterminate/>
                    )}
                </div>
                <div className={styles.graph}>
                    {!isAlgoImageLoading && isFetchImageAlgoSuccess &&
                        <Image width={480} height={500} src={AlgoResultImageLink} alt="graph"/>}
                </div>

            </div>
        </div>
    );
}
