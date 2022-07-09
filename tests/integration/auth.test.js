const request = require("supertest")
const { User } = require("../../models/user")
const { Genre } = require("../../models/genre")
let server

describe("Auth middleware", () => {
    let token
    beforeEach(() => { 
        server = require("../../index")
        token = new User().generateAuthToken()
     })
    afterEach(async () => { 
        await Genre.deleteMany({})
        await server.close() 
    })

    const exec = () => {
        return request(server).post("/api/genres/").set({ "x-auth-token": token }).send({ name: "genre1" })
    }

    it("Should return 401 if no token is provided", async () => {
        token = ""
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it("Should return 400 if no token invalid", async () => {
        token = "a"
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it("Should return 200 if token valid", async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
})