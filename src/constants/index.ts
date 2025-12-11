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
    title: {
      en: "Non-Disclosure Agreement (NDA)",
      alb: "Marrëveshje Jo-Publikimi (NDA)",
    },
    description: {
      en: "Protect confidential information",
      alb: "Mbroj informacionin konfidencial",
    },
    category: {
      en: "Legal",
      alb: "Ligjor",
    },
    downloads: 234,
    isPremium: false,
    previewContent: {
      en: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [DATE] by and between [DISCLOSING_PARTY] ("Disclosing Party") and [RECEIVING_PARTY] ("Receiving Party").

WHEREAS, the Disclosing Party possesses certain confidential, proprietary, and trade secret information related to its business, operations, and future plans, which it desires to protect from unauthorized disclosure or use.

NOW, THEREFORE, the parties agree as follows:

<strong>Purpose</strong>

The Disclosing Party intends to share Confidential Information with the Receiving Party for the purpose of [PURPOSE].

<strong>Definition of Confidential Information</strong>

"Confidential Information" means all technical and non-technical information disclosed by the Disclosing Party, including but not limited to data, financial information, customer details, software, inventions, know-how, trade secrets, and documentation—whether disclosed orally, visually, or in written form.

<strong>Exclusions</strong>

Confidential Information does not include information that:
• Is or becomes public through no fault of the Receiving Party;
• Was already in the Receiving Party's possession prior to disclosure;
• Is independently developed by the Receiving Party without use of the Confidential Information; or
• Is rightfully obtained from a third party without restriction.

<strong>Obligations of the Receiving Party</strong>

The Receiving Party agrees to:
• Maintain confidentiality and use at least the same degree of care it uses for its own confidential materials;
• Not disclose any Confidential Information to third parties without prior written consent;
• Use the Confidential Information solely for the purpose stated above;
• Promptly notify the Disclosing Party of any unauthorized use or disclosure.

<strong>Return or Destruction</strong>

Upon termination of discussions or at the Disclosing Party's request, the Receiving Party shall return or destroy all Confidential Information and certify such destruction.

<strong>Term</strong>

This Agreement shall remain in effect for [DURATION] years from the date signed, and the obligations regarding confidentiality shall survive termination.

<strong>No License</strong>

Nothing in this Agreement grants the Receiving Party any ownership or license rights to the Confidential Information.

<strong>Governing Law</strong>

This Agreement shall be governed by and construed in accordance with the laws of the State of [JURISDICTION].`,
      alb: `MARRËVESHJE JO-PUBLIKIMI

Kjo Marrëveshje jo-publikimi ("Marrëveshja") lidhet më [DATE] midis [DISCLOSING_PARTY] ("Palës që Zbulon") dhe [RECEIVING_PARTY] ("Palës që Merr").

DUKE PARASUPOZUAR që Palë që Zbulon zotëron informacion të caktuar konfidencial, pronësor dhe sekret tregtar në lidhje me biznesin, operacionet dhe planet e saj të ardhshme, të cilat dëshiron t'i mbrojë nga zbulimi ose përdorimi i paautorizuar.

PRANDAJ, palët bien në marrëveshje si më poshtë:

<strong>Qëllimi</strong>

Palë që Zbulon synon të ndajë Informacionin Konfidencial me Palën që Merr për qëllimin e [PURPOSE].

<strong>Përkufizimi i Informacionit Konfidencial</strong>

"Informacioni Konfidencial" nënkupton të gjithë informacionin teknik dhe jo-teknik të zbuluar nga Palë që Zbulon, duke përfshirë por pa u kufizuar në të dhëna, informacion financiar, detaje klientësh, softuer, shpikje, know-how, sekrete tregtare dhe dokumentacion—qoftë i zbuluar me gojë, vizualisht ose në formë të shkruar.

<strong>Përjashtimet</strong>

Informacioni Konfidencial nuk përfshin informacion që:
• Është ose bëhet publik pa faj të Palës që Merr;
• Ishte tashmë në zotërimin e Palës që Merr para zbulimit;
• Është i zhvilluar në mënyrë të pavarur nga Palë që Merr pa përdorimin e Informacionit Konfidencial; ose
• Është i marrë në mënyrë të ligjshme nga një palë e tretë pa kufizime.

<strong>Detyrimet e Palës që Merr</strong>

Palë që Merr bie në marrëveshje të:
• Mbajë konfidencialitetin dhe të përdorë të paktën të njëjtën shkallë kujdesi që përdor për materialet e veta konfidenciale;
• Të mos zbulojë asnjë Informacion Konfidencial për palë të treta pa pëlqimin paraprak me shkrim;
• Të përdorë Informacionin Konfidencial vetëm për qëllimin e përmendur më sipër;
• Të njoftojë menjëherë Palën që Zbulon për çdo përdorim ose zbulim të paautorizuar.

<strong>Kthimi ose Shkatërrimi</strong>

Pas përfundimit të diskutimeve ose me kërkesën e Palës që Zbulon, Palë që Merr duhet të kthejë ose të shkatërrojë të gjithë Informacionin Konfidencial dhe të certifikojë një shkatërrim të tillë.

<strong>Afati</strong>

Kjo Marrëveshje do të mbetet në fuqi për [DURATION] vjet nga data e nënshkruar, dhe detyrimet në lidhje me konfidencialitetin do të mbijetojnë pas përfundimit.

<strong>Asnjë Licencë</strong>

Asgjë në këtë Marrëveshje nuk i jep Palës që Merr asnjë të drejtë pronësie ose licencë për Informacionin Konfidencial.

<strong>Ligji Zbatues</strong>

Kjo Marrëveshje do të rregullohet dhe interpretohet në përputhje me ligjet e Shtetit të [JURISDICTION].`,
    },
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "NDA with Partner Company",
        type: "text",
        required: true,
      },
      {
        id: "disclosing_party",
        label: "Disclosing Party",
        placeholder: "Your Company Inc.",
        type: "text",
        required: true,
      },
      {
        id: "receiving_party",
        label: "Receiving Party",
        placeholder: "Partner Company LLC",
        type: "text",
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
        id: "purpose",
        label: "Purpose",
        placeholder:
          "business evaluation, partnership discussions, or project collaboration",
        type: "textarea",
        required: false,
      },
      {
        id: "duration",
        label: "Duration (years)",
        placeholder: "2",
        type: "text",
        required: false,
        defaultValue: "2",
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "California",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "founderAgreement",
    title: {
      en: "Founder Agreement",
      alb: "Marrëveshja e Partnerëve",
    },
    description: {
      en: "Define roles and equity splits",
      alb: "Përcakto rolet dhe ndarjen e aksioneve",
    },
    category: {
      en: "Founding",
      alb: "Krijimi i Kompanisë",
    },
    downloads: 189,
    isPremium: false,
    previewContent: {
      en: `FOUNDER AGREEMENT

This Founder Agreement ("Agreement") is entered into on [DATE] by and between the co-founders of [STARTUP_NAME], collectively referred to as "Founders."

WHEREAS, the Founders desire to formalize their relationship, define their roles, ownership, and rights, and prevent future misunderstandings.

<strong>Company Formation</strong>

The Founders agree to form a company under the name [COMPANY_NAME], engaged in the business of [BUSINESS_DESCRIPTION]. The company will be incorporated in the State of [JURISDICTION] as a [TYPE_OF_ENTITY].

<strong>Equity Ownership</strong>

Each Founder's ownership in the company shall be as follows:
• [FOUNDER_1_NAME] — [PERCENTAGE_1]%
• [FOUNDER_2_NAME] — [PERCENTAGE_2]%
• [FOUNDER_3_NAME] — [PERCENTAGE_3]%

No Founder shall transfer, sell, or assign their equity without first offering it to the other Founders.

<strong>Roles and Responsibilities</strong>

Each Founder agrees to take on the following initial responsibilities:
• [FOUNDER_1_NAME] — [ROLE_1]
• [FOUNDER_2_NAME] — [ROLE_2]
• [FOUNDER_3_NAME] — [ROLE_3]

Founders agree to devote their reasonable efforts and time to the success of the company.

<strong>Decision Making</strong>

Major decisions (e.g., fundraising, new product launches, hiring key executives) require approval from at least [DECISION_THRESHOLD]% of equity holders or unanimous consent, as determined by the Founders.

<strong>Intellectual Property</strong>

All intellectual property (IP) created by the Founders related to the company's operations shall be owned by the company. Each Founder hereby assigns all rights, title, and interest in such IP to the company.

<strong>Vesting Schedule</strong>

Each Founder's shares shall vest over a period of [VESTING_YEARS] years with a [CLIFF_MONTHS] month cliff. If a Founder leaves before the cliff, they forfeit all unvested shares.

<strong>Expenses and Reimbursements</strong>

Any expenses incurred on behalf of the company shall be reimbursed with proper documentation and approval by the other Founders.

<strong>Dispute Resolution</strong>

Any disputes arising under this Agreement shall be first resolved by mediation, and if unresolved, by binding arbitration under the laws of the State of [JURISDICTION].`,
      alb: `MARRËVESHJE THEMELUESIT

Kjo Marrëveshje Themeltar ("Marrëveshja") lidhet më [DATE] midis themeluesve të [STARTUP_NAME], të quajtur kolektivisht "Themeluesit".

DUKE PARASUPOZUAR që Themeluesit dëshirojnë të formalizojnë marrëdhënien e tyre, të përcaktojnë rolet, pronësinë dhe të drejtat e tyre, dhe të parandalojnë keqkuptimet e ardhshme.

<strong>Formimi i Kompanisë</strong>

Themeluesit bien në marrëveshje të formojnë një kompani me emrin [COMPANY_NAME], të angazhuar në biznesin e [BUSINESS_DESCRIPTION]. Kompania do të inkorporohet në Shtetin e [JURISDICTION] si një [TYPE_OF_ENTITY].

<strong>Pronësia e Aksioneve</strong>

Pronësia e secilit Themeltar në kompani do të jetë si më poshtë:
• [FOUNDER_1_NAME] — [PERCENTAGE_1]%
• [FOUNDER_2_NAME] — [PERCENTAGE_2]%
• [FOUNDER_3_NAME] — [PERCENTAGE_3]%

Asnjë Themeltar nuk duhet të transferojë, shesë ose caktojë aksionet e tyre pa ofruar fillimisht për themeluesit e tjerë.

<strong>Rolet dhe Përgjegjësitë</strong>

Secili Themeltar bie në marrëveshje të marrë përgjegjësitë fillestare të mëposhtme:
• [FOUNDER_1_NAME] — [ROLE_1]
• [FOUNDER_2_NAME] — [ROLE_2]
• [FOUNDER_3_NAME] — [ROLE_3]

Themeluesit bien në marrëveshje të kushtojnë përpjekjet dhe kohën e tyre të arsyeshme për suksesin e kompanisë.

<strong>Vendimmarrja</strong>

Vendimet e mëdha (p.sh., mbledhja e fondeve, lansimet e produkteve të reja, punësimi i ekzekutivëve kryesorë) kërkojnë miratimin e të paktën [DECISION_THRESHOLD]% të mbajtësve të aksioneve ose pëlqimin unanëm, siç përcaktohet nga Themeluesit.

<strong>Pronësia Intelektuale</strong>

E gjithë pronësia intelektuale (IP) e krijuar nga Themeluesit në lidhje me operacionet e kompanisë do të jetë pronë e kompanisë. Secili Themeltar këtu i cakton të gjitha të drejtat, titullin dhe interesin në një IP të tillë për kompaninë.

<strong>Orari i Vesting</strong>

Aksionet e secilit Themeltar do të vestojnë gjatë një periudhe prej [VESTING_YEARS] vjetësh me një kufi prej [CLIFF_MONTHS] muajsh. Nëse një Themeltar largohet para kufirit, ai humb të gjitha aksionet e pavestuara.

<strong>Shpenzimet dhe Rimbursimet</strong>

Çdo shpenzim i bërë në emër të kompanisë do të rimburset me dokumentacionin e duhur dhe miratimin e themeluesve të tjerë.

<strong>Zgjidhja e Mosmarrëveshjeve</strong>

Çdo mosmarrëveshje që lind në bazë të kësaj Marrëveshjeje do të zgjidhet fillimisht me ndërmjetësim, dhe nëse nuk zgjidhet, me arbitrazh të detyrueshëm sipas ligjeve të Shtetit të [JURISDICTION].`,
    },
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Founder Agreement - TechCo",
        type: "text",
        required: true,
      },
      {
        id: "startup_name",
        label: "Startup Name",
        placeholder: "TechCo Inc.",
        type: "text",
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
        required: true,
      },
      {
        id: "cliff_months",
        label: "Cliff Period (months)",
        placeholder: "12",
        type: "text",
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
        label: "Company Legal Name",
        placeholder: "TechCo Inc.",
        type: "text",
        required: false,
      },
      {
        id: "business_description",
        label: "Business Description",
        placeholder: "AI-powered productivity tools",
        type: "textarea",
        required: false,
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "Delaware",
        type: "text",
        required: false,
      },
      {
        id: "type_of_entity",
        label: "Type of Entity",
        placeholder: "Delaware C-Corporation",
        type: "text",
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
        required: false,
      },
    ],
  },
  {
    id: "employmentContract",
    title: {
      en: "Employment Contract",
      alb: "Kontratë Punësimi",
    },
    description: {
      en: "Standard employee agreements",
      alb: "Marrëveshje standarde për punonjësit",
    },
    category: {
      en: "HR",
      alb: "Burime Njerëzore",
    },
    downloads: 156,
    isPremium: false,
    previewContent: {
      en: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is made effective as of [DATE] by and between [COMPANY_NAME] ("Employer") and [EMPLOYEE_NAME] ("Employee").

<strong>Position and Duties</strong>

The Employer hereby employs the Employee in the position of [JOB_TITLE]. The Employee agrees to perform all duties and responsibilities consistent with that role, including [KEY_RESPONSIBILITIES], and to follow the company's policies and code of conduct.

<strong>Term of Employment</strong>

The employment relationship will commence on [START_DATE] and will continue until terminated by either party in accordance with this Agreement.

<strong>Compensation</strong>

The Employee shall receive a salary of [SALARY_AMOUNT] per [PAY_PERIOD], payable [PAYMENT_FREQUENCY], subject to applicable deductions. Any bonuses or commissions will be at the discretion of the Employer.

<strong>Benefits</strong>

The Employee shall be entitled to [BENEFITS] as per the company's current benefits policy, which may include health insurance, paid leave, and remote work flexibility.

<strong>Working Hours and Location</strong>

The Employee is expected to work [HOURS_PER_WEEK] hours per week, primarily from [WORK_LOCATION], unless otherwise agreed in writing.

<strong>Confidentiality and Intellectual Property</strong>

The Employee agrees not to disclose any proprietary or confidential information. All work, inventions, designs, and materials produced during employment are the sole property of the Employer.

<strong>Termination</strong>

Either party may terminate this Agreement with [NOTICE_PERIOD] written notice. The Employer reserves the right to terminate immediately for misconduct, breach of duty, or gross negligence.

<strong>Non-Compete and Non-Solicitation</strong>

For [NON_COMPETE_DURATION] months after termination, the Employee shall not engage with competitors or solicit clients, employees, or contractors of the Employer.

<strong>Governing Law</strong>

This Agreement is governed by the laws of the State of [JURISDICTION].`,
      alb: `MARRËVESHJE PUNËSIMI

Kjo Marrëveshje Punësimi ("Marrëveshja") bëhet efektive më [DATE] midis [COMPANY_NAME] ("Punëdhënësit") dhe [EMPLOYEE_NAME] ("Punonjësit").

<strong>Pozicioni dhe Detyrat</strong>

Punëdhënësi këtu punëson Punonjësin në pozicionin e [JOB_TITLE]. Punonjësi bie në marrëveshje të kryejë të gjitha detyrat dhe përgjegjësitë që përputhen me atë rol, duke përfshirë [KEY_RESPONSIBILITIES], dhe të ndjekë politikën dhe kodin e sjelljes së kompanisë.

<strong>Afati i Punësimit</strong>

Marrëdhënia e punësimit do të fillojë më [START_DATE] dhe do të vazhdojë derisa të përfundojë nga çdo palë në përputhje me këtë Marrëveshje.

<strong>Kompensimi</strong>

Punonjësi do të marrë një pagë prej [SALARY_AMOUNT] për [PAY_PERIOD], e pagueshme [PAYMENT_FREQUENCY], subjekt i zbritjeve të zbatueshme. Çdo bonus ose komision do të jetë në diskrecionin e Punëdhënësit.

<strong>Përfitimet</strong>

Punonjësi do të ketë të drejtë për [BENEFITS] sipas politikës aktuale të përfitimeve të kompanisë, e cila mund të përfshijë sigurimin shëndetësor, pushimet e paguara dhe fleksibilitetin e punës nga distanca.

<strong>Orët e Punës dhe Lokacioni</strong>

Punonjësi pritet të punojë [HOURS_PER_WEEK] orë në javë, kryesisht nga [WORK_LOCATION], përveç nëse nuk bihet në marrëveshje ndryshe me shkrim.

<strong>Konfidencialiteti dhe Pronësia Intelektuale</strong>

Punonjësi bie në marrëveshje të mos zbulojë asnjë informacion pronësor ose konfidencial. E gjithë puna, shpikjet, dizajnet dhe materialet e prodhuara gjatë punësimit janë pronë e vetme e Punëdhënësit.

<strong>Përfundimi</strong>

Çdo palë mund të përfundojë këtë Marrëveshje me [NOTICE_PERIOD] njoftim me shkrim. Punëdhënësi rezervon të drejtën të përfundojë menjëherë për sjellje të gabuar, shkelje detyre ose neglizhencë të rëndë.

<strong>Jo-Konkurim dhe Jo-Tërheqje</strong>

Për [NON_COMPETE_DURATION] muaj pas përfundimit, Punonjësi nuk duhet të angazhohet me konkurrentë ose të tërheqë klientë, punonjës ose kontraktorë të Punëdhënësit.

<strong>Ligji Zbatues</strong>

Kjo Marrëveshje rregullohet nga ligjet e Shtetit të [JURISDICTION].`,
    },
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Employment Agreement - John Doe",
        type: "text",
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
    title: {
      en: "Consultant Agreement",
      alb: "Marrëveshje Konsulenti",
    },
    description: {
      en: "Independent contractor terms",
      alb: "Kushtet për kontraktor të pavarur",
    },
    category: {
      en: "Legal",
      alb: "Ligjor",
    },
    downloads: 143,
    isPremium: false,
    previewContent: {
      en: `CONSULTANT AGREEMENT

This Consultant Agreement ("Agreement") is entered into on [DATE] between [CLIENT_NAME] ("Client") and [CONSULTANT_NAME] ("Consultant").

WHEREAS, the Client desires to engage the Consultant for certain services, and the Consultant agrees to provide such services under the following terms.

<strong>Services</strong>

The Consultant agrees to provide professional services as described below:
[SERVICE_DESCRIPTION].

The Consultant shall perform the services with diligence, in a professional manner, and in accordance with industry standards.

<strong>Term</strong>

This Agreement begins on [START_DATE] and continues until [END_DATE] or completion of services, unless terminated earlier.

<strong>Compensation</strong>

The Client agrees to pay the Consultant [AMOUNT] per [PAYMENT_UNIT], payable [PAYMENT_TERMS]. Late payments may accrue interest at [INTEREST_RATE]% per month.

<strong>Expenses</strong>

The Consultant shall be reimbursed for reasonable pre-approved expenses incurred during service delivery, provided that receipts are submitted.

<strong>Independent Contractor</strong>

The Consultant is an independent contractor and not an employee of the Client. The Consultant is responsible for their own taxes, insurance, and benefits.

<strong>Confidentiality</strong>

The Consultant agrees to maintain strict confidentiality regarding all non-public information disclosed by the Client during the course of engagement.

<strong>Ownership of Work</strong>

All deliverables, documents, and materials created by the Consultant under this Agreement shall be the property of the Client upon full payment. The Consultant retains no rights to such materials.

<strong>Termination</strong>

Either party may terminate this Agreement with [NOTICE_PERIOD] written notice. The Client may terminate immediately for breach or non-performance.

<strong>Liability and Indemnity</strong>

The Consultant shall not be liable for indirect damages. The Consultant agrees to indemnify the Client for damages resulting from intentional misconduct or gross negligence.

<strong>Governing Law</strong>

This Agreement shall be governed by the laws of the State of [JURISDICTION].`,
      alb: `MARRËVESHJE KONSULENTI

Kjo Marrëveshje Konsulenti ("Marrëveshja") lidhet më [DATE] midis [CLIENT_NAME] ("Klientit") dhe [CONSULTANT_NAME] ("Konsulentit").

DUKE PARASUPOZUAR që Klienti dëshiron të angazhojë Konsulentin për shërbime të caktuara, dhe Konsulenti bie në marrëveshje të ofrojë shërbime të tilla sipas kushteve të mëposhtme.

<strong>Shërbimet</strong>

Konsulenti bie në marrëveshje të ofrojë shërbime profesionale siç përshkruhet më poshtë:
[SERVICE_DESCRIPTION].

Konsulenti duhet të kryejë shërbimet me kujdes, në një mënyrë profesionale dhe në përputhje me standardet e industrisë.

<strong>Afati</strong>

Kjo Marrëveshje fillon më [START_DATE] dhe vazhdon deri më [END_DATE] ose përfundimi i shërbimeve, përveç nëse përfundon më herët.

<strong>Kompensimi</strong>

Klienti bie në marrëveshje të paguajë Konsulentin [AMOUNT] për [PAYMENT_UNIT], e pagueshme [PAYMENT_TERMS]. Pagesat e vonuara mund të grumbullojnë interes me [INTEREST_RATE]% në muaj.

<strong>Shpenzimet</strong>

Konsulenti do të rimburset për shpenzimet e arsyeshme të miratuara paraprakisht të bëra gjatë ofrimit të shërbimit, me kusht që të paraqiten faturat.

<strong>Kontraktor i Pavarur</strong>

Konsulenti është një kontraktor i pavarur dhe jo një punonjës i Klientit. Konsulenti është përgjegjës për taksat, sigurimin dhe përfitimet e veta.

<strong>Konfidencialiteti</strong>

Konsulenti bie në marrëveshje të mbajë konfidencialitet të rreptë në lidhje me të gjithë informacionin jo-publik të zbuluar nga Klienti gjatë procesit të angazhimit.

<strong>Pronësia e Punës</strong>

Të gjitha rezultatet, dokumentet dhe materialet e krijuara nga Konsulenti në bazë të kësaj Marrëveshjeje do të jenë pronë e Klientit pas pagesës së plotë. Konsulenti nuk mban asnjë të drejtë për materiale të tilla.

<strong>Përfundimi</strong>

Çdo palë mund të përfundojë këtë Marrëveshje me [NOTICE_PERIOD] njoftim me shkrim. Klienti mund të përfundojë menjëherë për shkelje ose mos-ekzekutim.

<strong>Përgjegjësia dhe Kompensimi</strong>

Konsulenti nuk do të jetë përgjegjës për dëme indirekte. Konsulenti bie në marrëveshje të kompensojë Klientin për dëmet që rezultojnë nga sjellje e qëllimshme e gabuar ose neglizhencë e rëndë.

<strong>Ligji Zbatues</strong>

Kjo Marrëveshje do të rregullohet nga ligjet e Shtetit të [JURISDICTION].`,
    },
    fields: [
      {
        id: "contract_name",
        label: "Contract Name",
        placeholder: "Consultant Agreement - Jane Doe",
        type: "text",
        required: true,
      },
      {
        id: "consultant_name",
        label: "Consultant Name",
        placeholder: "Jane Doe",
        type: "text",
        required: true,
      },
      {
        id: "service_description",
        label: "Service Description",
        placeholder: "Website design and development services",
        type: "textarea",
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
        required: true,
      },
      {
        id: "jurisdiction",
        label: "State",
        placeholder: "California",
        type: "text",
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
