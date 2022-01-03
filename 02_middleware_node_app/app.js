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

app.post('/product', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;        
        var dbo = db.db("stepp_db");
        let searchProObj = {
            "model": req["body"]["model"],
            "size": req["body"]["size"],
            "color": req["body"]["color"]
        };
        let addProObj = {
            "model": req["body"]["model"],
            "size": req["body"]["size"],
            "color": req["body"]["color"],
            "count": req["body"]["count"]
        };

        dbo.collection("products").find(searchProObj).toArray(function(err, result) {
            if (err) throw err;
            if(result.length == 0) {
                dbo.collection("products").insertOne(addProObj,
                function(err, result) {
                    if (err) throw err;
                    if(result["acknowledged"] == true) {
                        res.json({"response": "Product Added!!"});
                    }
                    db.close();
                });
            } else {
                res.json({"response": "Product Already Exist!!"});
                db.close();
            }
        });
    });
});

app.get('/product', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("products").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.get('/getSizes', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("raw_data").distinct("size", function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.get('/getColors', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("raw_data").distinct("color", function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.post('/stockin', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;        
        var dbo = db.db("stepp_db");
        dbo.collection("stock_in").insertMany(req["body"], function(err, result) {
            if (err) throw err;
            if(result["acknowledged"] == true) {
                res.json({"response": "Stock_in collection updated successfully!!"});
            }
            db.close();
        });
    });
});

app.post('/transactions', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        let transactionsObj = {};
        transactionsObj["date"] = new Date(req["body"]["date"]);
        transactionsObj["type"] = req["body"]["type"];
        transactionsObj["bill_no"] = req["body"]["bill_no"];
        transactionsObj["description"] = req["body"]["description"];
        transactionsObj["income"] = req["body"]["income"];
        transactionsObj["expense"] = req["body"]["expense"];
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").insertOne(transactionsObj, function(err, result) {
            if (err) throw err;
            if(result["acknowledged"] == true) {
                res.json({"response": "transactions collection updated successfully!!"});
            }
            db.close();
        });
    });
});

app.post('/productCountUpdate', function (req, res) {
    let totalDataArr = req["body"]["updatedData"];
    updatedData();

    function updatedData() {
        if(req["body"]["type"] == "stock_in") {
            let queryObj = {};
            queryObj["model"] = totalDataArr[0]["model"];
            queryObj["size"] = totalDataArr[0]["size"];
            queryObj["color"] = totalDataArr[0]["color"];
            let incValue = parseInt(totalDataArr[0]["count"]);
            let incValueObj = { $inc: { "count" : incValue } };
            MongoClient.connect(mongodbUrl, function(err, db) {
                if (err) throw err;
                var dbo = db.db("stepp_db");
                dbo.collection("products").findOneAndUpdate(queryObj, incValueObj, function(err, result) {
                    if (err) throw err;
                    if(result["ok"] == 1) {
                        totalDataArr.shift();
                    }
                    db.close();
                    if(totalDataArr.length == 0) {
                        res.json({"response": "products collection's counts updated successfully!!"});
                    } else {
                        updatedData();
                    }
                });
            });
        } else {
            //TBD
        }
    }
});

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

// app.post('/addStockTransaction', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock").insertOne({
//             "model_number": req["body"]["model_number"],
//             "model_type": req["body"]["model_type"],
//             "model_size": req["body"]["model_size"],
//             "model_color": req["body"]["model_color"],
//             "model_rate_per_piece": req["body"]["model_rate_per_piece"],
//             "txn_type": req["body"]["txn_type"],
//             "txn_income": req["body"]["txn_income"],
//             "txn_expense": req["body"]["txn_expense"],
//             "txn_date": req["body"]["txn_date"],
//             "txn_bill_no": req["body"]["txn_bill_no"],
//             "txn_quantity": req["body"]["txn_quantity"],
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

// app.post('/updateStockCount', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;
//         let dbo = db.db("stepp_db");
//         dbo.collection("stock_available").find({
//             "model_number": req["body"]["model_number"],
//             "model_type": req["body"]["model_type"],
//             "model_size": req["body"]["model_size"],
//             "model_color": req["body"]["model_color"]            
//         }).toArray(function(err, result) {
//             if (err) throw err;
//             //Based on the select statement add/update the collection
//             if(result.length == 0) {
//                 //No entry is found and so add the model_number into "stock_available" collection
//                 dbo.collection("stock_available").insertOne({
//                     "model_number": req["body"]["model_number"],
//                     "model_type": req["body"]["model_type"],
//                     "model_size": req["body"]["model_size"],
//                     "model_color": req["body"]["model_color"],
//                     "available_count": req["body"]["update_count"]
//                 }, 
//                 function(err, result) {
//                     if (err) throw err;
//                     if(result["acknowledged"] == true) {
//                         res.json({"response": "Stock count updated for new entry!!"});
//                     }
//                     db.close();
//                 });
//             } else {
//                 //Entry found and so update the model_number into "stock_available" collection
//                 let updatedCount = 0;
//                 let availableCountOnDb = parseInt(result[0]["available_count"]);
//                 let updateType = req["body"]["update_type"];
//                 let updateCount = parseInt(req["body"]["update_count"]);
//                 if(updateType == "add") {
//                     updatedCount = availableCountOnDb + updateCount;
//                 } else {
//                     updatedCount = availableCountOnDb - updateCount;
//                 }
                
//                 dbo.collection("stock_available").findOneAndUpdate({
//                     "model_number": req["body"]["model_number"],
//                     "model_type": req["body"]["model_type"],
//                     "model_size": req["body"]["model_size"],
//                     "model_color": req["body"]["model_color"]
//                 }, {
//                     $set: {"available_count": updatedCount}
//                 },
//                 function(err, result) {
//                     if (err) throw err;
//                     res.json({"response": "Stock count updated for existing entry!!"});
//                     db.close();
//                 });
//             }
//         });
//     });
// });

// app.get('/getAvailableStocks', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock_available").find({}).toArray(function(err, result) {
//             if (err) throw err;
//             res.json({"response": result});
//             db.close();
//         });
//     });
// });

app.listen(3000, function () {
  console.log('Stepp app listening on port 3000!');
});