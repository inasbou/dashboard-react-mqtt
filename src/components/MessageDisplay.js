import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { LineChart } from '@mui/x-charts/LineChart';
import { UilTruck, UilCar, UilBus } from "@iconscout/react-unicons";
import './MessageDisplay.css'; // Import CSS file for styling

const MessageDisplay = () => {
    // MQTT broker URL
    const brokerUrl = 'mqtt://mosquitto.org:1883';

    // Topics to subscribe to
    const topics = ['ESI/ICS/CARS', 'ESI/ICS/TRUCKS', 'ESI/ICS/BUSES'];

    // State to store MQTT data for each type
    const [carsData, setCarsData] = useState([]);
    const [tracksData, setTracksData] = useState([]);
    const [busesData, setBusesData] = useState([]);
    const [lastCarData, setLastCarData] = useState(0);
    const [lastTrackData, setLastTrackData] = useState(0);
    const [lastBusData, setLastBusData] = useState(0);

    // Connect to MQTT broker
    useEffect(() => {
        const client = mqtt.connect(brokerUrl);

        // Handle connection event
        client.on('connect', () => {
            console.log('Connected to MQTT broker');

            // Subscribe to topics
            topics.forEach(topic => {
                client.subscribe(topic, (err) => {
                    if (err) {
                        console.error('Error subscribing to topic:', err);
                    } else {
                        console.log('Subscribed to topic:', topic);
                    }
                });
            });
        });

        // Handle incoming messages
        client.on('message', (topic, message) => {
            console.log(`Received message from topic ${topic}: ${message.toString()}`);

            // Update state with received message based on topic
            switch (topic) {
                case 'ESI/ICS/CARS':
                    setCarsData(prevData => [...prevData, parseFloat(message.toString())]);
                    setLastCarData(parseFloat(message.toString()));
                    break;
                case 'ESI/ICS/TRUCKS':
                    setTracksData(prevData => [...prevData, parseFloat(message.toString())]);
                    setLastTrackData(parseFloat(message.toString()));
                    break;
                case 'ESI/ICS/BUSES':
                    setBusesData(prevData => [...prevData, parseFloat(message.toString())]);
                    setLastBusData(parseFloat(message.toString()));
                    break;
                default:
                    break;
            }
        });

        // Handle error event
        client.on('error', (err) => {
            console.error('Error connecting to MQTT broker:', err);
        });

        // Clean up when component unmounts
        return () => {
            client.end();
        };
    }, []);

    return (
        <div className="main">
            <p className='title'>My dashboard</p>
        <div className="container">
            
            <div className="cards-container">
                <div className="card" style={{ backgroundColor: '#8CACD3' }}>
                    <h2>Cars</h2>
                    <div className="card-content">
                        <UilCar size="80" />
                        <h4>Last Received: {lastCarData}</h4>
                    </div>
                </div>
                <div className="card" style={{ backgroundColor: '#A9CEF4' }}>
                    <h2>Tracks</h2>
                    <div className="card-content">
                        <UilTruck size="80" />
                        <h4>Last Received: {lastTrackData}</h4>
                    </div>
                </div>
                <div className="card" style={{ backgroundColor: '#B1BAC7' }}>
                    <h2>Buses</h2>
                    <div className="card-content">
                        <UilBus size="80" />
                        <h4>Last Received: {lastBusData}</h4>
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <div className="chart-wrapper">
                    <h2>vehicules Chart</h2>
                    <div className="chart" style={{ border: '1px solid #ccc' }}>
                        <LineChart
                            xAxis={[{ data: carsData.map((_, index) => index + 1) }]}
                            series={[
                                { data: carsData, label: 'Cars', color: '#8CACD3' },
                                { data: tracksData, label: 'Trucks', color: '#A9CEF4' },
                                { data: busesData, label: 'Buses', color: '#B1BAC7' }
                            ]}
                            width={800}
                            height={400}
                        />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default MessageDisplay;
