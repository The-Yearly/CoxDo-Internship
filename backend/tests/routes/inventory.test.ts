import request, { Response } from "supertest";
const app = require("../../src/index");
describe("Test Fetch Inventory", () => {
  test("GET Inventory", (done) => {
    request(app)
      .get("/api/inventory")
      .then((resp: Response) => {
        // console.log(resp.body)
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toHaveProperty("message", "Success");
        done();
      });
  });
  test("should create inventory item when user is admin and data is valid", async () => {
    const validPayload = {
      user_id: 1,
      item: {
        name: "Test Item",
        price: 100,
        min_stock: 5,
        expiry_date: "2025-12-31T00:00:00.000Z",
        status: "Available",
        stock: 50,
        supplier: "Test Supplier",
        temperature: 22.0,
        category: "Test Category",
      },
    };

    const response = await request(app)
      .post("/api/inventory")
      .send(validPayload)
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Success");
  });

  test("should reject if user is not admin", async () => {
    const nonAdminPayload = {
      user_id: 2,
      item: {
        name: "Another Item",
        price: 80,
        min_stock: 3,
        expiry_date: "2026-01-01",
        status: "Available",
        stock: 20,
        supplier: "Another Supplier",
        temperature: 25.0,
        category: "General",
      },
    };

    const response = await request(app)
      .post("/api/inventory")
      .send(nonAdminPayload);

    expect(response.statusCode).toBe(405);
    expect(response.body).toHaveProperty("message", "User Not Authenticated");
  });

  test("should reject invalid item data", async () => {
    const invalidPayload = {
      user_id: 1,
      item: {
        name: "",
        price: -1,
      },
    };

    const response = await request(app)
      .post("/api/inventory")
      .send(invalidPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("data", "Invalid Data");
  });


test("Get Inventory Stats", (done) => {
  request(app)
    .get("/api/inventory/stats")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});
test("Get Temp Distribution", (done) => {
  request(app)
    .get("/api/inventory/temperature-distribution")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});

test("Get Category Distribution", (done) => {
  request(app)
    .get("/api/inventory/category-distribution")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});

test("Get Expiring Soon", (done) => {
  request(app)
    .get("/api/inventory/category-distribution")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});
test("Get System log", (done) => {
  request(app)
    .get("/api/system/info")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});

test("Get Activity log", (done) => {
  request(app)
    .get("/api/activity/log")
    .then((resp: Response) => {
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toHaveProperty("message", "Success");
      done();
    });
});

test("Return Item per index", async () => {
  const resp = await request(app).get("/api/inventory/3");
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toHaveProperty("message", "Success");
});
test("Return Invalid Item", async () => {
  const resp = await request(app).get("/api/inventory/1023");
  expect(resp.statusCode).toBe(404);
  expect(resp.body).toHaveProperty("message", "Couldnt Find");
});

test("Update inventory item", async () => {
  const updatedItem = {
     user_id: 1,
    item: {
      name: "Updated Item",
      category: "Updated Category",
      price: 200,
      min_stock: 10,
      status: "Available",
      stock: 100,
      supplier: "Updated Supplier",
      expiry_date: "2025-12-31T00:00:00.000Z",
      temperature: 18,
    },
  };

  const response = await request(app)
    .put("/api/inventory/3")
    .send(updatedItem);

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toMatch("Succesfully Updated");
});
test("fail on invalid item data when Updating", async () => {
  const invalidItem = {
    item: {
      category: "Bad Data",
    },
    user_id: 1,
  };

  const response = await request(app)
    .put("/api/inventory/1")
    .send(invalidItem);

  expect(response.statusCode).toBe(400);
  expect(response.body.data).toBe("Invalid Data");
});
test("PUT /api/inventory/:id - fail for non-admin user", async () => {
  const validItem = {
    item: {
      name: "Test",
      category: "Test",
      price: 100,
      min_stock: 10,
      status: "Available",
      stock: 100,
      supplier: "Test",
      expiry_date: "2025-12-31T00:00:00.000Z",
      temperature: 25,
    },
    user_id: 203,
  };

  const response = await request(app)
    .put("/api/inventory/1")
    .send(validItem);

  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe("User Not Autheticated");
});
test("DELETE inventory item", async () => {
  const response = await request(app)
    .delete("/api/inventory/2")
    .send({ user_id: 1 })
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toMatch("Successfully Deleted");
});

test("DELETE Fail Not Admin", async () => {
  const response = await request(app)
    .delete("/api/inventory/2")
    .send({ user_id: 2 })
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toMatch("User Not Authenticated");
});

})