import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const goods = sqliteTable("goods", {
    id: integer().primaryKey({ autoIncrement: true }),
    description: text(),
    productId: integer("proudct_id").notNull().references(() => product.id),
    count: integer().notNull(),
    storeId: integer("store_id").references(() => store.id),
})

export const product = sqliteTable("product", {
    id: integer().primaryKey({autoIncrement:true}),
    name: text().notNull(),
})

export const store = sqliteTable("store", {
    id: integer().primaryKey({autoIncrement:true}),
    name: text().notNull(),
})