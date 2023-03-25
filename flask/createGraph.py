from matplotlib import pyplot as plt
import networkx as nx


def createUndirectedGraph(nodes, edges):
    # Create a graph
    G = nx.Graph()
    # add a node
    G.add_nodes_from(nodes)
    addWeightedToEdgesIfExists(G, edges)
    return G


def createDirectedGraph(nodes, edges):
    # Create a graph
    G = nx.DiGraph()
    # add a node
    G.add_nodes_from(nodes)
    addWeightedToEdgesIfExists(G, edges)
    return G


def addWeightedToEdgesIfExists(G, edges):
    isWeighted = False
    for edge in edges:
        if (len(edge) == 2):
            G.add_edge(edge[0], edge[1])
        else:
            G.add_edge(edge[0], edge[1], weight=edge[2])
            isWeighted = True
    if (isWeighted == True):
        edge_labels = nx.get_edge_attributes(G, "weight")
        pos = nx.spring_layout(G)
        nx.draw_networkx_edge_labels(G, pos, edge_labels)
    return G


# G = nx.DiGraph()
# G.add_edge("a", "b", weight=0.6)
# G.add_edge("a", "c", weight=0.2)
# G.add_edge("c", "d", weight=0.1)
# G.add_edge("c", "e", weight=0.7)
# G.add_edge("c", "f", weight=0.9)
# G.add_edge("a", "d", weight=0.3)
# nx.draw(G, with_labels='filename')
# edge_labels = nx.get_edge_attributes(G, "weight")
# pos = nx.spring_layout(G, seed=7)
# nx.draw_networkx_edge_labels(G, pos, edge_labels)
# plt.savefig("./graphs/" + "filename" + ".png")
