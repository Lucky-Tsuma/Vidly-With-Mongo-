const request = require('supertest')
let server;
const { Genre } = require('../../models/genre')

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') })

    afterEach(async () => { 
        // close server after running test suite. To avoid 'port in use' error since each test suite will re-load server.
        server.close()
        // after test suite completes, return db to a clean state. Each test suite should run in a clean state
        await Genre.deleteMany({})
    })

    describe('GET /', () => {
        it('Should return all genres', async () => {

            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" },
            ])
           const res = await request(server).get('/vidly.com/api/genres')
           expect(res.status).toBe(200)
           expect(res.body.length).toBe(2)
           expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
           expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
        
        describe('GET/:id', () => {
            it('Should return a genre if a valid id is passed', async () => {
                const genre = new Genre({ name: 'genre1' })
                await genre.save()
                
                const res = await request(server).get('/vidly.com/api/genres/' + genre._id)
                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('name', genre.name)
            })

            it('Should return 404 if invalid id is passed', async () => {
                const res = await request(server).get('/vidly.com/api/genres/1')
                expect(res.status).toBe(404)
            })
        })
    })
})