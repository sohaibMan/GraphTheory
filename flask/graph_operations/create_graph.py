from matplotlib import pyplot as plt
import networkx as nx


def create_undirected_graph(nodes, edges):
    # Create a graph
    G = nx.Graph()
    # add a node
    G.add_nodes_from(nodes)
    G = add_weighted_to_edges_if_exists(G, edges)
    print(G.nodes)
    return G


def create_directed_graph(nodes, edges):
    # Create a graph
    G = nx.DiGraph()
    # add a node
    G.add_nodes_from(nodes)
    G = add_weighted_to_edges_if_exists(G, edges)
    return G


def add_weighted_to_edges_if_exists(G, edges):
    for edge in edges:
        if len(edge) == 2:
            G.add_edge(edge[0], edge[1])
        else:
            G.add_edge(edge[0], edge[1], weight=edge[2])

    return G
