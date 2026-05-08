export interface EchoRecommendation {
  setId: string
  setName: string
  setImg: string
  lock: Record<string, number>
  discard: Record<string, number>
  resonatorCount: number
}

export interface AggregatedEchoData {
  [setId: string]: EchoRecommendation
}
