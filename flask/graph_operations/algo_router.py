import networkx as nx

from algorithms.breadth_first_search import bfs_edges
from algorithms.depth_first_search import dfs_edges
from algorithms.dijkstra import dijkstra_path


# from algorithms.dijkstra import dijkstra_path
# from algorithms.kosaraju_strongly_connected_components import kosaraju_strongly_connected_components


def algo_router(graph, algo, body):
    out_put = None
    match algo:
        case "bfs":
            out_put = list(bfs_edges(graph, body["start"]))
        case "dfs":
            out_put = list(dfs_edges(graph, body["start"]))
        case "dijkstra":
            try:
                path = dijkstra_path(graph, body["start"], body["target"], weight="weight")
                out_put = list(zip(path, path[1:]))
            except nx.NetworkXNoPath:
                # No path to {target} from {start}
                out_put = []
        case "bellmanFord":
            out_put = list(nx.single_source_bellman_ford(graph, body["start"], weight="weight"))

        case "floydWarshall":
            out_put = list(nx.floyd_warshall(graph, weight="weight"))
        #     todo find a way to return the path as a graph
        case "kosaraju":
            out_put = max(nx.kosaraju_strongly_connected_components(graph), key=len)
        case "prime":
            out_put = nx.minimum_spanning_edges(graph)
        case _:
            raise {"status": "error", "message": "Algorithm not supported!"}
    # clearing the original graph to draw another graph
    graph.clear()
    # add weighted edges to the graph
    # the body["edges"] is a list [start, end, weight] and the wight is optional
    # the output is a list of tuples [(start, end)]
    for edge in body["edges"]:
        if tuple(edge[0:2]) in out_put:
            if len(edge) == 2:
                graph.add_edge(edge[0], edge[1])
            else:
                graph.add_weighted_edges_from([edge])
    return graph
