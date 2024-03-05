const addProdCard = async ({
    params,
    request,
}: { params: any, request: Request }) => {
    const formData = await request.formData()
    fetch('/auth/product/add', {
        method: 'POST',
        body: formData,
    })
    return null
}


export { addProdCard }
