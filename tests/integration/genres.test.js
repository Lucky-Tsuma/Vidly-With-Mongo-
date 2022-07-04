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

        // it('Should return 404 if genre was not found', () => {
        //     const res = request(server).get('vidly.com/api/genres/62ac65150dded5f6104362d0')
        //     expect(res.status).toBe(404)
        // })
    })
})