import {GraphState} from "@/types/graphTypes";

export const defaultGraphValues: GraphState = {
    nodes: new Set<string>(["1", "2", "3", "4", "5"]),
    edges: new Set<[string, string, number?]>([
        ["1", "2"],
        ["1", "3"],
        ["2", "4"],
        ["2", "5"],
    ]),
    graphType: "directed",
    algo: null,
};

export function isWeighted(edges: Set<[string, string, number?]>): boolean {
    let result = true;
    edges.forEach((edge) => {
        if (edge.length === 2) result = false;
        return;
    });

    return result;
}

export function makeAlgoRequestOptions(start: string, nodes: Set<string>, edges: Set<[string, string, number?]>, target?: string | undefined) {


    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let rawAlgo = JSON.stringify({
        nodes: Array.from(nodes),
        edges: Array.from(edges),
        start: start,
        target: target,
    });
    return {
        method: "POST",
        headers: headers,
        body: rawAlgo,
        redirect: "follow",
    } as RequestInit;
}

export function makeRequestOptions(nodes: Set<string>, edges: Set<[string, string, number?]>) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        nodes: Array.from(nodes),
        edges: Array.from(edges),
    });

    let requestOptions: RequestInit = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow",
    };

    return requestOptions;
}