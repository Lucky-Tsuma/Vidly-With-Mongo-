const request = require("supertest")
let server
const { Genre } = require("../../models/genre")
const { User } = require("../../models/user")

describe("/vidly.com/api/genres", () => {
    beforeEach(() => { server = require("../../index") })

    afterEach(async () => { 
        // close server after running test suite. To avoid 'port in use' error since each test suite will re-load server.
        server.close()
        // after test suite completes, return db to a clean state. Each test suite should run in a clean state
        await Genre.deleteMany({})
    })

    describe("GET /", () => {
        it("Should return all genres", async () => {

            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
            ])
           const res = await request(server).get("/vidly.com/api/genres")
           expect(res.status).toBe(200)
           expect(res.body.length).toBe(2)
           expect(res.body.some(g => g.name === "genre1")).toBeTruthy()
           expect(res.body.some(g => g.name === "genre2")).toBeTruthy()
        })
        
        describe("GET/:id", () => {
            it("Should return a genre if a valid id is passed", async () => {
                const genre = new Genre({ name: "genre1" })
                await genre.save()
                
                const res = await request(server).get("/vidly.com/api/genres/" + genre._id)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty("name", genre.name)
            })

            it("Should return 404 if invalid id is passed", async () => {
                const res = await request(server).get("/vidly.com/api/genres/1")
                expect(res.status).toBe(404)
            })
        })

        describe("POST /", () => {

            let token
            let name
            beforeEach(() => {
                // Hack: set values for the happy path in the beforeEach fxn
                token = new User().generateAuthToken()
                name = "genre1"
            })

            const exec = async () => {
                return await request(server).post("/vidly.com/api/genres/").set({ "x-auth-token": token }).send({ name })
            }

            it("Should return 401 if client is not logged in", async () => {
                token = ""
                const res = await exec()
                expect(res.status).toBe(401)
            })

            it("Should return 400 if genre is less than 5 characters", async () => {
                name = "1234"
                const res = await exec()
                expect(res.status).toBe(400)
            })

            it("Should return 400 if genre is more than 50 characters", async () => {
                name = new Array(52).join("a")
                const res = await exec()
                expect(res.status).toBe(400)
            })

            it("Should save the genre if it is valid", async () => {
                await exec()
                const genre = Genre.find({ name: "genre1" })
                expect(genre).not.toBeNull()
            })

            it("Should return the genre if it is valid", async () => {
                const res = await exec()
                expect(res.body).toHaveProperty("_id")
                expect(res.body).toHaveProperty("name", "genre1")
            })
        })
    })
})