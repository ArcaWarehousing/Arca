const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtAuth, sendEmail } = require("../middleware");
const { userModel } = require("../models/userModel");
const { warehouseModel } = require("../models/warehouseModel");

const { default: mongoose } = require("mongoose");

let warehouseSchema = yup.object({
  name: yup.string().required(),
  address: yup.object({
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.number().required(),
  }),
  description: yup.string().default(""),
  totalSqft: yup.number().required().min(0),
  externalUsedSqft: yup.number().required().min(0),
  availableSqft: yup.number().required().min(0),
  princePerSqftPerMonth: yup.number().required().min(0),
  downpaymentPercentage: yup.number().required().min(0).max(100),
  warehouseType: yup
    .string()
    .required()
    .oneOf(["Public", "Private", "Shared", "Specialized"]),
  refrigerated: yup.boolean().required(),
  ceilingHeight: yup.number().required().min(0),
  loadingDocks: yup.number().required().min(0),
  securityCameras: yup.boolean().required(),
  securityGuards: yup.boolean().required(),
  specialFeatures: yup.string().default(""),
});
exports.uploadWarehouse = async (req, res) => {
  try {
    const uid = req.user.uid;
    let validatedData = await warehouseSchema.validate(req.body);

    let user = await userModel.findById(req.user.uid);
    validatedData.associatedUser = uid;
    const warehouse = await warehouseModel.create(validatedData);
    user.ownedWarehouses.push(warehouse._id);
    user.save();
    res.status(200).send({ message: "Warehouse uploaded successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error uploading warehouse " + error.message });
  }
};

const outputWarehouseCleaner = (warehouse) => {
  return {
    name: warehouse.name,
    warehouseId: warehouse._id,
    associatedUser: warehouse.associatedUser,
    address: {
      street: warehouse.address.street,
      city: warehouse.address.city,
      state: warehouse.address.state,
      zip: warehouse.address.zip,
    },
    photos: warehouse.photos,
    description: warehouse.description,
    totalSqft: warehouse.totalSqft,
    externalUsedSqft: warehouse.externalUsedSqft,
    availableSqft: warehouse.availableSqft,
    princePerSqftPerMonth: warehouse.princePerSqftPerMonth,
    downpaymentPercentage: warehouse.downpaymentPercentage,
    warehouseType: warehouse.warehouseType,
    refrigerated: warehouse.refrigerated,
    ceilingHeight: warehouse.ceilingHeight,
    loadingDocks: warehouse.loadingDocks,
    securityCameras: warehouse.securityCameras,
    securityGuards: warehouse.securityGuards,
    specialFeatures: warehouse.specialFeatures,
    verified: warehouse.verified,
    publiclySearchable: warehouse.publiclySearchable,
  };
};

exports.getUserWarehouses = async (req, res) => {
  try {
    const uid = req.user.uid;
    const warehouses = await warehouseModel.find({ associatedUser: uid });

    let returnWarehouses = [];
    for (let i = 0; i < warehouses.length; i++) {
      if (warehouses[i].showUser == true)
        returnWarehouses.push(outputWarehouseCleaner(warehouses[i]));
    }
    res.status(200).json(returnWarehouses);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateUserWarehouses = async (req, res) => {
  try {
    const uid = req.user.uid;
    const user = await userModel.findById(uid);
    let validatedData = await warehouseSchema.validate(req.body);
    const { warehouseId, associatedUser } = await yup
      .object({
        warehouseId: yup.string().required(),
      })
      .validate(req.body);

    const warehouse = await warehouseModel.findOne({
      associatedUser: uid,
      _id: warehouseId,
    });
    if (warehouse == null) throw new Error("Not found or invalid request");
    validatedData.associatedUser = uid;

    await warehouseModel.findByIdAndUpdate(warehouseId, validatedData);
    const updatedWarehouse = await warehouseModel.findById(warehouseId);
    res.status(200).json(outputWarehouseCleaner(updatedWarehouse));
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error uploading warehouse " + error.message });
  }
};

exports.uploadPictures = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const user = await userModel.findById(req.user.uid);
    if (user.ownedWarehouses.indexOf(warehouseId) == -1)
      throw new Error("User doesn't own this item or item doesn't exist");

    let warehouse = await warehouseModel.findById(warehouseId);
    for (let i = 0; i < req.files.length; i++) {
      warehouse.pictures.push(req.files[i].filename);
    }
    warehouse.save();
    res.status(200).send({ message: "Pictures uploaded successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error uploading pictures: " + error.message });
  }
};

exports.uploadPaperwork = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const user = await userModel.findById(req.user.uid);
    if (user.ownedWarehouses.indexOf(warehouseId) == -1)
      throw new Error("User doesn't own this item or item doesn't exist");

    let warehouse = await warehouseModel.findById(warehouseId);
    warehouse.verificationPaperwork.push(files.filename);

    warehouse.save();
    res.status(200).send({ message: "Documents uploaded successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error uploading documents: " + error.message });
  }
};

exports.requestVerification = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const user = await userModel.findById(req.user.uid);
    const request = {
      person: process.env.BACKEND_NOTIFY_EMAIL.split(" "),
      subject: "User Needs Verification for a Warehouse",
      message:
        "<b>This is a automated message</b><br> User: " +
        user.firstName +
        " " +
        user.lastName +
        " at " +
        user.email +
        " requires verification for their warehouse with warehouse ID: " +
        warehouseId +
        "<br/>",
    };
    sendEmail(request);
    res.status(200).send({ message: "Verification requested" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// exports.delete = async (req, res) => {
//     try{
//         const { warehouseId } = req.params;
//         const user = await userModel.findById(req.user.uid);
//         if(user.ownedWarehouses.indexOf(warehouseId) == -1) throw new Error("User doesn't own this item or item doesn't exist");
//         let warehouse = await warehouseModel.findById(warehouseId);

//         warehouse.publiclySearchable = false;
//         warehouse.showUser = false;

//         res.status(200).send({ message: "Warehouse deleted successfully" });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

exports.search = async (req, res) => {
  try {
    console.log("Search request received:", req.body);

    let query = { publiclySearchable: true };

    if (req.body.location) {
      query["address.city"] = { $regex: new RegExp(req.body.location, "i") };
    }

    if (req.body.minTotalSqft && req.body.maxTotalSqft) {
      query.totalSqft = {
        $gte: req.body.minTotalSqft,
        $lte: req.body.maxTotalSqft,
      };
    } else if (req.body.minTotalSqft) {
      query.totalSqft = { $gte: req.body.minTotalSqft };
    } else if (req.body.maxTotalSqft) {
      query.totalSqft = { $lte: req.body.maxTotalSqft };
    }

    if (req.body.minPricePerSqftPerMonth && req.body.maxPricePerSqftPerMonth) {
      query.pricePerSqftPerMonth = {
        $gte: req.body.minPricePerSqftPerMonth,
        $lte: req.body.maxPricePerSqftPerMonth,
      };
    } else if (req.body.minPricePerSqftPerMonth) {
      query.pricePerSqftPerMonth = { $gte: req.body.minPricePerSqftPerMonth };
    } else if (req.body.maxPricePerSqftPerMonth) {
      query.pricePerSqftPerMonth = { $lte: req.body.maxPricePerSqftPerMonth };
    }

    if (req.body.warehouseType) {
      query.warehouseType = req.body.warehouseType;
    }

    if (req.body.refrigerated !== undefined) {
      query.refrigerated = req.body.refrigerated;
    }

    if (req.body.securityCameras !== undefined) {
      query.securityCameras = req.body.securityCameras;
    }

    if (req.body.securityGuards !== undefined) {
      query.securityGuards = req.body.securityGuards;
    }

    const warehouses = await warehouseModel.find(query);
    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error searching warehouses:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
