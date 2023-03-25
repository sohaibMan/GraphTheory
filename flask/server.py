#!/usr/bin/env python
from random import randint
import shutil
import uuid
from matplotlib import pyplot as plt
import os
import networkx as nx


from flask import Flask, request, send_file
from flask_cors import CORS

from createGraph import createUndirectedGraph, createDirectedGraph
app = Flask(__name__)


@app.route('/api/graph')
def getGraphImage():
    filePath = request.args.get("graphId") + ".png"
    # return "./graphs/" + filePath
    return send_file("./graphs/" + filePath, mimetype='image/png')


@app.route('/api/graph', methods=['POST'])
def createGraph():
    content_type = request.headers.get('Content-Type')
    if (content_type != 'application/json'):
        return 'Content-Type not supported!'
    else:
        plt.clf()
        if os.path.exists("./graphs"):
            shutil.rmtree("./graphs")
        os.mkdir("./graphs")
        body = request.get_json()
        graphType = request.args.get("graphType")
        # print(graphType)

        if graphType == "undirected":
            G = createUndirectedGraph(body['nodes'], body['edges'])
        elif graphType == "directed":
            G = createDirectedGraph(body['nodes'], body['edges'])
        else:
            G = nx.Graph()

        filename = str(uuid.uuid4())
        G.name = filename

        nx.draw(G, with_labels=True, node_size=1000, node_color='#e67e22',
                edge_color='#d35400', arrowsize=35, font_size=18)
        plt.savefig("./graphs/" + filename + ".png")
        return {
            "status": "success",
            "message": "Graph created successfully",
            "graphId": filename,
            "graphUrl": "http://localhost:9091/api/graph?graphId=" + filename,
            "nodes": body['nodes'],
            "edges": body['edges']

        }


cors = CORS(app, resources={"/api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get(
        "FLASK_SERVER_PORT", 9090), debug=True)
