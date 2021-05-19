const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose=require('mongoose')




AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
    logo: 'https://api.startupindia.gov.in/sih/api/file/user/image/Incubator?fileName=a2f5b6b4-19aa-4db2-8fef-01be856079a9.png' ,
    companyName: 'BV',
  }
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'taehyung@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'bts',
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
  cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecret-and-long-password-for-a-cookie-in-the-browser',
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
    }
    return null
  }
})

module.exports = router