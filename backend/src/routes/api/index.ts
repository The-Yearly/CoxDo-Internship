import e, { Router } from "express";
export const router = Router();
import { Inventory } from "../../utils/zod";
import { client } from "../../utils/index";
router
  .route("/inventory")
  .get(async (req, res) => {
    const response = await client.inventory.findMany();
    if (response) {
      res.status(200).json({ data: response, message: "Success" });
    } else {
      res.status(404).json({ message: "Couldnt Find" });
    }
  })
  .post(async (req, res) => {
    const data = await req.body;
    console.log(data.item);
    const parsedResponse = Inventory.safeParse(data.item);
    console.log(parsedResponse.error);
    const user = await client.users.findFirst({
      where: {
        id: data.user_id,
      },
      select: {
        role: true,
      },
    });
    if (user?.role === "Admin") {
      if (parsedResponse.success) {
        const response = await client.inventory.create({
          data: {
            name: parsedResponse.data?.name,
            price: parsedResponse.data?.price,
            min_stock: parsedResponse.data?.min_stock,
            expiry_date: parsedResponse.data?.expiry_date,
            status: parsedResponse.data?.status,
            stock: parsedResponse.data?.stock,
            supplier: parsedResponse.data?.supplier,
            temperature: parsedResponse.data?.temperature,
            category: parsedResponse.data?.category,
          },
        });
        if (response) {
          const logResp = await client.activityLogs.create({
            data: {
              action: "CREATED",
              timestamp: new Date(),
              user_id: data.user_id,
            },
          });
          if (logResp) {
            res.status(200).json({ message: "Success" });
          } else {
            res
              .status(200)
              .json({ message: "Created Item Failed to Add To Log" });
          }
        } else {
          res.status(500).json({ message: "Server Error" });
        }
      } else {
        res.status(400).json({ data: "Invalid Data" });
      }
    } else {
      res.status(405).json({ message: "User Not Authenticated" });
    }
  });

router.get("/inventory/stats", async (req, res) => {
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(new Date().getDate() + 7);
  const totalItems = await client.inventory.count();
  const totalCategeries = await client.inventory.findMany({
    distinct: ["category"],
    select: { category: true },
  });
  const outStock = await client.inventory.count({
    where: {
      stock: {
        lte: 0,
      },
    },
  });
  const expiringSoon = await client.inventory.count({
    where: {
      expiry_date: {
        lte: oneWeekFromNow,
      },
    },
  });
  const summary = {
    totalItems: totalItems,
    totalCategeries: totalCategeries.length,
    outStock: outStock,
    expiringSoon: expiringSoon,
  };
  res.status(200).json({ message: "Success", data: summary });
});
router.get("/inventory/temperature-distribution", async (req, res) => {
  const response = await client.inventory.groupBy({
    by: "temperature",
  });
  if (response) {
    res.status(200).json({ message: "Success", data: response });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/inventory/category-distribution", async (req, res) => {
  const response = await client.inventory.groupBy({
    by: "category",
  });
  if (response) {
    res.status(200).json({ message: "Success", data: response });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/inventory/expiring-soon", async (req, res) => {
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(new Date().getDate() + 7);
  const expiringSoon = await client.inventory.findMany({
    where: {
      expiry_date: {
        lte: oneWeekFromNow,
      },
    },
  });
  if (expiringSoon) {
    res.status(200).json({ message: "Success", data: expiringSoon });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router
  .route("/inventory/:id")
  .get(async (req, res) => {
    const response = await client.inventory.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    console.log(response);
    if (response) {
      res.status(200).json({ data: response, message: "Success" });
    } else {
      res.status(404).json({ message: "Couldnt Find" });
    }
  })
  .put(async (req, res) => {
    const data = req.body;
    const parsedResponse = Inventory.safeParse(data.item);
    const user = await client.users.findFirst({
      where: {
        id: data.user_id,
      },
    });
    if (user?.role === "Admin") {
      if (parsedResponse.success) {
        const response = await client.inventory.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: {
            name: parsedResponse.data.name,
            category: parsedResponse.data.category,
            price: parsedResponse.data.price,
            min_stock: parsedResponse.data.min_stock,
            status: parsedResponse.data.status,
            stock: parsedResponse.data.stock,
            supplier: parsedResponse.data.supplier,
            expiry_date: parsedResponse.data.expiry_date,
            temperature: parsedResponse.data.temperature,
          },
        });
        if (response) {
          const log = await client.activityLogs.create({
            data: {
              action: "UPDATED",
              timestamp: new Date(),
              user_id: data.user_id,
            },
          });
          if (log) {
            res.status(200).json({ message: "Succesfully Updated" });
          } else {
            res.status(200).json({
              message: "Successfully Updated But Failed To Add To Log",
            });
          }
        } else {
          res.status(500).json({ message: "Servor Error" });
        }
      } else {
        res.status(400).json({ data: "Invalid Data" });
      }
    } else {
      res.status(403).json({ message: "User Not Autheticated" });
    }
  })
  .delete(async (req, res) => {
    const { user_id } = req.body;
    const user = await client.users.findFirst({
      where: {
        id: user_id,
      },
    });
    if (user?.role === "Admin") {
      const isItem=await client.inventory.findFirst({
        where:{
          id:parseInt(req.params.id)
        }
      })
      if(isItem){
      const response = await client.inventory.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });
      if (response) {
        const log = await client.activityLogs.create({
          data: {
            action: "DELETE",
            timestamp: new Date(),
            user_id: user_id,
          },
        });
        if (log) {
          res.status(200).json({ message: "Successfully Deleted" });
        } else {
          res
            .status(200)
            .json({ message: "Successfully Deleted But Failed To Create Log" });
        }
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }else{
      res.status(404).json({message:"Item Not Found"})
    }
    } else {
      res.status(403).json({ message: "User Not Authenticated" });
    }
  });
router.get("/system/info", async (req, res) => {
  const response = await client.systemInfo.findMany();
  if (response) {
    res.status(200).json({ message: "Success", data: response });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/activity/log", async (req, res) => {
  const response = await client.activityLogs.findMany();
  if (response) {
    res.status(200).json({ message: "Success", data: response });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
