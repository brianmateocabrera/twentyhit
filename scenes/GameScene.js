class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.round = 1;
        this.maxRounds = 8;
        this.scores = { player1: 0, player2: 0 };
    }

    preload() {
        this.load.spritesheet("cards", "assets/deck-spritesheet.png", {
            frameWidth: 100,
            frameHeight: 140
        });
    }

    create() {
        this.cardScale = 1.2; // factor de escala global para cartas
        this.cameras.main.setBackgroundColor("#004400");

        this.deck = this.createDeck();
        this.player1Hand = [];
        this.player2Hand = [];
        this.table = [];
        this.discardPile = [];

        // Layout
        this.layout = {
            deck: { x: this.scale.width / 2 - 400, y: this.scale.height / 2 },
            table: { x: this.scale.width / 2, y: this.scale.height / 2 },
            discard: {
                x: this.scale.width / 2 + 400,
                y: this.scale.height / 2
            },
            player1: { x: this.scale.width / 2, y: this.scale.height - 150 },
            player2: { x: this.scale.width / 2, y: 150 }
        };

        this.renderDeck();
        this.startRound();
    }

    renderDeck() {
        if (this.deckSprites) {
            this.deckSprites.forEach(s => s.destroy());
        }
        this.deckSprites = [];
        this.deck.forEach((card, i) => {
            const s = this.add
                .sprite(
                    this.layout.deck.x + i * 0.3,
                    this.layout.deck.y + i * 0.3,
                    "cards",
                    0
                )
                .setScale(this.cardScale);
            this.deckSprites.push(s);
        });
    }

    startRound() {
        if (this.round > this.maxRounds) {
            this.endGame();
            return;
        }
        this.clearHandsAndTable();
        this.dealHands(() => {
            this.startTurnLoop();
        });
    }

    clearHandsAndTable() {
        [...this.player1Hand, ...this.player2Hand, ...this.table].forEach(c =>
            c.sprite?.destroy()
        );
        this.player1Hand = [];
        this.player2Hand = [];
        this.table = [];
    }

    dealHands(onComplete) {
        let dealt = 0;
        const dealNext = () => {
            if (dealt >= 6) {
                this.renderDeck();
                onComplete();
                return;
            }
            const card = this.drawCard();
            const isP1 = dealt % 2 === 0;
            this.animateDeal(card, isP1, () => {
                dealt++;
                this.time.delayedCall(200, dealNext);
            });
        };
        dealNext();
    }

    startTurnLoop() {
        let turnCount = 0;
        const doTurn = () => {
            if (turnCount >= 3) {
                this.round++;
                this.startRound();
                return;
            }
            this.iaTurn(() => {
                this.checkTable("player2");
                this.playerTurn(() => {
                    this.checkTable("player1");
                    turnCount++;
                    doTurn();
                });
            });
        };
        doTurn();
    }

    iaTurn(callback) {
        const card = Phaser.Utils.Array.RemoveRandomElement(this.player2Hand);
        this.playCardToTable(card, true, callback); // IA coloca carta boca arriba
    }

    playerTurn(callback) {
        // interacción a implementar
        callback();
    }

    checkTable(playerWhoPlayed) {
        if (this.table.length === 0) return;

        const values = this.table.map(c => c.value);
        const total = values.reduce((a, b) => a + b, 0);

        if (total === 20) {
            this.scores[playerWhoPlayed]++;
            this.moveAllToDiscard(this.table);
            this.table = [];
            return;
        }

        const subsets = this.findSubsetsSumming20(values);
        if (subsets.length > 0) {
            let maxLen = 0;
            let chosen = null;
            for (let s of subsets) {
                if (s.length > maxLen) {
                    maxLen = s.length;
                    chosen = s;
                }
            }
            const toDiscard = [];
            for (let v of chosen) {
                const idx = this.table.findIndex(c => c.value === v);
                if (idx !== -1) {
                    toDiscard.push(this.table[idx]);
                    this.table.splice(idx, 1);
                }
            }
            this.moveAllToDiscard(toDiscard);
            return;
        }
    }

    moveAllToDiscard(cards) {
        cards.forEach((c, i) => {
            this.tweens.add({
                targets: c.sprite,
                x: this.layout.discard.x + i * 0.5,
                y: this.layout.discard.y + i * 0.5,
                duration: 400,
                onComplete: () => {
                    this.flipCard(c.sprite, c.frame, () => {
                        this.discardPile.push(c);
                    });
                }
            });
        });
    }

    findSubsetsSumming20(values) {
        const results = [];
        const n = values.length;
        const backtrack = (start, path, sum) => {
            if (sum === 20) {
                results.push([...path]);
                return;
            }
            if (sum > 20) return;
            for (let i = start; i < n; i++) {
                path.push(values[i]);
                backtrack(i + 1, path, sum + values[i]);
                path.pop();
            }
        };
        backtrack(0, [], 0);
        return results;
    }

    endGame() {
        console.log("Final:", this.scores);
        this.scene.start("MenuScene");
    }

    createDeck() {
        const deck = [];
        const suits = 4;
        const values = 13; // 0 = dorso
        for (let s = 0; s < suits; s++) {
            for (let v = 1; v < values; v++) {
                deck.push({ suit: s, value: v, frame: s * values + v });
            }
        }
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    drawCard() {
        const c = this.deck.pop();
        this.renderDeck();
        return c;
    }

    animateDeal(cardData, isP1, onComplete) {
        const sprite = this.add
            .sprite(this.layout.deck.x, this.layout.deck.y, "cards", 0)
            .setScale(this.cardScale);
        cardData.sprite = sprite;
        const target = isP1 ? this.layout.player1 : this.layout.player2;
        const hand = isP1 ? this.player1Hand : this.player2Hand;
        const offsetX = hand.length * 40;
        this.tweens.add({
            targets: sprite,
            x: target.x + offsetX,
            y: target.y,
            duration: 500,
            onComplete: () => {
                if (isP1) {
                    this.flipCard(sprite, cardData.frame);
                } else {
                    sprite.setFrame(0); // dorso
                }
                hand.push(cardData);
                onComplete();
            }
        });
    }

    playCardToTable(cardData, flip, onComplete) {
        const sprite = cardData.sprite;
        this.tweens.add({
            targets: sprite,
            x: this.layout.table.x + this.table.length * 30,
            y: this.layout.table.y,
            duration: 400,
            onComplete: () => {
                if (flip) {
                    this.flipCard(sprite, cardData.frame);
                }
                this.table.push(cardData);
                onComplete();
            }
        });
    }

    // Animación de volteo realista en eje Y
    flipCard(sprite, newFrame, onComplete) {
        this.tweens.add({
            targets: sprite,
            scaleX: 0,
            duration: 150,
            onComplete: () => {
                sprite.setFrame(newFrame);
                this.tweens.add({
                    targets: sprite,
                    scaleX: this.cardScale,
                    duration: 150,
                    onComplete: onComplete
                });
            }
        });
    }
}
