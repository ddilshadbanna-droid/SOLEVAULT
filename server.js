const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


// Serve your website files
app.use(express.static(__dirname));


// Temporary order storage
let orders = [];


// ===============================
// CREATE ORDER
// ===============================

app.post("/api/orders", (req, res) => {

    try {

        const {
            customer,
            address,
            product,
            size,
            quantity,
            amount
        } = req.body;


        if (
            !customer ||
            !address ||
            !product ||
            !amount
        ) {

            return res.status(400).json({
                message: "Missing order information"
            });

        }


        // Generate Order ID

        const today = new Date();

        const date =
            today.getFullYear() +
            String(today.getMonth() + 1).padStart(2, "0") +
            String(today.getDate()).padStart(2, "0");


        const randomNumber =
            Math.floor(100 + Math.random() * 900);


        const orderId =
            "SV" +
            date +
            "-" +
            randomNumber;


        // Create order

        const order = {

            orderId: orderId,

            customer: {
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone
            },

            address: {
                address: address.address,
                city: address.city,
                pincode: address.pincode,
                state: address.state
            },

            product: product,

            size: size || "",

            quantity: quantity || 1,

            amount: Number(amount),

            paymentStatus: "Pending",

            orderStatus: "Order Created",

            createdAt: new Date().toISOString()

        };


        orders.push(order);


        res.status(201).json({

            success: true,

            orderId: order.orderId,

            amount: order.amount,

            paymentStatus: order.paymentStatus,

            orderStatus: order.orderStatus

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to create order"

        });

    }

});


// ===============================
// GET ORDER
// ===============================

app.get("/api/orders/:orderId", (req, res) => {

    const order = orders.find(
        o => o.orderId === req.params.orderId
    );


    if (!order) {

        return res.status(404).json({

            success: false,

            message: "Order not found"

        });

    }


    res.json({

        success: true,

        order: order

    });

});


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `SOLEVAULT server running at http://localhost:${PORT}`
    );

});