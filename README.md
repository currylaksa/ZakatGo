# ZakatGo - One-Stop Zakat Payment Platform with Blockchain & AI Integration

![ZakatGo Logo](https://via.placeholder.com/200x100?text=ZakatGo)

## Overview

ZakatGo is a transparent, automated, and Shariah-compliant Zakat platform that leverages blockchain technology and AI to simplify the Zakat payment process. Our solution addresses key challenges in the current Zakat management system, including lack of transparency, inefficiency, limited accessibility, and inadequate feedback to donors.

## Problem Statement

In Malaysia, the Zakat payment process faces several challenges:

- **Lack of Transparency**: Donors often don't know how their contributions are being distributed
- **Inefficiency**: Manual calculation and distribution processes are time-consuming and error-prone
- **Limited Access**: Many unbanked or rural individuals are excluded due to lack of accessible donation methods
- **Inadequate Feedback**: Donors lack clear and timely feedback on how their contributions are being used

## Our Solution

ZakatGo streamlines the entire Zakat payment process with innovative features:

### Key Features

- **AI-Powered Zakat Auto-Calculator**: Automatically calculates Zakat based on uploaded documents like payslips
- **Blockchain Integration**: Ensures transparent, real-time tracking of donations through secure, immutable records
- **Donation Categorization**: Users can select from the 8 categories for Zakat distribution (Fuqara, Masakin, Amil Zakat, etc.)
- **Unbanked-Friendly Onboarding**: QR codes and National ID recognition for users without bank accounts
- **Cryptocurrency Payment**: Users can deposit in Malaysian Ringgit (RM), convert to ETH, and make blockchain payments
- **NGO Campaign Management**: NGOs can submit and manage donation campaigns
- **Geofencing-Based Sadaqah Suggestions**: AI-driven suggestions for nearby verified causes
- **Impact Dashboard**: Real-time tracking of donation impact with visualizations

## Technology Stack

- **Frontend**: React + Tailwind CSS
- **Blockchain**: Ethereum/Polygon testnet
- **Smart Contracts**: Solidity for automated fund distribution
- **Machine Learning**: AI for document processing and Zakat calculation
- **Backend**: Node.js
- **Data Visualization**: Chart.js/Recharts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or similar Web3 provider
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/zakatgo.git
   cd zakatgo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file to add your API keys and configuration details.

4. Start the development server:
   ```
   npm start
   ```

5. The application should now be running at `http://localhost:3000`

## System Flow

1. **Homepage**: Introduction to the platform with navigation to key features
2. **Zakat Calculator**:
   - Upload documents (payslips, etc.)
   - AI processes and extracts relevant data
   - Review and complete information
   - Get calculated Zakat amount
   - Select donation categories
   - Make payment through blockchain
3. **Donation Campaigns**: Browse and donate to NGO campaigns
4. **Impact Dashboard**: Track donation impact and history
5. **User Profile**: Manage personal information and view transaction history

## Smart Contract Integration

ZakatGo uses Ethereum/Polygon-based smart contracts to ensure transparency and automated distribution:

1. Funds are received through smart contracts
2. Distribution is automated based on selected categories
3. All transactions are recorded on the blockchain for full transparency
4. Users can track their donations in real-time

## Contributing

We welcome contributions to ZakatGo! Please check our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UMHackathon 2025
- Securities Commission Malaysia
- Team Oversized Minions

## Contact

For questions or support, please contact us at support@zakatgo.com or open an issue in this repository.
