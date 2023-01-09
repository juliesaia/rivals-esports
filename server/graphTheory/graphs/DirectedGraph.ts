import { Edge, Node, Path } from "../elements/AllElements";

export class DirectedGraph {
    edges: Edge[];

    constructor(edges?: Edge[]) {
        this.edges = edges ?? [];
    }

    getNodes(): Node[] {
        const toReturn: Node[] = [];

        for (let i = 0; i < this.edges.length; i++) {
            toReturn.push(this.edges[i].node1);
            if (i === this.edges.length - 1) {
                toReturn.push(this.edges[i].node2);
            }
        }

        return toReturn;
    }

    findNode(key: any): Node | null {
        const allNodes = this.getNodes();

        for (const node of allNodes) {
            if (node.key === key) {
                return node;
            }
        }

        return null;
    }

    getNeighbors(nodeKey: any): Edge[] {
        const relevantEdges = this.edges.filter((x) => x.node1.key === nodeKey);

        const filteredEdges: Edge[] = [];
        const knownKeys: any[] = [];

        for (const edge of relevantEdges) {
            if (!knownKeys.includes(edge.node2.key)) {
                filteredEdges.push(edge);
                knownKeys.push(edge.node2.key);
            }
        }

        return filteredEdges;
    }

    getNeighborsReversed(nodeKey: any): Edge[] {
        const relevantEdges = this.edges.filter((x) => x.node2.key === nodeKey);

        const filteredEdges: Edge[] = [];
        const knownKeys: any[] = [];

        for (const edge of relevantEdges) {
            if (!knownKeys.includes(edge.node1.key)) {
                filteredEdges.push(edge);
                knownKeys.push(edge.node1.key);
            }
        }

        return filteredEdges;
    }

    getShortestDistance(srcKey: any, destKey: any): Path | undefined {
        let potentialPaths: Path[] = [];

        const startingNeighbors = this.getNeighbors(srcKey);

        for (const edge of startingNeighbors) {
            potentialPaths.push(new Path([edge]));
        }

        while (true) {
            // Check known paths to see if complete
            for (const path of potentialPaths) {
                if (path.dest.key === destKey) {
                    return path;
                }
            }

            // Extend all known paths
            const newPaths: Path[] = [];

            for (const path of potentialPaths) {
                let extensions = this.getNeighbors(path.dest.key);

                // Filter extensions to remove extensions to nodes already included
                extensions = extensions.filter(
                    (x) => !path.includes(x.node2.key)
                );

                for (const edge of extensions) {
                    const toPush = path.clone();

                    toPush.extend(edge);

                    newPaths.push(toPush);
                }
            }

            if (newPaths.length === 0) {
                break;
            }

            potentialPaths = newPaths;
        }

        return undefined;
    }

    getAllPathsTo(srcKey: any): Path[] {
        const allPaths: Path[] = [];
        const visitedNodes: Map<any, boolean> = new Map();

        const allNodes: Node[] = this.getNodes();

        for (const node of allNodes) {
            visitedNodes.set(node.key, false);
        }

        visitedNodes.set(srcKey, true);

        const startingNeighbors = this.getNeighborsReversed(srcKey);

        for (const edge of startingNeighbors) {
            visitedNodes.set(edge.node1.key, true);
            allPaths.push(new Path([edge]));
        }

        while (true) {
            // Extend all known paths
            const newPaths: Path[] = [];

            for (const path of allPaths) {
                let extensions = this.getNeighborsReversed(path.src.key);

                // Filter extensions to remove extensions to nodes already visited
                extensions = extensions.filter(
                    (x) => !visitedNodes.get(x.node1.key)
                );

                for (const edge of extensions) {
                    const toPush = path.clone();

                    toPush.extendFront(edge);

                    newPaths.push(toPush);

                    visitedNodes.set(edge.node1.key, true);
                }
            }

            if (newPaths.length === 0) {
                break;
            }

            allPaths.push(...newPaths);
        }

        return allPaths;
    }

    getAllPathsFrom(srcKey: any): Path[] {
        const allPaths: Path[] = [];
        const visitedNodes: Map<any, boolean> = new Map();

        const allNodes: Node[] = this.getNodes();

        for (const node of allNodes) {
            visitedNodes.set(node.key, false);
        }

        visitedNodes.set(srcKey, true);

        const startingNeighbors = this.getNeighbors(srcKey);

        for (const edge of startingNeighbors) {
            visitedNodes.set(edge.node2.key, true);
            allPaths.push(new Path([edge]));
        }

        while (true) {
            // Extend all known paths
            const newPaths: Path[] = [];

            for (const path of allPaths) {
                let extensions = this.getNeighbors(path.dest.key);

                // Filter extensions to remove extensions to nodes already visited
                extensions = extensions.filter(
                    (x) => !visitedNodes.get(x.node2.key)
                );

                for (const edge of extensions) {
                    const toPush = path.clone();

                    toPush.extend(edge);

                    newPaths.push(toPush);

                    visitedNodes.set(edge.node2.key, true);
                }
            }

            if (newPaths.length === 0) {
                break;
            }

            allPaths.push(...newPaths);
        }

        return allPaths;
    }
}
