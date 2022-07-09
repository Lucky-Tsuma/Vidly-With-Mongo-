const { Rental } = require("../../models/rental")
const { User } = require("../../models/user")
const mongoose = require("mongoose")
const request = require("supertest")
const moment = require("moment")
const { Movie } = require("../../models/movies")

describe("/vidly.com/api/returns", () => {
    let server
    let customerId
    let movieId
    let movie
    let rental
    let token

    beforeEach(async () => { 
        server = require("../../index") 
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: { name: "12345" },
            numberInStock: 10
        })
        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345"
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        })
        await rental.save()
    })

    afterEach(async () => { 
        await server.close()
        await Rental.deleteMany({})
        await Movie.deleteMany({})
    })

    const exec = () => {
        return request(server).post("/vidly.com/api/returns").set({ "x-auth-token": token }).send({ customerId, movieId })
    }

    it("Should return 401 if client is not logged in", async () => {
        token = ""
        const res = await exec()
        expect(res.status).toBe(401)
    })

    it("Should return 400 if customerId is not provided", async () => {
        customerId = ""
        const res = await exec()
        expect(res.status).toBe(400)
    }) 

    it("Should return 400 if movieId is not provided", async () => {
        movieId = ""
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it("Should return 404 if no rental found for this customer/movie combination", async () => {
        await Rental.remove({})
        const res = await exec()
        expect(res.status).toBe(404)
    })

    it("Should return 400 if rental is already processed", async () => {
        rental.dateReturned = new Date()
        await rental.save()

        const res = await exec()
        expect(res.status).toBe(400)
    })

    it("Should return 200 if request is valid", async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })

    it("Should set the return date if input is valid", async () => {
        await exec()
        // We re-load rental here because by running exec() function above, we make changes to the database
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    it("Should calculate rental fee if input is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate()
        await rental.save()

        await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14)
    })

    it("Should increase the movie stock if input is valid", async () => {
        await exec()

        const movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })

    it("Should return the rental if input is valid", async () => {
        const res = await exec()

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([ "dateOut", "dateReturned", "rentalFee", "customer", "movie" ]))
    })
})

