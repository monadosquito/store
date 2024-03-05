import { configuration } from '../server/src/core/configuration'

import { useEffect, useState } from 'react'


export default (endpoint: string): () => void => {
    const [ deleted, setDeleted ] = useState(false)

    useEffect(() => {
        if (deleted) {
            fetch(`/${configuration.protectedEndpointPrefix}${endpoint}`, {
                method: 'DELETE',
            })
        }
        setDeleted(false)
    }, [ deleted ])

    const handleDelete = () => setDeleted(true)

    return handleDelete
}
