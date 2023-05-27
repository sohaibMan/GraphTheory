export enum SupportedAlgo {
    bfs = "bfs",
    dfs = "dfs",
    prime = "prime",
    kosaraju = "kosaraju",
    dijkstra = "dijkstra",
    bellmanFord = "bellmanFord",
}

export interface GraphState {
    nodes: Set<string>;
    edges: Set<[string, string, number?]>;
    graphType: string;
    algo: SupportedAlgo | null;
}