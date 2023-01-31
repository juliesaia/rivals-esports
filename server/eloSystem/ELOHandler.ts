export class ELOHandler {
    k: number;
    scaleFactor: number;
    initialPoints: number;
    players: Map<number, number>;

    constructor(options?: {
        k: number;
        scaleFactor: number;
        initialPoints: number;
    }) {
        this.k = options?.k || 32;
        this.scaleFactor = options?.scaleFactor || 400;
        this.initialPoints = options?.initialPoints || 1000;
        this.players = new Map();
    }

    getRating(playerid: number): number {
        return this.players.get(playerid);
    }

    setRating(playerid: number, newRating: number): void {
        this.players.set(playerid, newRating);
    }

    runMatch(player1id: number, player2id: number, multiplier: number) {
        // Initialize player 1 if not already in list
        if (!this.players.has(player1id)) {
            this.players.set(player1id, this.initialPoints);
        }
        // Initialize player 2 if not already in list
        if (!this.players.has(player2id)) {
            this.players.set(player2id, this.initialPoints);
        }

        const player1Rating = this.getRating(player1id);
        const player2Rating = this.getRating(player2id);

        const player1ExpectedScore =
            1.0 /
            (1.0 +
                Math.pow(
                    10,
                    (player2Rating - player1Rating) / this.scaleFactor
                ));
        const player2ExpectedScore =
            1.0 /
            (1.0 +
                Math.pow(
                    10,
                    (player1Rating - player2Rating) / this.scaleFactor
                ));

        const newPlayer1Rating =
            player1Rating + this.k * (1 - player1ExpectedScore) * multiplier;
        const newPlayer2Rating =
            player2Rating + this.k * (0 - player2ExpectedScore) * multiplier;

        this.setRating(player1id, newPlayer1Rating);
        this.setRating(player2id, newPlayer2Rating);
    }

    getSortedPlayers(): { points: number; id: number }[] {
        const sortedIDs = Array.from(this.players.keys()).sort(
            (a, b) => this.getRating(b) - this.getRating(a)
        );

        return sortedIDs.map((x) => {
            return {
                points: this.getRating(x),
                id: x,
            };
        });
    }
}
