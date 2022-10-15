// const { query } = require("express");
const productRepo = require("../repository/product");

const productController = {
  get: async (req, res) => {
    try {
      const response =
        await productRepo.getProduct();
      res.status(200).json({
        result: response.rows,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  },

  post: async (req, res) => {
    try {
      const result =
        await productRepo.postProduct(req.body);
      res.status(201).json({
        msg: "Create New Product Success!",
        result: result.rows,
      });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Internal Server Error" });
    }
  },

  patch: async (req, res) => {
    try {
      const result =
        await productRepo.editProduct(
          req.body,
          req.params,
        );
      res
        .status(200)
        .json({
          msg: "Update Success!",
          result: result,
        });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Internal Server Error" });
    }
  },

  clear: async (req, res) => {
    try {
      const result = productRepo.clearProduct(req.params)
      res.status(200).json({
        message: "Delete Data Successfully!",
        result: result.rows,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
    },

  search: async (req, res) => {
    try {
      const result =
        await productRepo.searchProduct(
          req.query,
        );
      res.status(200).json({
        result: result.rows,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  filter: async (req, res) => {
    try {
      const result =
        await productRepo.filterProduct(
          req.params,
        );
      res.status(200).json({
        result: result.rows,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },


  sort: async (req, res) => {
    try {
      const response =
        await productRepo.sortsProduct(req.query);
      res.status(200).json({
        result: response.rows,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  },

};

module.exports = productController;