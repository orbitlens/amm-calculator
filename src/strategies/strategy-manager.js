import amm from './amm'

function approximationHandlerFunc(shouldApproximate, approximationCallback, value) {
    return shouldApproximate ? approximationCallback(value) : value
}

export default class StrategyManager {
    constructor({state, users, fee, ammStrategy}) {
        this.state = state
        this.users = users
        this.fee = fee / 1000
        this.ammStrategy = amm.find(d => d.key === ammStrategy)
    }

    resolveUser(userId) {
        const u = this.users.find(u => u.name === userId)
        if (!u) throw new Error(`Internal error - user ${userId} not found`)
        return u
    }

    getPrice() {
        return this.ammStrategy.getPrice(this.state)
    }

    deposit(user, amountA, amountB) {
        return this.ammStrategy.deposit(this.state, this.resolveUser(user), amountA, amountB)
    }

    withdraw(user) {
        return this.ammStrategy.withdraw(this.state, this.resolveUser(user))
    }

    estimateTrade({price, direction, token, amount, approximation}) {
        const approximationHandler = approximationHandlerFunc.bind(null, approximation)
        if (price)
            return this.ammStrategy.estimatePriceBoundSwap(this.state, this.fee, price, approximationHandler)
        switch (direction) {
            case 'buy':
                return this.ammStrategy.estimateBuyAmount(this.state, this.fee, token, amount, approximationHandler)
            case 'sell':
                return this.ammStrategy.estimateSellAmount(this.state, this.fee, token, amount, approximationHandler)
            default:
                return {a: 0, b: 0}
        }
    }

    swap(a, b) {
        return this.ammStrategy.swap(this.state, a, b)
    }
}