<p align="center"><img src="https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/b30910a2ff086a02934967edaa4256d70671cce2/assets/logo.jpg" width="200" height="200" />

# 🌿 CNC DAO - MVP</p> 
### BUILD • EDUCATE • PRESERVE NATURE

**CNC DAO** is a purpose-driven organization focused on leveraging community power and blockchain technology to protect the environment. This project is a **Solana-based Web Application** that enables a transparent, human-verified pipeline for tree planting activities.

---

## 📌 Project Overview
The CNC DAO MVP provides a simplified, functional platform to prove that real-world environmental action can be verified, tracked, and tokenized on-chain.

**The 4 Non-Negotiables:**
1. **Tree Registry:** Anchoring data on the Solana blockchain.
2. **Tree NFT Minting:** 1 Verified Tree = 1 Digital Identity.
3. **Simple Verification:** The "Nature Heroes" human-validation system.
4. **Public Dashboard:** Global map visualization of planting activities.

---

## 🚀 Key Features

### 1. Tree Data Collection
Users can submit planting data with minimal friction.
* **Automated Data:** Precise GPS (Latitude/Longitude) and Timestamps are captured via device sensors.
* **Manual Input:** Tree Name, Height, and "Clean Picture" upload.
* **Project Types:** Supports Single Project or Combined Project submissions.

### 2. "Nature Heroes" Validation Logic
A robust consensus system to prevent fake data:
* **Human-in-the-Loop:** Requires a manual verification layer.
* **Consensus Rule:** Minimum of **2 independent validators** (Nature Heroes) must approve a submission.
* **Verification Flag:** Only once `verified = true` is set on-chain can the NFT be minted.

### 3. Solana NFT Integration
* **Digital Identity:** Each surviving tree is represented by an NFT.
* **Storage:** Metadata and images are stored using **IPFS** (Content Identification - CID).
* **Connection:** NFTs are linked to the Registry **PDA** (Program Derived Address).

### 4. Global Impact Map
* **Visualization:** Integration with a Map API to show tree locations and project distribution globally.
* **Transparency:** Real-time updates on activity density and verification status.

---

## 🛠 Technical Stack
* **Blockchain:** Solana (Anchor Framework)
* **Frontend:** Web Application (React/Next.js)
* **Storage:** IPFS (via Pinata or Web3.Storage)
* **Verification:** Manual Validator Portal + Sentinel Satellite API integration
* **Wallet:** Solana Wallet Standard (Phantom, Solflare, etc.)

---

## 📂 System Flow
1. **Register:** User uploads tree data (Photos + GPS). Data enters "Pending" state.
2. **Verify:** Two "Nature Heroes" review the submission. Satellite data (Sentinel) is referenced for accuracy.
3. **Anchor:** Upon 2nd approval, data is finalized on the Solana blockchain.
4. **Mint:** User receives the option to mint a unique Tree NFT.
5. **View:** The tree becomes a permanent pin on the Global Map.

---

## 💻 Development & Smart Contract Logic
The Solana Program utilizes **PDAs** to track consensus.

```rust
// Logic Summary
- TreeAccount: Stores metadata & validation_count.
- Validate Instruction: 
    - Checks if validator is whitelisted.
    - Ensures validator hasn't voted twice.
    - If count == 2, sets is_verified = true.
```

---

## 🚧 MVP Scope Control
**Included:**
* Proof of real-world tree → Validated → Recorded → Visualized → Tokenized.

**Excluded (Future Phases):**
* Complex tokenomics & Staking.
* DAO Governance/Voting.
* Automated AI Image Recognition.

---

## 🤝 Contributing
1. **Fork** the repository.
2. Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## ⚠️ Key Risks & Mitigations
* **Fake Data:** Controlled via 2-factor human validation.
* **UX Adoption:** Minimalist UI/UX focusing on "Register → Mint" with zero blockchain jargon.
* **On-Chain Cost:** Optimized via Solana's high-speed, low-fee architecture.

---
*Created with ❤️ by the CNC DAO Community.*
