import { prisma } from "../../prisma";
import { DirectedGraph } from "~~/server/graphTheory/graphs/DirectedGraph";
import { Edge, Node } from "~~/server/graphTheory/elements/AllElements";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.source) {
        return { message: "No player specified" };
    }

    const allSets = await prisma.set.findMany({
        where: {
            NOT: {
                loserGameCount: -1,
            },
        },
        select: {
            winner: {
                select: {
                    id: true,
                    name: true,
                },
            },
            loser: {
                select: {
                    id: true,
                    name: true,
                },
            },
            id: true,
        },
    });

    const sourcePlayer = await prisma.player.findFirstOrThrow({
        where: {
            name: {
                equals: query.source.toString(),
            },
        },
        select: {
            id: true,
        },
    });

    const edges: Edge[] = [];

    for (let i = 0; i < allSets.length; i++) {
        const node1 = new Node(allSets[i].winner, allSets[i].winner.id);
        const node2 = new Node(allSets[i].loser, allSets[i].loser.id);
        edges.push(new Edge(node1, node2, allSets[i]));
    }

    const graph = new DirectedGraph(edges);

    let allPaths;

    if (query.direction === "to") {
        allPaths = graph.getAllPathsTo(sourcePlayer.id);
    } else if (query.direction === "from") {
        allPaths = graph.getAllPathsFrom(sourcePlayer.id);
    }

    allPaths = allPaths.sort((a, b) => b.getLength() - a.getLength());

    const toReturn = [];

    for (const path of allPaths) {
        const pathString = path
            .getNodes()
            .map((x) => x.data.name)
            .join(" > ");

        toReturn.push({
            length: path.getLength() - 1,
            path: pathString,
        });
    }

    toReturn.splice(1);

    return toReturn.map((x) => `${x.length} - ${x.path}`).join("\n");
});
