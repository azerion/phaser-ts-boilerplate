module Fabrique {
    export class Deck {
        public static SUIT_HEARTS: number = 0;
        public static SUIT_DIAMONDS: number = 2;
        public static SUIT_SPADES: number = 1;
        public static SUIT_CLUBS: number = 3;
        public static JOKER_ID: number = 53;

        private cardsPerDeck: number;
        private numberOfDecks: number;
        private numberOfJokers: number;

        private cards: number[] = [];
        private rndm: Math = Math;

        constructor(cardsPerDeck: number = 52, numberOfDecks: number = 1, numberOfJokers: number = 0) {
            this.cardsPerDeck = cardsPerDeck;
            this.numberOfDecks = numberOfDecks;
            this.numberOfJokers = numberOfJokers;

            //Config
            let amount: number = this.numberOfDecks * this.cardsPerDeck,
                i: number,
                j: number;

            //The deck
            for (i = 0; i < amount; i += 1) {
                this.cards.push((i % this.cardsPerDeck) + 1);
            }

            //The jokers
            for (j = 1; j <= this.numberOfJokers; j += 1) {
                this.cards.push(Deck.JOKER_ID);
            }
        }

        public shuffle(): Deck {
            // Fisher-Yates Shuffle
            let i: number = this.cards.length,
                tempDeck: number[] = this.cards;

            if (i === 0) {
                return null;
            }

            while (--i) {
                let j: number = Math.floor(this.rndm.random() * ( i + 1 ));
                let tempi: number = tempDeck[i];

                tempDeck[i] = tempDeck[j];
                tempDeck[j] = tempi;
            }

            this.cards = tempDeck;
            return this;
        }

        public getBlackJackCardValue(cardNumber: number): number {
            if (cardNumber > 52 || cardNumber < 1) {
                return 0;
            }

            let x: number = this.getCardValue(cardNumber);

            return (x === 0 || x > 10) ? 10 : x;
        }

        public deal(): number {
            return this.cards.pop();
        }

        public size(): number {
            return this.cards.length;
        }

        public peak(): number {
            return this.cards[this.cards.length - 1];
        }

        public isJoker(cardId: number): boolean {
            return (cardId === Deck.JOKER_ID);
        }

        public getCardValue(cardId: number): number {
            return (cardId % 13);
        }

        public getSuit(cardId: number): number {
            return Math.ceil((cardId / 13)) % 4;
        }

        public addCard(cardId: number): void {
            this.cards.push(cardId);
        }

        public isBlackSuit(cardId: number): boolean {
            let suit: number = this.getSuit(cardId);
            return suit === Deck.SUIT_SPADES || suit === Deck.SUIT_CLUBS;
        }
    }
}
