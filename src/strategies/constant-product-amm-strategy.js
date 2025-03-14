export default {
    name: 'Constant product with adjusted deposit strategy',
    key: 'xy=k',
    estimatePriceBoundSwap: function (pool, fee, price, approximation) {
        const currentPrice = this.getPrice(pool)
        let a, b
        if (price > currentPrice) {
            a = approximation(Math.ceil, (Math.sqrt(pool.amountA * pool.amountB * price) - pool.amountA) * Math.sqrt((1 + fee)))
            b = approximation(Math.ceil, (pool.amountA + a) / price - pool.amountB)
        }
        if (price < currentPrice) {
            b = approximation(Math.ceil, (Math.sqrt(pool.amountA * pool.amountB / price) - pool.amountB) * Math.sqrt((1 + fee)))
            a = approximation(Math.ceil, price * (pool.amountB + b) - pool.amountA)
        }
        if (!a || !b) {
            a = b = 0
        }
        return {a, b}
    },
    estimateBuyAmount(pool, fee, token, amount, approximation) {
        if (token === 'A') return {
            a: -amount,
            b: approximation(Math.ceil, amount * pool.amountB * (1 + fee) / (pool.amountA - amount))
        }
        return {
            a: approximation(Math.ceil, pool.amountA * amount * (1 + fee) / (pool.amountB - amount)),
            b: -amount
        }
    },
    estimateSellAmount(pool, fee, token, amount, approximation) {
        if (token === 'A') return {
            a: amount,
            b: approximation(Math.floor, -amount * pool.amountB * (1 - fee) / (pool.amountA + amount))
        }
        return {
            a: approximation(Math.floor, -pool.amountA * amount * (1 - fee) / (pool.amountB + amount)),
            b: amount
        }
    },
    swap: function (pool, a, b) {
        if (pool.amountA * pool.amountB > (pool.amountA + a) * (pool.amountB + b))
            return `Internal error - invalid pool liquidity after the trade, swap amount: ${a}A ${b}B`
        if (a === 0 || b === 0)
            return `Error - invalid swap amount: ${a}A ${b}B`
        pool.amountA += a
        pool.amountB += b
        return `SWAP_SUCCESS - swapped ${a}A ↔ ${b}B, pool balance ${pool.amountA}A ${pool.amountB}B`
    },
    getPrice: function (pool) {
        if (pool.amountA > 0) return pool.amountA / pool.amountB
        return 1 //this is a new pool
    },
    calculateStake: function (pool, depositAmountA, depositAmountB) {
        if (!pool.amountA) return Math.floor(Math.sqrt(depositAmountA * depositAmountB)) //new pool
        return Math.floor(Math.sqrt(depositAmountA * depositAmountB) * pool.stakes / Math.sqrt(pool.amountA * pool.amountB))
    },
    deposit: function (pool, user, amountA, amountB) {
        if (user.stake) return `Error - DEPOSIT_ALREADY_EXISTS - account ${user.name}`
        const p = this.getPrice(pool)
        let depositAmountA = amountA,
            depositAmountB = amountB
        if (pool.amountA) {
            //adjust amounts - only if pool already exists
            if (amountA * pool.amountB > amountB * pool.amountA) {
                depositAmountA = Math.ceil(amountB * p)
            } else {
                depositAmountB = Math.ceil(amountA / p)
            }
            if (depositAmountA > amountA) return `Internal error - invalid stake amount ${depositAmountA}>${amountA}`
            if (depositAmountB > amountB) return `Internal error - invalid stake amount ${depositAmountB}>${amountB}`
        }
        if (depositAmountA && depositAmountB && (depositAmountA <= 0 || depositAmountB <= 0)) return 'Error - DEPOSIT_INSUFFICIENT_AMOUNT'
        const stake = this.calculateStake(pool, depositAmountA, depositAmountB)
        if (stake <= 0) return `Error - DEPOSIT_INSUFFICIENT_AMOUNT - account ${user.name}`
        user.stake = stake
        if (!pool.stakes) { //new pool
            pool.stakes = 0
            pool.amountA = 0
            pool.amountB = 0
        }
        pool.stakes += stake
        pool.amountA += depositAmountA
        pool.amountB += depositAmountB
        return `DEPOSIT_SUCCESS - account ${user.name} deposited ${depositAmountA}A and ${depositAmountB}B → stake ${stake}`
    },
    withdraw: function (pool, user) {
        const {stake} = user
        if (!stake) return `Error - WITHDRAW_STAKE_NOT_FOUND`
        let amountA, amountB
        if (stake === pool.stakes) { // the last liquidity stake withdrawn from the pool
            amountA = pool.amountA
            amountB = pool.amountB
        } else {
            let liquidity = stake / pool.stakes
            amountA = Math.floor(pool.amountA * liquidity)
            amountB = Math.floor(pool.amountB * liquidity)
        }
        pool.stakes -= stake
        pool.amountA -= amountA
        pool.amountB -= amountB
        user.stake = 0
        return `WITHDRAW_STAKE_SUCCESS - account ${user.name} withdrew stake ${stake} → ${amountA}A and ${amountB}B`
    }
}