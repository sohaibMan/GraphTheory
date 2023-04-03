#!/usr/bin/env python
import logging
from random import randint
import shutil
import uuid
from matplotlib import pyplot as plt
import os
import networkx as nx


from flask import Flask, after_this_request, request, send_file
# from flask_cors import CORS

from createGraph import createUndirectedGraph, createDirectedGraph
from algorithms.breadth_first_search import bfs_edges
from algorithms.depth_first_search import dfs_edges
app = Flask(__name__)
shutil.rmtree("./graphs")
os.mkdir("./graphs")

# CORS(app, resources={"/api/*": {"origins": "http://localhost:3000/"}})
# # todo remove elements from graph folder aft
# if len([entry for entry in os.listdir("./graphs") if os.path.isfile(os.path.join("./graphs", entry))]) > 4:
#     shutil.rmtree("./graphs")
#     os.mkdir("./graphs")


@app.after_request
def after_request(response):
    # shutil.rmtree("./graphs")
    # os.mkdir("./graphs")
    # os.remove("./graphs/" + str(request.args.get("graphId") + ".png"))
    # if (request.method == "GET"):
    # print(request.args.get("graphId"))
    # os.remove("./graphs/" + request.args.get("graphId") + ".png")
    # print("./graphs/" + request.args.get("graphId") + ".png")
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


# logging.getLogger('flask_cors').level = logging.DEBUG


@app.route('/api/graph')
def getGraphImage():
    filePath = request.args.get("graphId") + ".png"
    # return "./graphs/" + filePath

    @after_this_request
    def remove_file(response):
        os.remove("./graphs/" + filePath)
        # print("called")
        return response

    return send_file("./graphs/" + filePath, mimetype='image/png')


@app.route('/api/graph', methods=['POST'])
def createGraph():

    content_type = request.headers.get('Content-Type')
    if (content_type != 'application/json'):
        return 'Content-Type not supported!'
    else:
        plt.clf()
        # try:
        # plt.axis('off')
        # except:
        #     pass
        # if not os.path.exists("./graphs"):
        #     os.mkdir("./graphs")
        # if os.path.exists("./graphs") and len([entry for entry in os.listdir("./graphs") if os.path.isfile(os.path.join("./graphs", entry))]) > 4:
        #     shutil.rmtree("./graphs")
        # os.mkdir("./graphs")
        # os.rmdir("./graphs")
        # elif not os.path.exists("./graphs"):
        body = request.get_json()
        graphType = request.args.get("graphType")
        # print(graphType)

        if graphType == "undirected":
            G = createUndirectedGraph(body['nodes'], body['edges'])
        elif graphType == "directed":
            G = createDirectedGraph(body['nodes'], body['edges'])
        else:
            return {
                "status": "error",
                "message": "Graph type not supported!"
            }

        algo = request.args.get("algo")
        if algo == "bfs":
            bfsOutput = list(bfs_edges(G, body["start"]))
            G.clear()
            G.add_edges_from(bfsOutput)
        elif algo == "dfs":
            dfsOutput = list(dfs_edges(G, body["start"]))
            G.clear()
            G.add_edges_from(dfsOutput)

        filename = str(uuid.uuid4())
        G.name = filename
        # hold(False)
        nx.draw(G, with_labels=True, node_size=1000, node_color='#e67e22',
                edge_color='#d35400', arrowsize=35, font_size=18)
        # G.clear()
        plt.savefig("./graphs/" + filename + ".png")

        return {
            "status": "success",
            "graphId": filename,
            "graphUrl": "http://localhost:9091/api/graph?graphId=" + filename,
        }
    # except:
    #     return {
    #         "status": "error",
    #         "message": "Something went wrong!"
    #     }


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get(
        "FLASK_SERVER_PORT", 9090), debug=True)
