type User = {
    name: string
    password: string
    email: string
}

type UserSession = {
    sessionId: string
    userId: number
}


const validate = (user: User): User | null => {
    const includes = (character: string, string: string) => {
        return (string.includes(character))
    }
    const longerThan = (length: number, name: string) => name.length >= length
    const shorterThan = (length: number, name: string) => name.length <= length
    const isLetter = (letter: string) => {
        return (letter.match(/[A-Z]/gi)?.length ?? 0) === 1
    }
    const isNumber = (number: string) => {
        return (number.match(/[1-9]/gi)?.length ?? 0) === 1
    }
    const isPeriod = (period: string) => {
        return (period.match(/\./gi)?.length ?? 0) === 1
    }
    const isUnderscore = (underscore: string) => {
        return (underscore.match(/_/gi)?.length ?? 0) === 1
    }
    const startsWithNonNumber = (string: string) => {
        const firstCharacter = string.charAt(0)
        return !isNumber(firstCharacter)
    }
    const { name, password, email } = user
    const emailIsValid = longerThan(3, email)
                       && shorterThan(255, email)
                       && startsWithNonNumber(email)
                       && includes ('@', email)
                       && [...name].every(character => isLetter(character)
                                                    || isNumber(character)
                                                    || isUnderscore(character)
                                                    || isPeriod(character)
                                         )
    const nameIsValid = longerThan(3, name)
                      && shorterThan(20, name)
                      && startsWithNonNumber(name)
                      && [...name].every(character => isLetter(character)
                                                   || isNumber(character)
                                                   || isUnderscore(character)
                                        )
    const passwordIsValid = longerThan(8, password)
                          && shorterThan(255, password)
    return emailIsValid && nameIsValid && passwordIsValid ? user : null
}


export { User, UserSession, validate }
