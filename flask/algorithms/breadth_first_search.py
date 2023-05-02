"""Basic algorithms for breadth-first searching the nodes of a graph."""
from collections import deque


def generic_bfs_edges(graph, source, neighbors=None, depth_limit=None, sort_neighbors=None):

    if callable(sort_neighbors):
        _neighbors = neighbors
        def neighbors(node): return iter(sort_neighbors(_neighbors(node)))

    visited = {source}
    if depth_limit is None:
        depth_limit = len(graph)
    queue = deque([(source, depth_limit, neighbors(source))])
    while queue:
        parent, depth_now, children = queue[0]
        try:
            child = next(children)
            if child not in visited:
                yield parent, child
                visited.add(child)
                if depth_now > 1:
                    queue.append((child, depth_now - 1, neighbors(child)))
        except StopIteration:
            queue.popleft()


def bfs_edges(graph, source, reverse=False, depth_limit=None, sort_neighbors=None):
    if reverse and graph.is_directed():
        successors = graph.predecessors
    else:
        successors = graph.neighbors
    yield from generic_bfs_edges(graph, source, successors, depth_limit, sort_neighbors)
