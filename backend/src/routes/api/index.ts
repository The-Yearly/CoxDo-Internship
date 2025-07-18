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
    const parsedResponse = Inventory.safeParse(data);
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
        res.json({ message: "Success" });
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    } else {
      res.status(400).json({ data: "Invalid Data" });
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
    if (response) {
      res.status(200).json({ data: response, message: "Success" });
    } else {
      res.status(404).json({ message: "Couldnt Find" });
    }
  })
  .put(async (req, res) => {
    const parsedResponse = Inventory.safeParse(req.body);
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
        res.status(200).json({ message: "Succesfully Updated" });
      } else {
        res.status(500).json({ message: "Servor Error" });
      }
    } else {
      res.status(400).json({ data: "Invalid Data" });
    }
  })
  .delete(async (req, res) => {
    const response = await client.inventory.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (response) {
      res.status(200).json({ message: "Successfully Deleted" });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  });
