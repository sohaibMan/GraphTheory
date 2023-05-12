import networkx as nx
from algorithms.breadth_first_search import bfs_edges
from algorithms.depth_first_search import dfs_edges
# from algorithms.dijkstra import dijkstra_path
# from algorithms.kosaraju_strongly_connected_components import kosaraju_strongly_connected_components


def algo_router(graph, algo, body):
    print(graph, algo, body)
    match algo:
        case "bfs":
            out_put = list(bfs_edges(graph, body["start"]))
            print("bfs", out_put, body["start"])
        case "dfs":
            out_put = list(dfs_edges(graph, body["start"]))
            # print("dfs", out_put, body["start"])
        # case "dijkstra":
            # out_put = list(dijkstra_path(graph, body["start"], body["end"]))
        # case "bellman-ford":
            # out_put = list(nx.bellman_ford_path(graph, body["start"], body["end"]))
        # case "kosaraju":
            # out_put = max(kosaraju_strongly_connected_components(graph), key=len)
        # case "prime":
        # out_put = nx.minimum_spanning_edges(graph)
        case _:
            raise {"status": "error", "message": "Algorithm not supported!"}
    # clearing the original graph to draw another graph
    graph.clear()
    graph.add_edges_from(out_put)
