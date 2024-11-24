const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const { jwtAuth, sendEmail } = require("../middleware");
const { userModel } = require("../models/userModel");
const { warehouseModel } = require("../models/warehouseModel");
const { transactionbookModel } = require("../models/transactionbookModel");


exports.transactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(req.user.uid);
        if(user.transactions.indexOf(goodId) == -1) throw new Error("User doesn't own this transaction or transaction doesn't exist");
        const transaction = await transactionbookModel.findById(id);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createTransactionbookBuySide = async (req, res) => {
    try {
        // TODO: yup validation
        let transactionbookParameters = req.body;
        // Set paramters in body
        transactionbookParameters.orderState = 'waitAcceptSeller';
        let tStateArr = [];
        tStateArr.push(transactionbookParameters.request);
        transactionbookParameters.request = tStateArr;

        transactionbookParameters.associatedBuyer = req.user.uid;
        transactionbookParameters.associatedSeller = warehouseModel.findById(transactionbookParameters.associatedWarehouse).associatedUser;

        // Create it
        const newOrderbook = await new orderbookModel(orderbookParameters);
        
        // Save it to user
        let user = await userModel.findById(req.user.uid);
        user.transactions.push(newOrderbook._id);
        
        res.status(200).json(newOrderbook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sellerSendNewTerms = async (req, res) => {
    try {
        // TODO yup validation
        const params = req.body;

        const { transactionId } = params;
        let transaction = await transactionbookModel.findById(transactionId);
        if(transaction.associatedSeller != req.user.uid || transaction.transactionState != 'waitAcceptSeller')
            throw new Error("Self thrown error on validation");

        transaction.transactionState = 'waitAcceptBuyer';

        // TODO: verify message here
        params.request.message = params.request.message;

        transaction.requests.push(params.request);
        transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.buyerSendNewTerms = async (req, res) => {
    try {
        // TODO yup validation
        const params = req.body;

        const { transactionId } = params;
        let transaction = await transactionbookModel.findById(transactionId);
        if(transaction.associatedBuyer != req.user.uid || transaction.transactionState != 'waitAcceptBuyer')
            throw new Error("Self thrown error on validation");

        transaction.transactionState = 'waitAcceptSeller';

        // TODO: verify message here
        params.request.message = params.request.message;

        transaction.requests.push(params.request);
        transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.acceptTransaction = async (req, res) => {
    try {
        // TODO yup validation
        const params = req.body;
        let transaction = await transactionbookModel.findById(params.transactionId);
        if(transaction.assoicatedBuyer != req.user.uid && transaction.associatedSeller != req.user.uid) 
            throw new Error("User doesn't own this transaction or transaction doesn't exist");

        if(transaction.associatedBuyer == req.user.uid){
            if(transaction.transactionState != 'waitAcceptBuyer') throw new Error("Transaction not in correct state");
            transaction.transactionState = 'awaitingPayment';
        }else{
            if(transaction.transactionState != 'waitAcceptSeller') throw new Error("Transaction not in correct state");
            transaction.transactionState = 'awaitingPayment';
        }
        transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payTransaction = async (req, res) => {
    const params = req.body;
    let transaction = await transactionbookModel.findById(params.transactionId);
    if(transaction.assoicatedBuyer != req.user.uid) 
        throw new Error("User doesn't own this transaction or transaction doesn't exist");

    // Verify payment

    transaction.transactionState = 'active';
    transaction.save();
    res.status(200).json(transaction);
};

exports.sendMessage = async (req, res) => {
    // TODO: yup
    const params = req.body;

    let transaction = await transactionbookModel.findById(params.transactionId);
    if(transaction.assoicatedBuyer != req.user.uid && transaction.associatedSeller != req.user.uid) 
        throw new Error("User doesn't own this transaction or transaction doesn't exist");

    if(transaction.transactionState != 'active' || transaction.transactionState != 'awaitingPayment') throw new Error("Transaction not in correct state");

    // TODO: filter
    params.message = params.message;
    const message = {
        message: params.message,
        person: req.user.uid == transaction.associatedBuyer ? 'buyer' : 'seller'
    }
    transaction.chat.push(message);
    transaction.save();
    res.status(200).json(transaction);
};