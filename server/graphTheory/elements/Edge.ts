import { Node } from "./Node";

export class Edge {
	node1: Node;
	node2: Node;
	metadata: any;

	constructor(node1: Node, node2: Node, metadata: any) {
		this.node1 = node1;
		this.node2 = node2;
		this.metadata = metadata;
	}

	includes(nodeKey: any): boolean {
		return this.node1.key === nodeKey || this.node2.key === nodeKey;
	}
}
