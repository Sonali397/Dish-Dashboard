// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001", // your client URL
        methods: ["GET", "POST", "PATCH"]
    }
});

app.use(cors({
    origin: "http://localhost:3001" // your client URL
}));

app.use(express.json());

let dishes = [
    {
        dishName: "Jeera Rice",
        dishId: "1",
        imageUrl: "https://nosh-assignment.s3.ap-south-1.amazonaws.com/jeera-rice.jpg",
        isPublished: true
    },
    {
        dishName: "Paneer Tikka",
        dishId: "2",
        imageUrl: "https://nosh-assignment.s3.ap-south-1.amazonaws.com/paneer-tikka.jpg",
        isPublished: true
    },
    {
        dishName: "Rabdi",
        dishId: "3",
        imageUrl: "https://nosh-assignment.s3.ap-south-1.amazonaws.com/rabdi.jpg",
        isPublished: true
    },
    {
        dishName: "Chicken Biryani",
        dishId: "4",
        imageUrl: "https://nosh-assignment.s3.ap-south-1.amazonaws.com/chicken-biryani.jpg",
        isPublished: true
    },
    {
        dishName: "Alfredo Pasta",
        dishId: "5",
        imageUrl: "https://nosh-assignment.s3.ap-south-1.amazonaws.com/alfredo-pasta.jpg",
        isPublished: true
    }
];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/dishes', (req, res) => {
    res.json(dishes);
});

app.patch('/dishes/:id', (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;

    console.log(`Toggling publish status for dish ID: ${id}`);

    const dish = dishes.find(dish => dish.dishId === id);
    if (dish) {
        dish.isPublished = isPublished;
        io.emit('update');
        res.status(200).json(dish);
    } else {
        console.error(`Dish with ID ${id} not found`);
        res.status(404).json({ message: 'Dish not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
