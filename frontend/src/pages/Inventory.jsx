// Inventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faX, faSearch, faPlus, faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import VideoCapture from "../components/VideoCapture";
import ImageCapture from "../components/ImageCapture";
import ImageUpload from "../components/ImageUpload"; // Import the new ImageUpload component
import '../css/Inventory.css';
import Nav from '../components/Nav';
import { toggleMode as helperToggleMode } from '../helpers';

function Inventory() {
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [isLightMode, setIsLightMode] = useState(() => {
        const savedMode = localStorage.getItem('isLightMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);
    const [deletedItem, setDeletedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [manualBarcode, setManualBarcode] = useState('');
    const [scannedPopup, setScannedPopup] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [productName, setProductName] = useState('');
    const [image, setProductImage] = useState('');
    const [fetched, setFetched] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false); // New state for handling image upload
    const navigate = useNavigate();

    const toggleMode = () => {
        helperToggleMode(isLightMode, setIsLightMode);
    };

    useEffect(() => {
        document.body.style.background = isLightMode ? "#fff" : "#000";
        document.body.style.color = isLightMode ? "#000" : "#fff";
    }, [isLightMode]);

    useEffect(() => {
        axios.get('https://smarterreceipt.onrender.com/api/v1/user/current_user', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setUser(response.data);
                    fetchInventory(response.data.InventoryId);
                } else {
                    navigate('/login');
                }
            })
            .catch(error => {
                navigate('/login');
            });
    }, [navigate]);

    const fetchInventory = (inventoryId) => {
        axios.get(`https://smarterreceipt.onrender.com/api/v1/inventory/get/${inventoryId}`, { withCredentials: true })
            .then(response => {
                setInventory(response.data.products);
            })
            .catch(error => {
                toast.error('Error fetching inventory');
                console.error('Error fetching inventory:', error);
            });
    };

    const fetchProductDetails = (barcode) => {
        setFetched(false); // Reset fetched state to allow fetching new product details
        axios.get(`https://smarterreceipt.onrender.com/api/v1/inventory/product_details/${barcode}`, { withCredentials: true })
            .then(response => {
                const { name, image } = response.data;
                setProductName(name);
                setProductImage(image);
                setFetched(true);
                setScannedPopup(true);
                setIsCameraOpen(false); // Close camera once the product details are fetched
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setIsUploadOpen(true); // Open the upload interface if product is not found
                    setScannedBarcode(barcode);
                    setIsCameraOpen(false);
                } else {
                    toast.error('Error fetching product details');
                    console.error('Error fetching product details:', error);
                }
            });
    };

    const handleBarcodeDetected = (barcode) => {
        setIsCameraOpen(false);
        fetchProductDetails(barcode);
    };

    const handleImageUpload = (imageUrl) => {
        setProductImage(imageUrl);
        console.log('Uploaded Image URL:', imageUrl);
    };

    const handleScannedEntrySubmit = () => {
        const product = {
            name: productName,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            image: image,
            barcode: scannedBarcode
        };
        setIsLoading(true);
        const submitButton = document.querySelector('.submit-inv-but');
        submitButton.disabled = true;
        axios.post('https://smarterreceipt.onrender.com/api/v1/inventory/addProduct', { product }, { withCredentials: true })
            .then(response => {
                fetchInventory(user.InventoryId);
                setIsLoading(false);
                submitButton.disabled = false;
                setScannedPopup(false);
                setIsUploadOpen(false); // Close the upload interface after submission
            })
            .catch(error => {
                toast.error('Error updating inventory');
                console.error('Error updating inventory:', error);
            });
    };

    const handleManualEntryClick = () => {
        setIsManualEntryOpen(true);
        setIsCameraOpen(false);
    };

    const handleManualEntrySubmit = () => {
        fetchProductDetails(manualBarcode);
        setIsManualEntryOpen(false);
    };

    const handleEditClick = (index, product) => {
        setCurrentItem(product);
        setCurrentIndex(index);
        setShowEditPopup(true);
    };

    const handleSaveClick = () => {
        axios.post('https://smarterreceipt.onrender.com/api/v1/inventory/update', {
            userId: user._id,
            index: currentIndex,
            name: currentItem.name,
            price: currentItem.price,
            quantity: currentItem.quantity,
            image: currentItem.image
        }, { withCredentials: true })
            .then(response => {
                setShowEditPopup(false);
                fetchInventory(user.InventoryId);
            })
            .catch(error => {
                toast.error('Error updating item');
                console.log('Error updating item', error);
            });
    };

    const handleDeleteClick = () => {
        const itemToDelete = inventory[currentIndex];
        setDeletedItem({ item: itemToDelete, index: currentIndex });

        axios.delete('https://smarterreceipt.onrender.com/api/v1/inventory/delete', {
            data: {
                userId: user._id,
                index: currentIndex
            },
            withCredentials: true
        })
            .then(response => {
                setShowEditPopup(false);
                fetchInventory(user.InventoryId);
                setShowNotification(true);
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            })
            .catch(error => {
                toast.error('Error deleting item');
                console.log('Error deleting item', error);
            });
    };

    const handleUndoClick = () => {
        if (deletedItem) {
            axios.post('https://smarterreceipt.onrender.com/api/v1/inventory/addProduct', {
                userId: user._id,
                product: deletedItem.item
            }, { withCredentials: true })
                .then(response => {
                    setDeletedItem(null);
                    fetchInventory(user.InventoryId);
                })
                .catch(error => {
                    toast.error('Error adding item');
                    console.log('Error adding item', error);
                });
        }
        setShowNotification(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchIconClick = () => {
        setIsSearchActive(true);
    };

    const handleSearchBlur = () => {
        setIsSearchActive(false);
    };

    const filteredInventory = inventory.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) {
        return null;
    }

    const handlePlusClick = () => {
        setIsCameraOpen(true);
        setResultMessage('');
    };

    const close = () => {
        setIsCameraOpen(false);
        setIsManualEntryOpen(false);
        setScannedPopup(false);
        setIsUploadOpen(false);
        setQuantity('');
        setPrice('');
        setProductName('');
        setProductImage('');
        setScannedBarcode('');
        setManualBarcode('');
    };

    return (
        <div>
            <Nav isLightMode={isLightMode} toggleMode={toggleMode} />
            <div className="inventory-container">
                <div className="inv-header">
                    <h1>Inventory</h1>
                    {isSearchActive ? (
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onBlur={handleSearchBlur}
                            autoFocus
                            className={`search-input ${isLightMode ? 'light' : 'dark'}`}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faSearch} onClick={handleSearchIconClick} style={{ fontSize: "24px" }} />
                    )}
                </div>
                <button onClick={handlePlusClick} className="plus-button"><FontAwesomeIcon icon={faPlus} /></button>
                {isCameraOpen && (
                    <div className="camera-container">
                        <div className="cam-flex">
                            <button className="close-button cam-close" onClick={close}><FontAwesomeIcon icon={faX} style={{ marginLeft: "2em" }} /></button>
                            <button className="manual-entry-button open-popup" onClick={handleManualEntryClick}>
                                <FontAwesomeIcon icon={faKeyboard} /></button>
                        </div>
                        <VideoCapture onBarcodeDetected={handleBarcodeDetected} />
                        <ImageCapture />
                    </div>
                )}
                {isUploadOpen && (
                    <div className="manual-entry-popup upload">
                        <button className="close-popup" onClick={close}><FontAwesomeIcon icon={faX} /></button>
                        <h1>Product Not Found - Upload Image</h1>
                        <ImageUpload onUpload={handleImageUpload} barcode={scannedBarcode} />
                    </div>
                )}
                {scannedPopup && (
                    <div className="manual-entry-popup">
                        <button className="close-popup" onClick={close}><FontAwesomeIcon icon={faX} /></button>
                        <h1 className={`name ${isLightMode ? 'light' : 'dark'}`}>{productName}</h1>
                        <img src={image} alt="product image" />
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter Price"
                            style={{ marginTop: "3em" }}
                        />
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter Quantity"
                        />
                        <button onClick={handleScannedEntrySubmit} className={`submit-inv-but ${isLoading ? "loading" : ""}`}>Submit</button>
                    </div>
                )}
                {isManualEntryOpen && (
                    <div className="manual-entry-popup">
                        <button className="close-popup" onClick={close}><FontAwesomeIcon icon={faX} /></button>
                        <input
                            type="text"
                            value={manualBarcode}
                            onChange={(e) => setManualBarcode(e.target.value)}
                            placeholder="Enter Barcode"
                            style={{ marginTop: "3em" }}
                        />
                        <button onClick={handleManualEntrySubmit}>Submit</button>
                    </div>
                )}
                <div className="inventory-list">
                    {filteredInventory.map((product, index) => (
                        <div key={product.name} className={`product-box ${isLightMode ? 'light' : 'dark'}`}>
                            <div className="product-data">
                                <img src={product.image} height={"100em"} width={"100em"} alt={product.name} />
                                <div className='name-image'>
                                    <h4>{product.name.length >= 30 ? product.name.substring(0, 27) + "..." : product.name}</h4>
                                    <div className="flex">
                                        <h4 className="red quant">{product.quantity} left</h4>
                                        <button className={`inv-edit-btn ${isLightMode ? 'light' : 'dark'}`}
                                                onClick={() => handleEditClick(index, product)}><FontAwesomeIcon
                                            icon={faPen} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showEditPopup && (
                <div className="inv-modal">
                    <div className={`inv-modal-content ${isLightMode ? 'light' : 'dark'}`}>
                        <div className="inv-modal-header">
                            <h2>Edit Item</h2>
                            <button className="inv-modal-close" onClick={() => setShowEditPopup(false)}><FontAwesomeIcon icon={faX} /></button>
                        </div>
                        <div className="inv-modal-body">
                            <label htmlFor="inv-price">Price</label>
                            <input type="number" id="inv-price" name="price" value={currentItem.price}
                                   onChange={handleInputChange} />
                            <label htmlFor="inv-quantity">Quantity</label>
                            <input type="number" id="inv-quantity" name="quantity" value={currentItem.quantity}
                                   onChange={handleInputChange} />
                        </div>
                        <div className="inv-modal-footer">
                            <button className={`inv-save-btn ${isLightMode ? 'light' : 'dark'}`}
                                    onClick={handleSaveClick}>Save
                            </button>
                            <button className={`inv-delete-btn ${isLightMode ? 'light' : 'dark'}`}
                                    onClick={handleDeleteClick}>Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNotification && (
                <div className="notification">
                    <p>Item deleted successfully</p>
                    <button onClick={handleUndoClick}>Undo</button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Inventory;
