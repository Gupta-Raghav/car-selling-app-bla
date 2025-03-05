import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Car: a.model({
    id: a.id(),
    make: a.string().required(),
    model: a.string().required(),
    year: a.integer().required(),
    price: a.float().required(),
    mileage: a.integer().required(),
    description: a.string(),
    status: a.enum(["AVAILABLE", "SOLD", "PENDING"]),
    images: a.string().array(),
    sellerId: a.id(),
    seller: a.belongsTo("Seller", "sellerId"),
  }),

  Seller: a.model({
    id: a.id(),
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string().required(),
    cars: a.hasMany("Car", "sellerId"),
  }),

  Inquiry: a.model({
    id: a.id(),
    message: a.string().required(),
    carId: a.id(),
    car: a.belongsTo("Car", "carId"),
    buyerName: a.string().required(),
    buyerEmail: a.string().required(),
    buyerPhone: a.string(),
    status: a.enum(["NEW", "RESPONDED", "CLOSED"]),
  })
}).authorization([
  allow => allow.guest().to(["read"]),
  allow => allow.owner().to(["create", "update", "delete"])
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
