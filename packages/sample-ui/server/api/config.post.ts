//「type: 类型，app\project\open」
const postList = async (type: CardType, data: Array<any> | any) => {
    if (type === 'app') {
        const storage = new AppStorage()
        return (await storage.list())
    } else if (type === 'project') {
        const storage = new ProjectStorage()
        return (await storage.add(data))
    } else if (type === 'open') {
        const storage = new OpenStorage()
        return (await storage.list())
    } else {
        return null
    }
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!('type' in body) || !('data' in body)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Type or Data should be an required!',
        })
    }

    // 变更本地json
    postList(body.type, body.data)

    console.log('Test post handler')
    return body
})
