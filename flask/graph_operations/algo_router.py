import networkx as nx


def algo_router(graph, algo, body):
    if body["algorithm"] == "bfs":
        out_put = list(nx.bfs_edges(graph, body["start"]))
    elif body["algorithm"] == "dfs":
        out_put = list(nx.dfs_edges(graph, body["start"]))
    elif body["algorithm"] == "dijkstra":
        try:
            path = nx.dijkstra_path(graph, body["start"], body["target"], weight="weight")
            out_put = list(zip(path, path[1:]))
        except nx.NetworkXNoPath:
            # No path to {target} from {start}
            out_put = []
    elif body["algorithm"] == "bellmanFord":
        _, path = nx.single_source_bellman_ford(graph, body["start"], weight="weight")
        edges = set()
        for p in path:
            if len(path[p]) > 1:
                for i in range(len(path[p]) - 1):
                    edge = (path[p][i], path[p][i + 1])
                    edges.add(edge)
        graph_copy = graph.copy()
        graph.clear()
        for edge in edges:
            graph.add_edge(edge[0], edge[1], weight=graph_copy[edge[0]][edge[1]]["weight"])
        return graph
    elif body["algorithm"] == "floydWarshall":
        out_put = list(nx.floyd_warshall(graph, weight="weight"))
    elif body["algorithm"] == "kosaraju":
        out_put = list(nx.kosaraju_strongly_connected_components(graph))
        graph.clear()

        # Add edges between the nodes in the SCC
        for scc in out_put:
            print(scc)
            for i in range(len(scc) - 1):
                graph.add_edge(list(scc)[i], list(scc)[i + 1])
            graph.add_edge(list(scc)[-1], list(scc)[0])

        return graph
    elif body["algorithm"] == "prime":
        # Perform Prim's algorithm on the graph
        mst_edges = nx.minimum_spanning_edges(graph, algorithm='prim', data=False)
        mst_edges_list = list(mst_edges)

        # Create a new graph for the minimum spanning tree
        mst_graph = nx.Graph()

        # Add the nodes to the minimum spanning tree graph
        mst_graph.add_nodes_from(graph.nodes())

        tmp_graph = graph.copy()
        graph.clear()
        # Add the edges to the minimum spanning tree graph based on the selected edges
        for edge in mst_edges_list:
            node1, node2 = edge
            weight = tmp_graph[node1][node2]['weight']
            graph.add_edge(node1, node2, weight=weight)

        # copy the graph to the original graph
        graph.add_nodes_from(mst_graph.nodes())
        graph.add_edges_from(mst_graph.edges())

        return graph
    else:
        raise {"status": "error", "message": "Algorithm not supported!"}

    # Clear the original graph to draw another graph
    graph.clear()

    # Add weighted edges to the graph
    # The body["edges"] is a list [start, end, weight], and the weight is optional
    # The output is a list of tuples [(start, end)]
    for edge in body["edges"]:
        if tuple(edge[0:2]) in out_put:
            if len(edge) == 2:
                graph.add_edge(edge[0], edge[1])
            else:
                graph.add_weighted_edges_from([edge])

    return graph
