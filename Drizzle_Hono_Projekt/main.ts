import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { goods, product, store} from './drizzle/schema.ts';
import { eq, sql } from 'drizzle-orm' 

const app = new Hono()

// Interfaces and List:

interface Product {
  id: number;
  name: string;
  description: string;
  count: number;
  store: string;
}

const fruitProducts: Product[] = [
  { id:1, name:"apple", description:"bland", count:10, store:"WALMARKT-Düsseldorf"},
  { id:2, name:"banana", description:"tropic", count: 30, store:"WALMARKT-Düsseldorf"}
]

let pointer = 3;

// Handlerfunktionen:

async function getHandler(id: string| undefined): Promise<Response> {
  if(id){
   // const item = fruitProducts.find((item) => item.id === Number(id))
    //if (!item) return Response.json("Fruit not found", {status:404})
    const item = await db.select().from(goods)
                         .leftJoin(product, eq(product.id, goods.productId))
                         .leftJoin(store, eq(store.id, goods.storeId))
                         .where(eq(goods.id, Number(id)))
    return Response.json(item, {status:200})
  }
  return Response.json(await db.select().from(goods)
                               .leftJoin(product, eq(product.id, goods.productId))
                               .leftJoin(store, eq(store.id, goods.storeId)), {status:200})
}

function postHandler(req: Request): Promise<Response> {
  return req.json().then(async (body: Partial<Product>) => {
    if(!body.name) {
      return Response.json("Name not found", {status:400})
    }
    const newProductName = await db.select().from(product).where(eq(body.name, product.name))
    const newStoreName = await db.select().from(store).where(eq(body.store, store.name))
    let newProduct = newProductName
    let newStore = newStoreName
    if(newProductName[0] == undefined){
      newProduct = await db.insert(product).values({ name: body.name }).returning()
    }
    if(newStoreName[0] == undefined && body.store){
      newStore = await db.insert(store).values({ name: body.store }).returning()
    }
    const newGoods = await db.insert(goods)
    .values({ 
      description:body.description ?? "",
      count: body.count ?? 0,
      productId: newProduct[0].id,
      storeId: newStore[0].id           
    }).returning()
    // pointer++
    // const newProduct: Product = {
    //   id: pointer,
    //   name: body.name,
    //   description: body.description ?? "",
    //   count: body.count ?? 0,
    //   store: body.store ?? "",
    // }
    //fruitProducts.push(newProduct)
    return Response.json(newGoods, {status: 201})
  })
}

function patchHandler(req: Request,id: string| undefined): Promise<Response> | Response{
  if (!id){
    return Response.json("id as Param required", {status: 400})
  }
  const method = req.method
  return req.json().then(async (body: Partial<Product>) => {
    const goodsId = Number(id)
    const item = await db.select().from(goods)
                         .leftJoin(product, eq(product.id, goods.productId))
                         .leftJoin(store, eq(store.id, goods.storeId))
                         .where(eq(goods.id, goodsId))
    //const index = fruitProducts.findIndex((fruit) => fruit.id === fruitId)
    if (item[0].goods.id < 1){
      return Response.json("Product not found", {status: 404})
    }
    if(!body.name && method === 'PUT') {
      return Response.json("Name not found", {status:400})
    }
    // const newProduct: Product = {
    //   id: fruitId,
    //   name: body.name ?? fruitProducts[index].name,
    //   description: body.description ?? fruitProducts[index].description,
    //   count: body.count ?? fruitProducts[index].count,
    //   store: body.store ?? fruitProducts[index].store,
    // }
    // fruitProducts[index] = newProduct
    if(body.name && body.name !== item[0].product?.name){
      const productItem = await db.select().from(product)
                                 .where(eq(body.name, product.name))
      if(productItem[0]){
        await db.update(goods).set({productId:productItem[0].id}).where(eq(item[0].goods.id, goods.id))
      }
      else {
        const newProduct = await db.insert(product).values({ name: body.name }).returning()
        await db.update(goods).set({productId:newProduct[0].id}).where(eq(item[0].goods.id, goods.id))
      }
    }
    if(body.store && body.store !== item[0].store?.name){
      const StoreItem = await db.select().from(store)
                               .where(eq(body.store, store.name))
      if(StoreItem[0]){
        await db.update(goods).set({storeId:StoreItem[0].id}).where(eq(item[0].goods.id, goods.id))
      }
      else {
        const newStore = await db.insert(store).values({ name: body.store}).returning()
        await db.update(goods).set({storeId:newStore[0].id}).where(eq(item[0].goods.id, goods.id))
      }
    }
    if(body.count && body.count !== item[0].goods.count){
      await db.update(goods).set({count:body.count}).where(eq(item[0].goods.id, goods.id))
    }
    if(body.description && body.description !== item[0].goods.description){
      await db.update(goods).set({description:body.description}).where(eq(item[0].goods.id, goods.id))
    }
    const changedGoods = await db.select().from(goods)
                             .where(eq(goods.id, goodsId))
    return Response.json(changedGoods, {status: 201})
  });
}

async function deleteHandler(id: string| undefined): Promise<Response> {
  if(!id){
    return Response.json("id as Param required")
  }
  const item = await db.select({id:goods.id}).from(goods).where(eq(Number(id),goods.id))
  //const index = fruitProducts.findIndex((item) => item.id === Number(id))
  if(item[0].id < 1) return Response.json("Product not found", {status:404})
  const removed = await db.delete(goods).where(eq(item[0].id,goods.id)).returning()
  //const [removed] = fruitProducts.splice(index, 1)
  return Response.json({ message: "deleted", item: removed})
}

// Database initiation:

const client = createClient({ url: 'file:walmarkt.db' })
const db = drizzle({ client })
// Reset Database
await db.delete(goods)
await db.delete(product)
await db.delete(store)
// custom SQL statements to reset the autoincrement
await db.run(sql`UPDATE sqlite_sequence SET seq = 0`)

const apple = await db.insert(product).values({ name: "Apple" }).returning()
const banana = await db.insert(product).values({ name: "Banana"}).returning()
const dusseldorf = await db.insert(store).values({ name: "WALMARKT-Düsseldorf"}).returning()
await db.insert(goods).values({ description: "rooten food", productId: apple[0].id, count:20, storeId: dusseldorf[0].id})
await db.insert(goods).values({ description: "hyper processed food", productId: banana[0].id, count:100, storeId: dusseldorf[0].id})


// Routes:

app.get('/fruits', async (c) => await getHandler(c.req.query('id')))
.get('/fruits/:id', async (c) => await getHandler(c.req.param('id')))

app.post('/fruits', (c) => postHandler(c.req))

app.put('/fruits', (c) => patchHandler(c.req, c.req.query('id')))
.put('/fruits/:id', (c) => patchHandler(c.req, c.req.param('id')))

app.patch('/fruits', async (c) => await patchHandler(c.req, c.req.query('id')))
.patch('/fruits/:id', async (c) => await patchHandler(c.req, c.req.param('id')))

app.delete('/fruits', async (c) => await deleteHandler(c.req.query('id')))
.delete('/fruits/:id', async (c) => await deleteHandler(c.req.param('id')))

app.notFound((c) => {
  return c.text('Sie haben nichts gefunden. Loser!!!!',404)
})

Deno.serve(app.fetch)
