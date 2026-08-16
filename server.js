const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/*
    Temporary order storage

    NOTE:
    Server restart cheythal orders clear aakum.
    Permanent database pinne add cheyyam.
*/
let orders = [];


// ==========================================
// CREATE ORDER
// ==========================================

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
                success: false,
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

                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                email: customer.email || "",
                phone: customer.phone || ""

            },

            address: {

                address: address.address || "",
                city: address.city || "",
                pincode: address.pincode || "",
                state: address.state || ""

            },

            product: {

                name: product.name || "",
                brand: product.brand || "",
                price: Number(product.price) || 0,
                image: product.image || ""

            },

            size: size || "",

            quantity:
                Number(quantity) || 1,

            amount:
                Number(amount),

            paymentStatus:
                "Pending",

            paymentMethod:
                "",

            orderStatus:
                "Order Created",

            createdAt:
                new Date().toISOString()

        };


        orders.push(order);


        console.log(
            "New order created:",
            order.orderId
        );


        res.status(201).json({

            success: true,

            orderId:
                order.orderId,

            amount:
                order.amount,

            paymentStatus:
                order.paymentStatus,

            orderStatus:
                order.orderStatus

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Unable to create order"

        });

    }

});


// ==========================================
// GET ALL ORDERS
// ==========================================

app.get("/api/orders", (req, res) => {

    res.json({

        success: true,

        orders: orders

    });

});


// ==========================================
// GET SINGLE ORDER
// ==========================================

app.get("/api/orders/:orderId", (req, res) => {

    const order =
        orders.find(
            o =>
                o.orderId ===
                req.params.orderId
        );


    if (!order) {

        return res.status(404).json({

            success: false,

            message:
                "Order not found"

        });

    }


    res.json({

        success: true,

        order: order

    });

});


// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================

app.put(
    "/api/orders/:orderId/payment",
    (req, res) => {

        const order =
            orders.find(
                o =>
                    o.orderId ===
                    req.params.orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }


        order.paymentStatus =
            req.body.paymentStatus ||
            "Paid";


        order.paymentMethod =
            req.body.paymentMethod ||
            "";


        order.orderStatus =
            "Order Placed";


        res.json({

            success: true,

            order: order

        });

    }
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `SOLEVAULT server running at http://localhost:${PORT}`
    );

});
