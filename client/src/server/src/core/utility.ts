type Maybe<A> = A | null


const callEach =
    <I, O>(fs: ((x: I) => O)[]) =>
    (x: I): O[] =>
    fs.map((f: any) => f(x))

const maybeToArray = <A>(x: Maybe<A>): A[] => x !== null ? [x] : []

const clean = <A>(xs: Maybe<A>[]): A[] =>
    xs.flatMap((x: Maybe<A>) => maybeToArray(x))

const nub = <A>(xs: A[]): A[] => {
    const s = new Set<string>()
    xs.map((x: A) => s.add(JSON.stringify(x)))
    return [ ...s ].map((x: string) => JSON.parse(x))
}


export type { Maybe }
export { callEach, clean, nub }
