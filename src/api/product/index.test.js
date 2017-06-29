import request from 'supertest-as-promised'
import { masterKey } from '../../config'
import express from '../../services/express'
import routes, { Product } from '.'

const app = () => express(routes)

let product

beforeEach(async () => {
  product = await Product.create({})
})

test('POST /products 201 (master)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: masterKey, name: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
})

test('POST /products 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /products 200 (master)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /products 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /products/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .get(`/${product.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
})

test('GET /products/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${product.id}`)
  expect(status).toBe(401)
})

test('GET /products/:id 404 (master)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})

test('PUT /products/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`/${product.id}`)
    .send({ access_token: masterKey, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(product.id)
  expect(body.name).toEqual('test')
})

test('PUT /products/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${product.id}`)
  expect(status).toBe(401)
})

test('PUT /products/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: masterKey, name: 'test' })
  expect(status).toBe(404)
})

test('DELETE /products/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`/${product.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /products/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${product.id}`)
  expect(status).toBe(401)
})

test('DELETE /products/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
