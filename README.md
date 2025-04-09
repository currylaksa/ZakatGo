# ZakatGo: Transparent, Automated & Shariah-Compliant Giving Platform

![ZakatGo Banner](https://placehold.co/600x200?text=ZakatGo)

## 🌟 Overview

ZakatGo is a blockchain-powered platform revolutionizing Islamic charity through transparency, automation, and accessibility. Our solution addresses the core challenges in Zakat, Waqf, and Sadaqah management using smart contracts, decentralized ledgers, and user-centric design.

## 🚀 Key Features

- 🔒 **Zakat Auto-Calculator & Eligibility Engine** - Smart contracts verify if users must pay zakat and calculate exact amounts according to Shariah principles
- 📊 **Transparent Impact Dashboard** - Real-time visualization of donation flow with charts, maps, and progress tracking
- 📡 **GeoSadaqah** - Location-based suggestions for nearby verified causes (mosques, food banks, etc.)
- 🤖 **AI-Driven Priority Allocation** - Intelligent fund routing based on need classification (medical > food > education)
- 🌐 **DeFi-style Waqf Pool** - Investment opportunities for Waqf with returns directed to charity
- 👥 **Digital Impact Badges** - Gamified referral system with meaningful rewards for contributors
- 📱 **Unbanked-Friendly Onboarding** - QR codes and MyKad/National ID integration for inclusive access

## 💻 Tech Stack

- **Frontend:** React.js with Tailwind CSS
- **Blockchain:** Ethereum/Polygon testnet
- **Smart Contracts:** Solidity
- **Backend:** Node.js
- **Data Visualization:** Chart.js/Recharts

## 📋 Project Structure

```
zakatgo/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── contracts/      # Smart contract ABIs
│       ├── pages/          # Main application pages
│       └── utils/          # Utility functions
├── contracts/              # Solidity smart contracts
│   ├── Zakat.sol           # Zakat calculation and distribution
│   ├── Waqf.sol            # Waqf management contracts
│   └── Sadaqah.sol         # Sadaqah distribution logic
├── server/                 # Backend Node.js application
├── scripts/                # Deployment and testing scripts
└── test/                   # Contract and application tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or similar Web3 wallet
- Truffle/Hardhat (for development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/zakatgo.git
   cd zakatgo
   ```

2. Install frontend dependencies
   ```bash
   cd client
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd ../server
   npm install
   ```

4. Install contract development tools
   ```bash
   npm install -g truffle
   ```

5. Start the development server
   ```bash
   # Terminal 1 - Frontend
   cd client
   npm start
   
   # Terminal 2 - Backend
   cd server
   npm run dev
   
   # Terminal 3 - Local blockchain (if needed)
   cd ..
   truffle develop
   ```

## 🖼️ Screenshots

![Dashboard](https://placehold.co/800x450?text=ZakatGo+Dashboard)
![Zakat Calculator](https://placehold.co/800x450?text=Zakat+Calculator)
![Impact Tracking](https://placehold.co/800x450?text=Impact+Visualization)

## 🛣️ Roadmap

- [x] Initial concept and UMHackathon prototype
- [ ] Testnet deployment with core smart contracts
- [ ] Beta release with limited user group
- [ ] Mobile application development
- [ ] Partner integration with local Zakat authorities
- [ ] Mainnet launch and full rollout

## 👥 Team

ZakatGo is developed by team **Oversized Minions** during the UMHackathon 2025 organized by Securities Commission Malaysia.

## 🤝 Contributing

We welcome contributions to ZakatGo! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or suggestions, please open an issue or contact us at [email@example.com](mailto:email@example.com).

---

*ZakatGo - Redefining the way charity works.*
