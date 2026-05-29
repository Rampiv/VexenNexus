export interface EchoRecommendation {
  setId: string
  setName: string
  setImg?: string
  resonatorCount: number
  lock: Record<string, number>
  discard: Record<string, number>
  costStats?: {
    1: { lock: Record<string, number>; discard: Record<string, number> }
    3: { lock: Record<string, number>; discard: Record<string, number> }
    4: { lock: Record<string, number>; discard: Record<string, number> }
  }
}

export interface AggregatedEchoData {
  [setId: string]: EchoRecommendation
}
