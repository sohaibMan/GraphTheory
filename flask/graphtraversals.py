from queue import Queue


def traverseBFS(G, start):
    # adj_list = G.adjacency()
    # q = Queue()
    # out_list = []
    # visited = {}
    # for key in adj_list.keys():
    # visited[key] = False
    # return BFS(start,)
    # print(start)
    # return 1
    return G.BFS(start)


# def BFS(u):
#     q.put(u)
#     while not q.empty():
#         v = q.get()
#         out_list.append(v)
#         for n in adj_list[v]:
#             if not visited[n]:
#                 visited[n] = True
#                 q.put(n)
