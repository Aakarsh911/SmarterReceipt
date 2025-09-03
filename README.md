# SmarterReceipt 🧾

**SmarterReceipt** is a comprehensive point-of-sale (POS) and inventory management system designed for small to medium-sized retail businesses. It streamlines inventory tracking, sales management, and payment processing through an intuitive web interface with powerful features like barcode scanning and UPI payment integration.

## 🌟 Key Features

### 📦 Inventory Management
- **Add Products**: Scan barcodes or manually enter product details
- **Real-time Stock Tracking**: Monitor product quantities and receive low-stock alerts
- **Product Database**: Automatic product information fetching via barcode scanning
- **Restock Alerts**: Get notified when products need to be restocked (≤5 items)

### 💰 Sales & Transactions
- **Order Processing**: Create new orders with barcode scanning for quick product addition
- **Sales Analytics**: Monthly sales tracking with visual charts and statistics
- **Transaction History**: Complete record of all sales transactions
- **Receipt Generation**: Smart digital receipts for customers

### 💳 Payment Integration
- **UPI QR Codes**: Generate dynamic QR codes for UPI payments
- **Multiple Payment Methods**: Support for various payment options
- **Real-time Payment Tracking**: Monitor payment status and confirmations

### 📊 Business Intelligence
- **Sales Dashboard**: Visual representation of sales data and trends
- **Monthly Analytics**: Track performance with detailed monthly breakdowns
- **Shop Statistics**: Comprehensive overview of business metrics

### 🔒 User Management
- **Google OAuth Integration**: Secure authentication via Google accounts
- **Shop Profile Management**: Customize shop name and UPI details
- **Multi-user Support**: Support for multiple shop owners

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router** - Client-side routing
- **Chart.js** - Data visualization and analytics
- **Axios** - HTTP client for API communication
- **Dynamsoft Libraries** - Professional barcode scanning
- **QRCode.react** - QR code generation
- **FontAwesome** - Icons and UI elements

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Social authentication
- **CORS** - Cross-origin resource sharing
- **Express Session** - Session management

### Development Tools
- **Create React App** - Frontend build tooling
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** database
- **Google OAuth credentials** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aakarsh911/SmarterReceipt.git
   cd SmarterReceipt
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   backend_url=http://localhost:8000
   frontend_url=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   ```

2. **Frontend Environment Variables**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   backend_url=http://localhost:8000
   ```

3. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:8000/api/v1/auth/google/callback` (development)
     - `https://yourdomain.com/api/v1/auth/google/callback` (production)

4. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database for the application
   - Update the connection string in your `.env` file

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-restart
   npx nodemon server.js
   ```
   The backend will run on `http://localhost:8000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`
   - Sign in with your Google account
   - Set up your shop name and UPI ID
   - Start managing your inventory and sales!

## 📱 Usage Guide

### First Time Setup
1. **Sign in** with your Google account
2. **Enter shop details** - shop name and UPI ID for payments
3. **Add products** to your inventory using barcode scanning or manual entry
4. **Configure payment settings** with your UPI details

### Daily Operations
1. **Create New Orders**
   - Navigate to "New Order"
   - Scan product barcodes or search manually
   - Add quantities and generate receipts

2. **Manage Inventory**
   - Add new products via barcode scanning
   - Monitor stock levels and restock alerts
   - Update product information and pricing

3. **Process Payments**
   - Generate UPI QR codes for customer payments
   - Track payment confirmations
   - Maintain transaction records

4. **Monitor Business Performance**
   - View sales dashboard for daily/monthly analytics
   - Track best-selling products
   - Analyze sales trends and patterns

### Key Navigation
- **Home** - Dashboard with sales statistics and shop overview
- **New Order** - Create and process customer orders
- **Inventory** - Manage products and stock levels
- **Transactions** - View complete transaction history
- **Account** - Manage shop settings and profile
- **QR** - Generate UPI payment QR codes

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/google/callback` - OAuth callback
- `POST /api/v1/auth/logout` - User logout

### User Management
- `GET /api/v1/user/current_user` - Get current user info
- `POST /api/v1/user/addShopName` - Add/update shop details

### Inventory Management
- `GET /api/v1/inventory/products` - Get all products
- `POST /api/v1/inventory/addProduct` - Add new product
- `POST /api/v1/inventory/update` - Update product quantities
- `GET /api/v1/inventory/product_details/:barcode` - Get product by barcode
- `GET /api/v1/inventory/products_to_restock` - Get low-stock products

### Sales & Analytics
- `GET /api/v1/inventory/monthly-sales/:userId` - Get monthly sales data
- `GET /api/v1/inventory/transactions` - Get transaction history
- `POST /api/v1/inventory/transactions` - Create new transaction

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Dynamsoft** for providing powerful barcode scanning capabilities
- **Google** for OAuth authentication services
- **MongoDB** for flexible database solutions
- **React** and **Node.js** communities for excellent documentation and support

## 📞 Support

For support, email: [support@smarterreceipt.com](mailto:support@smarterreceipt.com)

## 🌐 Live Demo

Check out the live application: [SmarterReceipt](https://smarter-receipt.vercel.app)

---

**Built with ❤️ for small business owners**