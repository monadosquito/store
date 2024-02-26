type Configuration = {
    protectedEndpointPrefix: string,
    userEmailMinLength: 3,
    userEmailMaxLength: 320,
    userNameMinLength: 3,
    userNameMaxLength: 20,
    userPasswordMinLength: 10,
}

const configuration: Configuration = {
    protectedEndpointPrefix: 'auth',
    userEmailMinLength: 3,
    userEmailMaxLength: 320,
    userNameMinLength: 3,
    userNameMaxLength: 20,
    userPasswordMinLength: 10,
}


export type { Configuration }
export { configuration }
