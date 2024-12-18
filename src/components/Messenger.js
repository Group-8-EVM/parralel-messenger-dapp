import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MessengerContract from './Messenger.json'; // Import the ABI

const MESSENGER_ADDRESS = '0xYourContractAddress'; // Replace with your contract address

const Messenger = () => {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [message, setMessage] = useState('');
    const [destination, setDestination] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const init = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MESSENGER_ADDRESS, MessengerContract.abi, signer);
            setProvider(provider);
            setContract(contract);
        };
        init();
    }, []);

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
    };

    const sendMessage = async () => {
        if (!contract) return;
        const tx = await contract.sendMessage(destination, message);
        await tx.wait();
        setMessage('');
        setDestination('');
        fetchMessages();
    };

    const fetchMessages = async () => {
        if (!contract) return;
        const messages = await contract.getMyMessages();
        setMessages(messages);
    };

    return (
        <div>
            <h1>Messenger DApp</h1>
            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <div>
                    <h2>Connected as: {account}</h2>
                    <input
                        type="text"
                        placeholder="Destination Address"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send Message</button>
                    <button onClick={fetchMessages}>Fetch My Messages</button>
                    <h3>My Messages:</h3>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>
                                From: {msg.src} | To: {msg.dst} | Message: {msg.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Messenger;