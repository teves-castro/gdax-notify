import * as Gdax from "gdax"

type Side = "buy" | "sell"

type OrderStatus = "filled" | "canceled"

type OrderType = "limit" | "market"

type DoneMessage = {
  order_id: string
  price: string
  product_id: string
  reason: OrderStatus
  remaining_size: string
  sequence: number
  side: Side
  time: string
  type: "done"
}

type ReceivedMessage = {
  order_id: string
  order_type: OrderType
  price: string
  product_id: string
  reason: OrderStatus
  remaining_size: string
  sequence: number
  side: Side
  size: string
  time: string
  type: "received"
}

type MatchMessage = {
  maker_order_id: string
  price: string
  product_id: string
  sequence: number
  side: Side
  size: string
  taker_order_id: string
  time: string
  trade_id: number
  type: "match"
}

type Message = DoneMessage | ReceivedMessage | MatchMessage

const gdax = new Gdax.WebsocketClient(["BTC-EUR"])

// gdax.on("message", (data: Message) => {
//   switch (data.type) {
//     case "done":
//       console.log(data)
//       break
//     case "received":
//       console.log(data)
//       break
//     case "match":
//       console.log(data)
//       break
//   }
// })

// import * as express from "express"
// const app = express()

import * as Rx from "rxjs/Rx"
import { max, min, reduce, last } from "ramda"
// import { sum } from "ramda"
// import * as moment from "moment"
// import * as fs from "fs"

// import * as Slack from "node-slack"

// const slackHook = "https://hooks.slack.com/services/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"

// const slack = new Slack(slackHook)
// const ticker = (message: string) =>
//   slack.send({
//     text: message,
//     channel: "#ticker",
//     username: "Bot",
//   })

// app.post("/ticker", (req, res) => {
//   // FqXpZ3vG96J9jZOupbbMMAn7
//   console.log(req.body)
//   slack.respond(req.body, hook => {
//     return {
//       text: `Hello ${hook.username}`,
//       username: "Ticker Alert",
//     }
//   })
// })
// app.listen(1234)

import * as notifier from "node-notifier"
// String
notifier.notify({
  title: "My notification",
  message: "Hello, there!",
})

const prices = Rx.Observable.fromEventPattern<Message>(h => gdax.on("message", data => h(data)))
  .filter(data => data.type === "match")
  .map(data => Number.parseFloat(data.price))

// prices.filter(v => v > 14271).subscribe(v => ticker(`BTC is above ${14271}`))
// prices.filter(v => v < 14220).subscribe(v => ticker(`BTC is bellow ${14220}`))

const maxList = reduce(max, -Infinity)
const minList = reduce(min, +Infinity)

prices
  .bufferTime(5000)
  .map(ps => [minList(ps), maxList(ps), last(ps)!])
  .windowCount(3, 1)
  .combineAll()
// .subscribe(x => console.log(x))

// const average = (duration: number) =>
//   prices
//     .bufferTime(duration)
//     .filter(ps => ps.length > 0)
//     .map(ps => sum(ps) / ps.length)

// const ema12 = average(12 * 100)
// const ema26 = average(26 * 100)

// ema12.zip(ema26).subscribe(mas => {
//   console.log("EMAs ==>", mas)
// })

// type AvgInfo = [number, number[]]

// prices
//   .windowTime(10000)
//   .map(w =>
//     w
//       .reduce(([sum, values]: AvgInfo, cur) => [sum + cur, [...values, cur]] as AvgInfo, [0, []] as AvgInfo)
//       .map(([s, ns]) => [ns, s / ns.length] as [number[], number]),
//   )
//   .mergeAll()
//   .subscribe(ns => console.log(ns))

// prices
//   .bufferTime(100)
//   .filter(ps => ps.length > 0)
//   .map(ps => [Math.min(...ps), Math.max(...ps)])
//   // .combineAll()
//   // .map(g => g.min().combineLatest(g.max()))
//   // .combineAll()
//   .subscribe(console.log)

// // mins.combineLatest(maxs).subscribe(([l, h]) => console.log(l, h))
