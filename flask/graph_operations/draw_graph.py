import networkx as nx
from matplotlib import pyplot as plt


def draw_graph(graph, filename):
    fig, ax = plt.subplots()
    # graph_operations the graph

    pos = nx.spring_layout(graph, seed=7)  # positions for all nodes - seed for reproducibility

    # nodes
    nx.draw_networkx_nodes(graph, pos, node_size=700, node_color="#e67e22")

    # edges
    nx.draw_networkx_edges(graph, pos, width=5)
    nx.draw_networkx_edges(
        graph, pos, width=5, edge_color="#d35400", arrowsize=15
    )

    # node labels
    nx.draw_networkx_labels(graph, pos, font_size=20, font_family="sans-serif", font_color="white", font_weight="bold")
    # edge weight labels
    edge_labels = nx.get_edge_attributes(graph, "weight")
    nx.draw_networkx_edge_labels(graph, pos, edge_labels)

    ax = plt.gca()
    ax.margins(0.1)
    plt.axis("off")
    plt.tight_layout()

    # save the graph
    fig.set_facecolor("#f8f9fa")
    plt.savefig("./tmp_output/" + filename + ".png")
    # clear the graph
    graph.clear()

    return fig
