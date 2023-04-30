#!/usr/bin/env python
import shutil
import uuid
from matplotlib import pyplot as plt
import os
import networkx as nx

from flask import Flask, after_this_request, request, send_file

# from flask_cors import CORS

from draw.createGraph import create_undirected_graph, create_directed_graph
from algorithms.breadth_first_search import bfs_edges
from algorithms.depth_first_search import dfs_edges

app = Flask(__name__)
shutil.rmtree("./graphs")
os.mkdir("./graphs")


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    return response


@app.route("/api/graph")
def get_graph_image():
    filePath = request.args.get("graphId") + ".png"

    @after_this_request
    def remove_file(response):
        os.remove("./graphs/" + filePath)
        # print("called")
        return response

    return send_file("./graphs/" + filePath, mimetype="image/png")


@app.route("/api/graph", methods=["POST"])
def create_graph():
    content_type = request.headers.get("Content-Type")
    if content_type != "application/json":
        return "Content-Type not supported!"
    else:

        body = request.get_json()
        graphType = request.args.get("graphType")
        if graphType == "undirected":
            G = create_undirected_graph(body["nodes"], body["edges"])
        elif graphType == "directed":
            G = create_directed_graph(body["nodes"], body["edges"])
        else:
            return {"status": "error", "message": "Graph type not supported!"}
        # check for the algo
        algo = request.args.get("algo")
        if algo == "bfs":
            bfsOutput = list(bfs_edges(G, body["start"]))
            G.clear()
            G.add_edges_from(bfsOutput)
        elif algo == "dfs":
            dfsOutput = list(dfs_edges(G, body["start"]))
            G.clear()
            G.add_edges_from(dfsOutput)
        elif algo == "dijkstra":
            # todo
            dfsOutput = list(nx.dijkstra_path(G, body["start"], body["end"]))
            G.add_edges_from(dfsOutput)
            G.clear()
        elif algo == "bellman-ford":
            # try:
            dfsOutput = list(nx.bellman_ford_path(G, body["start"], body["end"]))
            G.add_edges_from(dfsOutput)
            G.clear()

        filename = str(uuid.uuid4())

        fig, ax = plt.subplots()
        # ax.hist(filename)
        # ax.set_title("Graph")
        nx.draw(
            G,
            with_labels=True,
            node_size=500,
            node_color="#e67e22",
            edge_color="#d35400",
            font_color="white",
            font_weight="bold",
            arrowsize=25,
            font_size=15,
            # pos=nx.spring_layout(G)
        )
        fig.savefig("./graphs/" + filename + ".png")
        plt.close(fig)

        return {
            "status": "success",
            "graphId": filename,
            "graphUrl": "http://localhost:9091/api/graph?graphId=" + filename,
        }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("FLASK_SERVER_PORT", 9091), debug=True)
