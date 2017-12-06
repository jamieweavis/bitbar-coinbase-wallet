#!/usr/local/bin/node
'use strict'

const coinbase = require('coinbase')

const MyCoinbase = require('./MyCoinbase')
const config = require('../config')
const icons = require('./icons')

async function update(myCoinbase) {
  const [accounts, spotPriceGBP, spotPriceUSD] = await Promise.all([
    myCoinbase.getAccounts(),
    myCoinbase.getSpotPrice('GBP'),
    myCoinbase.getSpotPrice('USD')
  ])

  const wallets = {}
  accounts.forEach(acct => { wallets[acct.currency] = Number(acct.balance.amount) })

  let totalSpotPrice = 0;
  let currencyRows = [];

  Object.keys(spotPriceGBP).forEach(currency => {
    if (wallets[currency]) totalSpotPrice += (spotPriceGBP[currency] * wallets[currency])

    const currencyWalletGBP = toCurrencyGBP(spotPriceGBP[currency] * wallets[currency] || 0)
    const currencyWalletUSD = toCurrencyUSD(spotPriceUSD[currency] * wallets[currency] || 0)

    currencyRows.push(
      `${currency}: ${toCurrencyGBP(spotPriceGBP[currency])} - ${currencyWalletGBP} | templateImage=${icons[currency]}`,
      `${currency}: ${toCurrencyUSD(spotPriceUSD[currency])} - ${currencyWalletUSD} | templateImage=${icons[currency]} alternate=true`
    )
  })

  console.log(toCurrencyGBP(totalSpotPrice))
  console.log('---')
  console.log('Coinbase.com | href=https://www.coinbase.com/')
  console.log('---')
  currencyRows.forEach(currencyRow => console.log(currencyRow))
}

function toCurrencyGBP(num) { return Number(num).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) }
function toCurrencyUSD(num) { return Number(num).toLocaleString('en-GB', { style: 'currency', currency: 'USD' }) }

update(
  new MyCoinbase(
    new coinbase.Client({
      apiKey: config.key,
      apiSecret: config.secret
    })
  )
)
