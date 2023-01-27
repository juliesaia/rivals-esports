class PlayerHandler {
    id: number;
    points: number;

    constructor(id: number, initialPoints?: number) {
        this.id = id;
        this.points = initialPoints;
    }
}

export class ELOHandler {
    k: number;
    scaleFactor: number;
    initialPoints: number;
    players: PlayerHandler[] = [];

    constructor(options?: any) {
        this.k = options?.k || 32;
        this.scaleFactor = options?.scaleFactor || 400;
        this.initialPoints = options?.initialPoints || 1000;
    }

    getRating(playerid: number): number {
        return this.players.find((x) => x.id === playerid).points;
    }

    setRating(playerid: number, newRating: number): void {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === playerid) {
                this.players[i].points = newRating;
                break;
            }
        }
    }

    runMatch(player1id: number, player2id: number) {
        // Initialize player 1 if not already in list
        if (!this.players.find((x) => x.id === player1id)) {
            this.players.push(new PlayerHandler(player1id, this.initialPoints));
        }
        // Initialize player 2 if not already in list
        if (!this.players.find((x) => x.id === player2id)) {
            this.players.push(new PlayerHandler(player2id, this.initialPoints));
        }

        const player1Rating = this.getRating(player1id);
        const player2Rating = this.getRating(player1id);

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
            player1Rating + this.k * (1 - player1ExpectedScore);
        const newPlayer2Rating =
            player2Rating + this.k * (0 - player2ExpectedScore);

        console.log(
            `${player1id} > ${player2id}\n${player1Rating} -> ${newPlayer1Rating}\n${player2Rating} -> ${newPlayer2Rating}`
        );

        this.setRating(player1id, newPlayer1Rating);
        this.setRating(player2id, newPlayer2Rating);
    }
}
