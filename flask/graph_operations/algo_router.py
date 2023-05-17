import networkx as nx

from algorithms.breadth_first_search import bfs_edges
from algorithms.depth_first_search import dfs_edges
from algorithms.dijkstra import dijkstra_path


# from algorithms.dijkstra import dijkstra_path
# from algorithms.kosaraju_strongly_connected_components import kosaraju_strongly_connected_components


def algo_router(graph, algo, body):
    print(algo)
    out_put = None
    match algo:
        case "bfs":
            out_put = list(bfs_edges(graph, body["start"]))
        case "dfs":
            out_put = list(dfs_edges(graph, body["start"]))
        case "dijkstra":
            path = dijkstra_path(graph, body["start"], body["target"], weight="weight")
            out_put = list(zip(path, path[1:]))
        case "bellmanFord":
            out_put = list(nx.single_source_bellman_ford(graph, body["start"], weight="weight"))

        case "floydWarshall":
            out_put = list(nx.floyd_warshall(graph, weight="weight"))
        #     todo find a way to return the path as a graph
        case "kosaraju":
            out_put = max(nx.kosaraju_strongly_connected_components(graph), key=len)
        case "prime":
            out_put = nx.minimum_spanning_edges(graph)
        # case _:
        #     raise {"status": "error", "message": "Algorithm not supported!"}
    # clearing the original graph to draw another graph
    graph.clear()
    graph.add_edges_from(out_put)
    return graph
