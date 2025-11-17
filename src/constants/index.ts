export const LAPTOP_IMAGE_URL =
  "https://images.unsplash.com/photo-1590097520505-416422f07ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBwaXRjaCUyMGRlY2slMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU1MjQxMDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export interface StartupFormData {
  startupName: string;
  problem: string;
  audience: string;
  description: string;
  usp: string;
  email: string;
}

export const INITIAL_FORM_DATA: StartupFormData = {
  startupName: "",
  problem: "",
  audience: "",
  description: "",
  usp: "",
  email: "",
};

export const contractTemplates = [
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect confidential information",
    category: "Legal",
    downloads: 234,
    isPremium: false,
    previewContent: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] by and between [DISCLOSING_PARTY] ("Disclosing Party") and [RECEIVING_PARTY] ("Receiving Party").

WHEREAS, the Disclosing Party possesses certain confidential, proprietary, and trade secret information related to its business, operations, and future plans, which it desires to protect from unauthorized disclosure or use.

NOW, THEREFORE, the parties agree as follows:

Purpose
The Disclosing Party intends to share Confidential Information with the Receiving Party for the purpose of [PURPOSE].

Definition of Confidential Information
"Confidential Information" means all technical and non-technical information disclosed by the Disclosing Party, including but not limited to data, financial information, customer details, software, inventions, know-how, trade secrets, and documentation—whether disclosed orally, visually, or in written form.

Exclusions
Confidential Information does not include information that:
• Is or becomes public through no fault of the Receiving Party;
• Was already in the Receiving Party's possession prior to disclosure;
• Is independently developed by the Receiving Party without use of the Confidential Information; or
• Is rightfully obtained from a third party without restriction.

Obligations of the Receiving Party
The Receiving Party agrees to:
• Maintain confidentiality and use at least the same degree of care it uses for its own confidential materials;
• Not disclose any Confidential Information to third parties without prior written consent;
• Use the Confidential Information solely for the purpose stated above;
• Promptly notify the Disclosing Party of any unauthorized use or disclosure.

Return or Destruction
Upon termination of discussions or at the Disclosing Party's request, the Receiving Party shall return or destroy all Confidential Information and certify such destruction.

Term
This Agreement shall remain in effect for [DURATION] years from the date signed, and the obligations regarding confidentiality shall survive termination.

No License
Nothing in this Agreement grants the Receiving Party any ownership or license rights to the Confidential Information.

Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the State of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date written above.

Disclosing Party______________

Receiving Party______________`,
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "NDA with Partner Company",
        type: "text",
        tooltip: "Name for this contract",
        required: true,
      },
      {
        id: "disclosing_party",
        label: "Disclosing Party",
        placeholder: "Your Company Inc.",
        type: "text",
        tooltip: "The party sharing confidential information",
        required: true,
      },
      {
        id: "receiving_party",
        label: "Receiving Party",
        placeholder: "Partner Company LLC",
        type: "text",
        tooltip: "The party receiving confidential information",
        required: true,
      },
      {
        id: "date",
        label: "Agreement Date",
        placeholder: "January 1, 2025",
        type: "date",
        tooltip:
          "The date when this agreement becomes effective (auto-filled with today's date)",
        required: false,
        defaultValue: () => new Date().toISOString().split("T")[0],
      },
      {
        id: "purpose",
        label: "Purpose",
        placeholder:
          "business evaluation, partnership discussions, or project collaboration",
        type: "textarea",
        tooltip:
          "Describe why the information is being shared (optional - placeholder will be inserted if empty)",
        required: false,
      },
      {
        id: "duration",
        label: "Duration (years)",
        placeholder: "2",
        type: "text",
        tooltip: "How long the agreement remains in effect (default: 2)",
        required: false,
        defaultValue: "2",
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "California",
        type: "text",
        tooltip: "The state governing this agreement",
        required: true,
      },
    ],
  },
  {
    id: "founderAgreement",
    title: "Founder Agreement",
    description: "Define roles and equity splits",
    category: "Founding",
    downloads: 189,
    isPremium: false,
    previewContent: `FOUNDER AGREEMENT

This Founder Agreement ("Agreement") is entered into on [DATE] by and between the co-founders of [STARTUP_NAME], collectively referred to as "Founders."

WHEREAS, the Founders desire to formalize their relationship, define their roles, ownership, and rights, and prevent future misunderstandings.

Company Formation
The Founders agree to form a company under the name [COMPANY_NAME], engaged in the business of [BUSINESS_DESCRIPTION]. The company will be incorporated in the State of [JURISDICTION] as a [TYPE_OF_ENTITY].

Equity Ownership
Each Founder's ownership in the company shall be as follows:
• [FOUNDER_1_NAME] — [PERCENTAGE_1]%
• [FOUNDER_2_NAME] — [PERCENTAGE_2]%
• [FOUNDER_3_NAME] — [PERCENTAGE_3]%

No Founder shall transfer, sell, or assign their equity without first offering it to the other Founders.

Roles and Responsibilities
Each Founder agrees to take on the following initial responsibilities:
• [FOUNDER_1_NAME] — [ROLE_1]
• [FOUNDER_2_NAME] — [ROLE_2]
• [FOUNDER_3_NAME] — [ROLE_3]

Founders agree to devote their reasonable efforts and time to the success of the company.

Decision Making
Major decisions (e.g., fundraising, new product launches, hiring key executives) require approval from at least [DECISION_THRESHOLD]% of equity holders or unanimous consent, as determined by the Founders.

Intellectual Property
All intellectual property (IP) created by the Founders related to the company's operations shall be owned by the company. Each Founder hereby assigns all rights, title, and interest in such IP to the company.

Vesting Schedule
Each Founder's shares shall vest over a period of [VESTING_YEARS] years with a [CLIFF_MONTHS] month cliff. If a Founder leaves before the cliff, they forfeit all unvested shares.

Expenses and Reimbursements
Any expenses incurred on behalf of the company shall be reimbursed with proper documentation and approval by the other Founders.

Dispute Resolution
Any disputes arising under this Agreement shall be first resolved by mediation, and if unresolved, by binding arbitration under the laws of the State of [JURISDICTION].

IN WITNESS WHEREOF, the Founders have executed this Agreement as of the date written above.

Founder 1______________

Founder 2______________

Founder 3______________`,
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Founder Agreement - TechCo",
        type: "text",
        tooltip: "Name for this contract",
        required: true,
      },
      {
        id: "startup_name",
        label: "Startup Name",
        placeholder: "TechCo Inc.",
        type: "text",
        tooltip: "Your company's name",
        required: true,
      },
      {
        id: "founder_1_name",
        label: "Founder 1 Name",
        placeholder: "John Doe",
        type: "text",
        required: true,
      },
      {
        id: "founder_2_name",
        label: "Founder 2 Name",
        placeholder: "Jane Smith",
        type: "text",
        required: true,
      },
      {
        id: "percentage_1",
        label: "Founder 1 Equity %",
        placeholder: "50",
        type: "text",
        required: true,
      },
      {
        id: "percentage_2",
        label: "Founder 2 Equity %",
        placeholder: "50",
        type: "text",
        required: true,
      },
      {
        id: "vesting_years",
        label: "Vesting Years",
        placeholder: "4",
        type: "text",
        tooltip: "Standard is 4 years",
        required: true,
      },
      {
        id: "cliff_months",
        label: "Cliff Period (months)",
        placeholder: "12",
        type: "text",
        tooltip: "Period before first vesting occurs",
        required: true,
      },
      {
        id: "date",
        label: "Agreement Date",
        placeholder: "January 1, 2025",
        type: "date",
        tooltip: "Effective date of the agreement",
        required: false,
        defaultValue: () => new Date().toISOString().split("T")[0],
      },
      {
        id: "company_name",
        label: "Company Legal Name",
        placeholder: "TechCo Inc.",
        type: "text",
        tooltip: "Full legal entity name",
        required: false,
      },
      {
        id: "business_description",
        label: "Business Description",
        placeholder: "AI-powered productivity tools",
        type: "textarea",
        tooltip: "Brief description of your business",
        required: false,
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "Delaware",
        type: "text",
        tooltip: "State of incorporation",
        required: true,
      },
      {
        id: "type_of_entity",
        label: "Type of Entity",
        placeholder: "Delaware C-Corporation",
        type: "text",
        tooltip: "Legal structure (e.g., LLC, C-Corp)",
        required: false,
      },
      {
        id: "role_1",
        label: "Founder 1 Role & Duties",
        placeholder: "CEO - Product strategy, fundraising",
        type: "textarea",
        required: false,
      },
      {
        id: "role_2",
        label: "Founder 2 Role & Duties",
        placeholder: "CTO - Engineering, technical architecture",
        type: "textarea",
        required: false,
      },
      {
        id: "founder_3_name",
        label: "Founder 3 Name (Optional)",
        placeholder: "Leave blank if N/A",
        type: "text",
        required: false,
      },
      {
        id: "percentage_3",
        label: "Founder 3 Equity %",
        placeholder: "0",
        type: "text",
        required: false,
      },
      {
        id: "role_3",
        label: "Founder 3 Role & Duties",
        placeholder: "N/A",
        type: "textarea",
        required: false,
      },
      {
        id: "decision_threshold",
        label: "Decision Threshold %",
        placeholder: "51",
        type: "text",
        tooltip: "Percentage needed for major decisions",
        required: false,
      },
    ],
  },
  {
    id: "employmentContract",
    title: "Employment Contract",
    description: "Standard employee agreements",
    category: "HR",
    downloads: 156,
    isPremium: false,
    previewContent: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made effective as of [DATE] by and between [COMPANY_NAME] ("Employer") and [EMPLOYEE_NAME] ("Employee").

Position and Duties
The Employer hereby employs the Employee in the position of [JOB_TITLE]. The Employee agrees to perform all duties and responsibilities consistent with that role, including [KEY_RESPONSIBILITIES], and to follow the company's policies and code of conduct.

Term of Employment
The employment relationship will commence on [START_DATE] and will continue until terminated by either party in accordance with this Agreement.

Compensation
The Employee shall receive a salary of [SALARY_AMOUNT] per [PAY_PERIOD], payable [PAYMENT_FREQUENCY], subject to applicable deductions. Any bonuses or commissions will be at the discretion of the Employer.

Benefits
The Employee shall be entitled to [BENEFITS] as per the company's current benefits policy, which may include health insurance, paid leave, and remote work flexibility.

Working Hours and Location
The Employee is expected to work [HOURS_PER_WEEK] hours per week, primarily from [WORK_LOCATION], unless otherwise agreed in writing.

Confidentiality and Intellectual Property
The Employee agrees not to disclose any proprietary or confidential information. All work, inventions, designs, and materials produced during employment are the sole property of the Employer.

Termination
Either party may terminate this Agreement with [NOTICE_PERIOD] written notice. The Employer reserves the right to terminate immediately for misconduct, breach of duty, or gross negligence.

Non-Compete and Non-Solicitation
For [NON_COMPETE_DURATION] months after termination, the Employee shall not engage with competitors or solicit clients, employees, or contractors of the Employer.

Governing Law
This Agreement is governed by the laws of the State of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date written above.

Employer_________________

Employee______________`,
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Employment Agreement - John Doe",
        type: "text",
        tooltip: "Name for this contract",
        required: true,
      },
      {
        id: "employee_name",
        label: "Employee Name",
        placeholder: "John Doe",
        type: "text",
        required: true,
      },
      {
        id: "job_title",
        label: "Job Title",
        placeholder: "Senior Developer",
        type: "text",
        required: true,
      },
      {
        id: "start_date",
        label: "Start Date",
        placeholder: "February 1, 2025",
        type: "date",
        required: true,
      },
      {
        id: "salary_amount",
        label: "Salary Amount",
        placeholder: "$80,000",
        type: "text",
        required: true,
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "California",
        type: "text",
        tooltip: "The state governing this agreement",
        required: true,
      },
      {
        id: "date",
        label: "Agreement Date",
        placeholder: "January 1, 2025",
        type: "date",
        required: false,
        defaultValue: () => new Date().toISOString().split("T")[0],
      },
      {
        id: "company_name",
        label: "Company Name",
        placeholder: "Your Company Inc.",
        type: "text",
        required: false,
      },
      {
        id: "key_responsibilities",
        label: "Key Responsibilities",
        placeholder:
          "Develop and maintain software applications, collaborate with team",
        type: "textarea",
        required: false,
      },
      {
        id: "pay_period",
        label: "Pay Period",
        placeholder: "year",
        type: "text",
        tooltip: "year, month, etc.",
        required: false,
      },
      {
        id: "payment_frequency",
        label: "Payment Frequency",
        placeholder: "bi-weekly",
        type: "text",
        required: false,
      },
      {
        id: "benefits",
        label: "Benefits",
        placeholder: "Health insurance, 15 days PTO, stock options",
        type: "textarea",
        required: false,
      },
      {
        id: "hours_per_week",
        label: "Hours Per Week",
        placeholder: "40",
        type: "text",
        required: false,
      },
      {
        id: "work_location",
        label: "Work Location",
        placeholder: "Remote / 123 Main St",
        type: "text",
        required: false,
      },
      {
        id: "notice_period",
        label: "Notice Period",
        placeholder: "2 weeks",
        type: "text",
        required: false,
      },
      {
        id: "non_compete_duration",
        label: "Non-Compete Duration (months)",
        placeholder: "6",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "consultantAgreement",
    title: "Consultant Agreement",
    description: "Independent contractor terms",
    category: "Legal",
    downloads: 143,
    isPremium: false,
    previewContent: `CONSULTANT AGREEMENT

This Consultant Agreement ("Agreement") is entered into on [DATE] between [CLIENT_NAME] ("Client") and [CONSULTANT_NAME] ("Consultant").

WHEREAS, the Client desires to engage the Consultant for certain services, and the Consultant agrees to provide such services under the following terms.

Services
The Consultant agrees to provide professional services as described below:
[SERVICE_DESCRIPTION].

The Consultant shall perform the services with diligence, in a professional manner, and in accordance with industry standards.

Term
This Agreement begins on [START_DATE] and continues until [END_DATE] or completion of services, unless terminated earlier.

Compensation
The Client agrees to pay the Consultant [AMOUNT] per [PAYMENT_UNIT], payable [PAYMENT_TERMS]. Late payments may accrue interest at [INTEREST_RATE]% per month.

Expenses
The Consultant shall be reimbursed for reasonable pre-approved expenses incurred during service delivery, provided that receipts are submitted.

Independent Contractor
The Consultant is an independent contractor and not an employee of the Client. The Consultant is responsible for their own taxes, insurance, and benefits.

Confidentiality
The Consultant agrees to maintain strict confidentiality regarding all non-public information disclosed by the Client during the course of engagement.

Ownership of Work
All deliverables, documents, and materials created by the Consultant under this Agreement shall be the property of the Client upon full payment. The Consultant retains no rights to such materials.

Termination
Either party may terminate this Agreement with [NOTICE_PERIOD] written notice. The Client may terminate immediately for breach or non-performance.

Liability and Indemnity
The Consultant shall not be liable for indirect damages. The Consultant agrees to indemnify the Client for damages resulting from intentional misconduct or gross negligence.

Governing Law
This Agreement shall be governed by the laws of the State of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date written above.

Client _________

Consultant __________`,
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Consultant Agreement - Jane Doe",
        type: "text",
        tooltip: "Name for this contract",
        required: true,
      },
      {
        id: "consultant_name",
        label: "Consultant Name",
        placeholder: "Jane Doe",
        type: "text",
        tooltip: "The independent contractor",
        required: true,
      },
      {
        id: "service_description",
        label: "Service Description",
        placeholder: "Website design and development services",
        type: "textarea",
        tooltip: "Detail the scope of work",
        required: true,
      },
      {
        id: "amount",
        label: "Payment Amount",
        placeholder: "$5,000",
        type: "text",
        required: true,
      },
      {
        id: "payment_unit",
        label: "Payment Unit",
        placeholder: "project",
        type: "text",
        tooltip: "e.g., hour, project, month",
        required: true,
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "California",
        type: "text",
        tooltip: "The state governing this agreement",
        required: true,
      },
      {
        id: "date",
        label: "Agreement Date",
        placeholder: "January 1, 2025",
        type: "date",
        required: false,
        defaultValue: () => new Date().toISOString().split("T")[0],
      },
      {
        id: "client_name",
        label: "Client Name",
        placeholder: "Your Company Inc.",
        type: "text",
        tooltip: "The company hiring the consultant",
        required: false,
      },
      {
        id: "start_date",
        label: "Start Date",
        placeholder: "February 1, 2025",
        type: "date",
        required: false,
      },
      {
        id: "end_date",
        label: "End Date",
        placeholder: "May 31, 2025",
        type: "date",
        required: false,
      },
      {
        id: "payment_terms",
        label: "Payment Terms",
        placeholder: "Net 30 days",
        type: "text",
        tooltip: "When and how payment is due",
        required: false,
      },
      {
        id: "interest_rate",
        label: "Late Payment Interest Rate %",
        placeholder: "1.5",
        type: "text",
        required: false,
      },
      {
        id: "notice_period",
        label: "Notice Period",
        placeholder: "14 days",
        type: "text",
        required: false,
      },
    ],
  },
];
