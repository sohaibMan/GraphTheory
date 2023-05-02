"""Basic algorithms for depth-first searching the nodes of a graph."""


def dfs_edges(graphs, source=None, depth_limit=None):
    visited = set()
    if depth_limit is None:
        depth_limit = len(graphs)
    for start in [source]:
        if start in visited:
            continue
        visited.add(start)
        stack = [(start, depth_limit, iter(graphs[start]))]
        while stack:
            parent, depth_now, children = stack[-1]
            try:
                child = next(children)
                if child not in visited:
                    yield parent, child
                    visited.add(child)
                    if depth_now > 1:
                        stack.append((child, depth_now - 1, iter(graphs[child])))
            except StopIteration:
                stack.pop()
