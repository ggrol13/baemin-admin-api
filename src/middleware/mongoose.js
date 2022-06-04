const { connect } = require('mongoose')

let isConn = false
exports.connectMongo = async () => {
  if (isConn) {
    return Promise.resolve()
  }
  try {
    const db = await connect(process.env.MONGO_URL)
    isConn = db.connection.readyState === 1
    console.log('mongo connect')
  } catch (e) {
    return await Promise.reject(e)
  }
}
