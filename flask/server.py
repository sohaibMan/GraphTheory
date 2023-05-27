#!/usr/bin/env python

# system imports
import shutil
import uuid
import os

import networkx as nx
# graph helper imports
from matplotlib import pyplot as plt
# rest api imports
from flask import Flask, after_this_request, request, send_file

from graph_operations.algo_router import algo_router
# import helper functions
from graph_operations.create_graph import create_undirected_graph, create_directed_graph, create_path_graph
from graph_operations.draw_graph import draw_graph

# the flask app should start with an empty temp directory called tmp_output
app = Flask(__name__)
shutil.rmtree("tmp_output")
os.mkdir("tmp_output")


@app.after_request  # allow CORS for my React app
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST")
    return response


@app.route("/api/graph")  # get the graph image from the server and send it to the client(read from the file system)
def get_graph_image():
    # extract the graph id from the query string
    filePath = request.args.get("graphId") + ".png"

    # remove the file from the file system after sending it to the client
    @after_this_request
    def remove_file(response):
        os.remove("./tmp_output/" + filePath)
        return response

    # send the file to the client as an image of type png
    return send_file("./tmp_output/" + filePath, mimetype="image/png")


@app.route("/api/graph", methods=["POST"])
def create_graph():
    # check for the content type(should be json)
    content_type = request.headers.get("Content-Type")
    if content_type != "application/json":
        return "Content-Type not supported!"

    # extract the request body
    body = request.get_json()
    print(body)
    # extract the graph type from the query string
    graphType = request.args.get("graphType")
    algo = request.args.get("algo")
    # check for the graph type (directed or undirected)
    if algo == "dijkstra":
        G = create_path_graph(body["nodes"], body["edges"])
    elif graphType == "undirected":
        G = create_undirected_graph(body["nodes"], body["edges"])
    elif graphType == "directed":
        G = create_directed_graph(body["nodes"], body["edges"])
    else:
        return {"status": "error", "message": "Graph type not supported!"}

    # check for the algorithm

    if algo:  # if the algo is present in the query string
        # try:
        algo_router(G, algo, body)  # raise an exception on a bad input otherwise it will handle the algo
        # except Exception as e:
        #     return {"status": "error", "message": str(e)}

    # generate a unique filename to save the graph
    filename = str(uuid.uuid4())
    # create a plt figure
    fig = draw_graph(G, filename)
    # close the figure
    plt.close(fig)
    # return the response
    return {
        "status": "success",
        "graphId": filename,
        "graphUrl": "http://localhost:5000/api/graph?graphId=" + filename,
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("FLASK_SERVER_PORT", 9091), debug=True)
