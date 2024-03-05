type Configuration = {
    protectedEndpointPrefix: string,
    userEmailMinLength: 3,
    userEmailMaxLength: 320,
    userNameMinLength: 3,
    userNameMaxLength: 20,
    userPasswordMinLength: 10,
    imagesUrl: '/img',
    noImageName: 'no-img',
    imageWidth: '40',
    imageHeight: '40',
    mainImageWidth: '80',
    mainImageHeight: '80',
}

const configuration: Configuration = {
    protectedEndpointPrefix: 'auth',
    userEmailMinLength: 3,
    userEmailMaxLength: 320,
    userNameMinLength: 3,
    userNameMaxLength: 20,
    userPasswordMinLength: 10,
    imagesUrl: '/img',
    noImageName: 'no-img',
    imageWidth: '40',
    imageHeight: '40',
    mainImageWidth: '80',
    mainImageHeight: '80',
}


export type { Configuration }
export { configuration }
