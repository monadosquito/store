const editProdCard = async ({
    params,
    request,
}: { params: any, request: Request }) => {
    const id = +params.id
    const formData = await request.formData()
    fetch(`/auth/product/edit/${id}`, {
        method: 'POST',
        body: formData,
    })
    return null
}


export { editProdCard }
