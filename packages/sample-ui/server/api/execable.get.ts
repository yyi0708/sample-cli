export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { exec } = query
    console.log(exec, 'exec')
    return query
})