
def createDirectedGraph(nodes, edges):
    # Create a graph
    G = nx.DiGraph()
    # add a node
    G.add_nodes_from(nodes)
    G.add_edges_from(edges)
    return G
