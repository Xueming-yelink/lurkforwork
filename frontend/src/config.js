const host = 'http://localhost'
export const BACKEND_PORT = 5500
const hostName = `${host}:${BACKEND_PORT}`

// Auth
export const login = hostName + '/auth/login'
export const register = hostName + '/auth/register'

// Jobs
export const jobFeed = hostName + '/job/feed'
export const jobCUD = hostName + '/job'
export const jobComment = hostName + '/job/comment'
export const jobLike = hostName + '/job/like'

// Users
export const userGU = hostName + '/user'
export const userWatch = hostName + '/user/watch'