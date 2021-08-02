var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var mongodbUrl = "mongodb://localhost:27017/";

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

// app.post('/addProduct', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock").insertOne({
//             "model_type": req["body"]["model_type"],
//             "model_number": req["body"]["model_number"],
//             "model_color": req["body"]["model_color"],
//             "available_count": req["body"]["available_count"]
//         }, 
//         function(err, result) {
//             if (err) throw err;
//             if(result["acknowledged"] == true) {
//                 res.json({"response": "Product Added!!"});
//             }
//             db.close();
//         });
//     });
// });

// app.get('/getProducts', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock").find({}).toArray(function(err, result) {
//             if (err) throw err;
//             res.json({"response": result});
//             db.close();
//         });
//     });
// });

// app.post('/addTransaction', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("transactions").insertOne({
//             "model_number": req["body"]["model_number"],
//             "transaction_type": req["body"]["transaction_type"],
//             "transaction_date": req["body"]["transaction_date"],
//             "product_rate": req["body"]["product_rate"],
//             "bill_number": req["body"]["bill_number"],
//             "product_quantity": req["body"]["product_quantity"],
//             "discounts": req["body"]["discounts"],
//             "customization_cost": req["body"]["customization_cost"],
//             "comments": req["body"]["comments"]
//         }, 
//         function(err, result) {
//             if (err) throw err;
//             if(result["acknowledged"] == true) {
//                 res.json({"response": "Transaction Updated!!"});
//             }
//             db.close();
//         });
//     });
// });

// app.post('/updateProductCount', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock").updateOne({'model_number': req["body"]["model_number"]}, { $set: { 'available_count': req["body"]["available_count"]}}, 
//         function(err, result) {
//             if (err) throw err;
//             if(result["acknowledged"] == true) {
//                 res.json({"response": "Product Count Updated!!"});
//             }
//             db.close();
//         });
//     });
// });

app.post('/addStockTransaction', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;        
        var dbo = db.db("stepp_db");
        dbo.collection("stock").insertOne({
            "model_number": req["body"]["model_number"],
            "model_type": req["body"]["model_type"],
            "model_size": req["body"]["model_size"],
            "model_color": req["body"]["model_color"],
            "model_rate_per_piece": req["body"]["model_rate_per_piece"],
            "txn_type": req["body"]["txn_type"],
            "txn_income": req["body"]["txn_income"],
            "txn_expense": req["body"]["txn_expense"],
            "txn_date": req["body"]["txn_date"],
            "txn_bill_no": req["body"]["txn_bill_no"],
            "txn_quantity": req["body"]["txn_quantity"],
            "discounts": req["body"]["discounts"],
            "customization_cost": req["body"]["customization_cost"],
            "comments": req["body"]["comments"]
        }, 
        function(err, result) {
            if (err) throw err;
            if(result["acknowledged"] == true) {
                res.json({"response": "Transaction Updated!!"});
            }
            db.close();
        });
    });
});

app.post('/updateStockCount', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;        
        var dbo = db.db("stepp_db");
        dbo.collection("stock_available").insertOne({
            "model_number": req["body"]["model_number"],
            "model_type": req["body"]["model_type"],
            "model_size": req["body"]["model_size"],
            "model_color": req["body"]["model_color"],
            "available_count": req["body"]["available_count"]
        }, 
        function(err, result) {
            if (err) throw err;
            if(result["acknowledged"] == true) {
                res.json({"response": "Stock count updated!!"});
            }
            db.close();
        });
    });
});

app.listen(3000, function () {
  console.log('Stepp app listening on port 3000!');
});