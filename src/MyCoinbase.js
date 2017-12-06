'use strict'

class MyCoinbase {

  constructor(client) {
    this.client = client
  }

  async getAccounts() {
    return new Promise((resolve, reject) => {
      this.client.getAccounts({}, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  async getSpotPrice(currency) {
    return new Promise((resolve, reject) => {
      this.client.getSpotPrice({currencyPair: currency}, (err, result) => {
        if (err) {
          reject(err)
        } else {
          const prices = {}
          result.data.forEach(details => {
            prices[details.base] = Number(details.amount)
          })
          resolve(prices)
        }
      })
    })
  }

}

module.exports = MyCoinbase
