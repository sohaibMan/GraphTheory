import networkx as nx
from matplotlib import pyplot as plt


def draw_graph(graph, filename):
    fig, ax = plt.subplots()
    # graph_operations the graph
    nx.draw(
        graph,
        with_labels=True,
        node_size=500,
        node_color="#e67e22",
        edge_color="#d35400",
        font_color="white",
        font_weight="bold",
        arrowsize=20,
        font_size=15,

    )
    fig.set_facecolor("#f8f9fa")
    # save the graph
    plt.savefig("./tmp_output/" + filename + ".png")
    return fig
