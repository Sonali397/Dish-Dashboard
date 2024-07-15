import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./dish-dash.css";

const socket = io('http://localhost:3000');

function App() {
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        fetchDishes();

        socket.on('update', () => {
            fetchDishes();
        });

        return () => {
            socket.off('update');
        };
    }, []);

    const fetchDishes = async () => {
        const response = await axios.get('http://localhost:3000/dishes'); 
        setDishes(response.data);
    };

    const togglePublish = async (id, isPublished) => {
        try {
            console.log(`Toggling publish status for dish ID: ${id}, current status: ${isPublished}`);
            const response = await axios.patch(`http://localhost:3000/dishes/${id}`, { 
                isPublished: !isPublished 
            });
            console.log('Response from server:', response.data);
            fetchDishes();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    return (
        <div className="App">
            <h1>DISH DASHBOARD</h1>
            <ul>
                {dishes.map(dish => (
                    <li key={dish.dishId}>
                        <img src={dish.imageUrl} alt={dish.dishName} height="100" width="100" />
                        <h2>{dish.dishName}</h2>
                        <p>{dish.isPublished ? 'PUBLISHED !' : 'UNPUBLISHED !'}</p>
                        <button onClick={() => togglePublish(dish.dishId, dish.isPublished)}>
                            {dish.isPublished ? 'UNPUBLISHED' : 'PUBLISHED'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        
    );

}

export default App;
