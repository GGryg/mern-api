const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const dbo = require('./../db/conn');
const productRoutes = express.Router();

productRoutes.route('/products').get((req, res) => {
    let dbConnect  = dbo.getDb('products');
    const {sort,...filters} = req.query;
    
    dbConnect
        .collection('products')
        .find(filters)
        .sort(sort)
        .toArray((err, result) => {
            if(err) throw err;
            res.json(result);
        });
});

productRoutes.route('/products').post(async(req, res) => {
    let dbConnect = dbo.getDb();
    const {name, price, desc, quantity} = req.body;
    const exists = await dbConnect
        .collection('products')
        .findOne({'name': name})
        .then((fi) => {
            return fi
        })

    if(exists){
        res.status(400).json('Product already exists');
        return;
    }

    dbConnect
        .collection('products')
        .insertOne({
            name: name,
            price: price,
            desc: desc,
            quantity: parseInt(quantity)
        }, (err, reuslt) =>{
            if(err) throw err;
            res.json('product added');
        });
});

productRoutes.route('/products/:id').put(async (req, res) => {
    const dbConnect = dbo.getDb();
    const queryId = {_id: ObjectId(req.params.id)};
    if(req.body.name !== undefined){
        const exists = await dbConnect
            .collection('products')
            .findOne({name: req.body.name})
            .then((fi) => {
                return fi
            })

        if(exists){
            res.status(400).json('Product already exists');
            return;
        }
    }
    const newValues = {
        $set: req.body,
    };
    dbConnect
        .collection('products')
        .updateOne(queryId, newValues, (err, result) => {
            if (err) throw err;
                console.log("1 document updated successfully");
            res.json(result);
    });
});

productRoutes.route('/products/:id').delete((req, res) => {
    const dbConnect = dbo.getDb();
    const queryId = {_id: ObjectId(req.params.id)};

    dbConnect
        .collection('products')
        .deleteOne(queryId, (err, result) => {
            if (err) throw err;
            console.log('Deleted 1 document');
            res.json(result);
        });
});

productRoutes.route('/products/report/:id').get((req, res) => {
    const dbConnect = dbo.getDb();
    const queryId = {_id: ObjectId(req.params.id)};

    const pipeline = [
        { 
            $match: queryId
        },
        {
            $project: 
            {
                name: 1,
                price: 1,
                quantity: 1,
                totalPrice: 
                { 
                    $multiply: [
                        {
                            $toDouble: "$price"
                        }, 
                        {
                            $toInt: "$quantity"
                        }
                    ]
                }
            }
        }
    ];
    
    dbConnect
        .collection('products')
        .aggregate(pipeline)
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

module.exports = productRoutes;