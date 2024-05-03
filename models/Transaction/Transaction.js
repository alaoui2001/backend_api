class Transaction {
    constructor(id, price, transactionDate, network, type) {
        this.id = id;
        this.price = price;
        this.transactionDate = transactionDate;
        this.network = network;
        this.type = type;
    }
}

module.exports = Transaction;