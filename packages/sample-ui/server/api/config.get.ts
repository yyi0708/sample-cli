import { AppStorage, ProjectStorage, OpenStorage } from '@/server/utils'

const getList = async (type: CardType) => {
    if (type === 'app') {
        const storage = new AppStorage()
        return (await storage.list())
    } else if (type === 'project') {
        const storage = new ProjectStorage()
        return (await storage.list())
    } else if (type === 'open') {
        const storage = new OpenStorage()
        return (await storage.list())
    } else {
        return null
    }
}


// Params:「type: 类型，app\project\open」
export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    if (!('type' in query)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Type should be an required!',
        })
    }

    const { type } = query

    return (await getList(type as CardType))
})