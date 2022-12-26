import { Edge } from "./Edge";
import { Node } from "./Node";

export class Path {
    edges: Edge[];
    src: Node;
    dest: Node;

    constructor(edges: Edge[]) {
        this.edges = edges;
        this.src = edges[0].node1;
        this.dest = edges[edges.length - 1].node2;
    }

    getNodes(): Node[] {
        const toReturn: Node[] = [];

        for (let i = 0; i < this.edges.length; i++) {
            toReturn.push(this.edges[i].node1);
        }

        toReturn.push(this.dest);

        return toReturn;
    }

    getLength(): number {
        return this.edges.length + 1;
    }

    extend(edge: Edge): void {
        this.edges.push(edge);
        this.dest = edge.node2;
    }

    includes(nodeKey: any): boolean {
        for (const edge of this.edges) {
            if (edge.includes(nodeKey)) {
                return true;
            }
        }
        return false;
    }

    clone(): Path {
        const newEdges = [...this.edges];
        return new Path(newEdges);
    }

    toString(): String {
        return this.getNodes()
            .map((x) => x.key)
            .join(" > ");
    }
}
