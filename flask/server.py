#!/usr/bin/env python
from random import randint
import uuid
import networkx as nx
from matplotlib import pyplot as plt
import os


from flask import Flask, request, send_file
from flask_cors import CORS
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
        body = request.get_json()
        G = nx.Graph()
        # add a node
        G.add_nodes_from(body['nodes'])
        G.add_edges_from(body['edges'])
        filename = str(uuid.uuid4())
        G.name = filename

        nx.draw(G, with_labels=filename)
        plt.savefig("./graphs/" + filename + ".png")
        return {
            "status": "success",
            "message": "Graph created successfully",
            "graphId": filename,
            "graphUrl": "http://localhost:9091/api/graph?graphId=" + filename

        }


cors = CORS(app, resources={"/api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get(
        "FLASK_SERVER_PORT", 9090), debug=True)
