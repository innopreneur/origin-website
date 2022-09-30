export default class TotalSupplyService {
  async fetchTotalSupply() {
    const coins = ['ogn', 'ogv']
    const response = await Promise.all(
      coins.map(async (coin) => {
        //const endpoint = `${process.env.NEXT_PUBLIC_STATS_ENDPOINT}/total-${coin}`
        const endpoint = `/api/total-${coin}`
        return fetch(endpoint).then((r) => r.json())
    })
    )
    return response
  }
}

export const totalSupplyService = new TotalSupplyService()
