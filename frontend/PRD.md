# Product Requirement Document (PRD): Loan Management System Enhancement

## 1. Project Overview
A comprehensive Loan Management System designed to handle the end-to-end lifecycle of loans, from borrower onboarding and verification to loan disbursement, interest tracking, late fee calculation, and agent commission management.

## 2. User Roles & Access Control
The system will support four distinct roles:

### 2.1 Admin (Owner)
*   **Full System Access**: Manage all users, settings, and financial data.
*   **Approval Authority**: Verify borrowers, approve loan requests, and manage collateral.
*   **Financial Settings**: Set global interest rates, late fees, and grace periods.
*   **Reports**: View comprehensive reports on loans, agent commissions, and system performance.

### 2.2 Staff
*   **Operational Access**: Assist Admin in managing loans and verifying documents.
*   **Reminders**: Monitor the calendar for daily due payments and follow up with clients.
*   **Dashboard**: Access to loan lists, pending requests, and payment tracking.

### 2.3 Borrower (Client)
*   **Self-Service Portal**: Apply for loans, track payment schedules, and view loan status.
*   **Loan Selection**: Choose amount (1-12 months duration) and disbursement method (Cash/Wire).
*   **KYC/Collateral**: Upload ID scans and collateral photos for verification.
*   **Notifications**: Receive automated reminders for upcoming or late payments.

### 2.4 External Agent (Referral Partner)
*   **Referral Tracking**: Bring new clients to the system and track their loan status.
*   **Commission Management**: Earn a percentage (e.g., 1% from the borrower's 9% monthly payment).
*   **Payouts**: View earnings history and requested payouts.

---

## 3. Core Features & Functional Requirements

### 3.1 Authentication & Onboarding (KYC)
*   **Registration**: Borrower signs up with Name, Birthdate, Address, Phone, and Email.
*   **Verification**:
    *   **SMS/OTP**: Identity verification via Twilio.
    *   **Email**: Verification link via SendGrid/Aweber.
    *   **ID Scan**: Multi-image upload for identity documents.
*   **Admin Approval**: Borrowers cannot request loans until "Verified" by Admin.

### 3.2 Loan Request & Disbursement
*   **Loan Terms**: Borrower selects Amount, Duration (1-12 months), and provides a "Description" of why the loan is needed.
*   **Disbursement Methods**:
    1.  **Cash Delivery**:
        *   User provides delivery address.
        *   Contact method: WhatsApp.
        *   Fees: 2% Delivery Fee + 1% Initiation Fee.
    2.  **Wire Method**:
        *   User provides Bank Name, Account Number (CLABE), and Account Name.
        *   Fees: 2% Wire Fee + 1% Initiation Fee.

### 3.3 Interest & Payment Logic
*   **Interest Structure**: Monthly interest payments (e.g., standard 9%).
*   **Payment Calendar**: A visual calendar for Admin/Staff to see exactly who owes interest each day.
*   **Late Payment Engine**:
    *   **Grace Period**: Default 3 days (e.g., payment due on 10th → penalty starts after 13th).
    *   **Automation**: System counts "Late Days" and calculates "Extra Penalty %" automatically.
    *   **Visibility**: Real-time calculation visible on both Admin and Borrower dashboards.

### 3.4 Notifications (Reminders)
*   **Automatic SMS**: Triggered via Twilio API when payment is due or late.
*   **Automatic Email**: Sent via SendGrid/Aweber for payment reminders and receipts.

### 3.5 Collateral Management
*   **Upload**: Borrowers must upload clear pictures of collateral (property, assets, etc.).
*   **Evaluation**: Admin reviews and approves collateral value before loan disbursement.

### 3.6 Agent Commission System
*   **Referral Logic**: Agent links to a Borrower.
*   **Commission Split**: When borrower pays (e.g., 9% interest), the agent automatically earns their cut (e.g., 1%).
*   **Tracking**: Dedicated dashboard for agents to see monthly earnings.

### 3.7 Payment Network (Crypto)
*   **Network**: Integration/Support for **TRON (TRX)** for private transactions.
*   **Privacy**: Admin dashboard link to remain private/obscured where possible.

---

## 4. UI/UX Design Requirements

### 4.1 Navigation Structure (Implemented per Client Wireframe)

| Role | Menu Item | Purpose / Implemented Features |
| :--- | :--- | :--- |
| **Admin** | Dashboard | High-level summary of active loans and stats. |
| | Staff Management | View and manage staff accounts and permissions. |
| | Borrowers | Centralized view of all verified and pending borrowers. |
| | External Agents | Manage affiliate partners and referrers. |
| | Loan Management | Complete CRUD for loans and disbursement status. |
| | Payment Calendar | **(New)** Interactive tracker for daily collection dues. |
| | Commissions | Track automated referral cuts and agent payouts. |
| | Late Payments | (Defaults) Automated penalty and late-fee tracking. |
| | System Settings | Global interest rates, grace days, and KYC configs. |
| **Staff** | Dashboard | Daily operational overview for loan reviewers. |
| | Borrowers | Simplified access to client documents and verification. |
| | Loans | Direct management of loan batches and repayments. |
| | Calendar | Visual scheduler for payment follow-ups. |
| | Default Ledger | tracking and monitoring of late-paying borrowers. |
| | Search Borrower | Fast global search by NRC or Name. |
| **Borrower** | Dashboard | Active loan status, next payment amount, and due date. |
| | Apply for Loan | **Multi-step Form**: selects Cash/Wire and amount (1-12m). |
| | My Loans | Full history of disbursed and paid-off loans. |
| | Collateral Info | Image upload section for assets and ID verification. |
| | My Profile | Contact management and verified status badge. |
| **Agent** | Dashboard | Summary of referred clients and earnings history. |
| | My Clients | View status of referred borrowers (Verified/Pending). |
| | Commission | Real-time calculation of cuts from borrower interests. |
| | Payment History | Log of past commission payouts and earnings. |
| | My Profile | Management of payout bank details/crypto address. |

### 4.2 Key Pages
1.  **Calendar View**: Interactive UI showing daily payment dues.
2.  **Application Form**: Multi-step form for loan requests (Cash/Wire selection).
3.  **Collateral Slider**: Image gallery for Admin to review uploaded assets.
4.  **Penalty Calculator**: Visual breakdown for borrowers on how much extra they are paying if late.

---

## 5. Technical Stack
*   **Frontend**: React, Tailwind CSS, Lucide-React Icons.
*   **State**: React Context API (Auth, Theme).
*   **Router**: React Router Dom.
*   **APIs Integration**: Twilio (SMS), SendGrid (Email).
*   **Blockchain**: Tron (TRX) integration for payments.

---

## 6. Recent Implementation & Customizations (Antigravity Updates)

The following UI/UX and functional enhancements have been implemented to meet the latest client requirements:

### 6.1 Navigation & Layout Enhancements
*   **Sidebar Toggle Relocation**: The sidebar toggle button has been moved from the top navbar to the **Sidebar Top Section** for a cleaner desktop experience. 
*   **Mobile Visibility**: A dedicated "Menu" button remains in the Mobile Header to provide easy access to the sidebar drawer on small screens.
*   **Mobile Bottom Navigation Bar**: Implemented a "Mobile App Style" bottom navigation bar across all 4 roles (Admin, Staff, Borrower, Agent). This includes quick links to Dashboard, Clients, Loans, and Profile for one-handed operation.

### 6.2 Interactive Dashboard Logic
*   **Dynamic Status Badges**: "Active", "Pending", and "Paid" status badges in tables and cards are no longer static. They are now **interactive buttons** that cycle through statuses on click, simulating a real administrative workflow.
*   **Mock Response Engine**: 
    *   **Advanced Filter**: Clicking "Advanced Filter" triggers a mock system alert simulating the processing of referral segments.
    *   **Financial Download**: The "Download" icon in the Commission Tracker now simulates the compilation of a financial dossier (PDF/XLSX).
    *   **System Sync**: Added mock responses for historical synchronization and data export buttons.

### 6.3 Mobile Responsiveness Audit
*   **Stat Cards**: Optimized font sizes (`text-xl` to `text-3xl`) and paddings for small screens.
*   **Page Headers**: Improved layout for mobile, ensuring titles and action buttons stack correctly without clipping.
*   **Table Scrollers**: Added horizontal scrollers with `min-w` constraints to ensure financial tables remain readable on mobile without squishing data.
*   **Adaptive Hero Banners**: Padding and typography in hero sections now adapt dynamically to screen width.

### 6.4 Role-Specific Updates
*   **Agent Dashboard**: Fully functional search and status-toggling for referred clients.
*   **Commission Tracker**: Implemented localized filtering (Paid/Pending) via the metric cards and "Clear Filter" logic.
*   **Borrower Application**: Verified the multi-step loan flow (1-12 months duration) and Fee calculation display (2% + 1%).
