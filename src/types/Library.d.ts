declare namespace Library {
  // ─── CENTERS ───
  interface Center {
    name: string;
    code: string;
    advisorName?: string;
    location?: string;
    isActive: boolean;
  }
  type CenterItem = Data.WithId<Center, 'centerId'>;

  // ─── CATEGORIES ───
  type BookCategoryType =
    | 'CENTER'
    | 'MOTIVATIONAL'
    | 'AUTOBIOGRAPHY'
    | 'AIGGPA_REPORT'
    | 'GENERAL_REPORT'
    | 'NEWSPAPER'
    | 'MAGAZINE';

  interface BookCategory {
    name: string;
    code: BookCategoryType;
    description?: string;
    isActive: boolean;
  }
  type BookCategoryItem = Data.WithId<BookCategory, 'categoryId'>;

  // ─── BOOKS & CENTER BOOKS ───
  interface Book {
    title: string;
    subTitle?: string;            // Book Sub title
    author: string;
    authors?: string[];           // Multiple authors for Center books
    edition?: string;             // Edition
    publication: string;
    year: number;
    numberOfCopies: number;
    availableCopies: number;
    categoryId: number;
    categoryName: string;
    categoryType: BookCategoryType;
    centerId?: number | null;
    centerName?: string;
    advisor?: string;
    department?: string;
    isbn?: string;
    shelfLocation?: string;
    documentUrl?: string;
    subCategory?: string;

    // General Report specific fields
    generalCategory?: string;     // Agriculture, Finance, Technical, Research, Medical, Other
    generalSubCategory?: string;  // Sub Category text field

    // Transaction fields for Periodicals/Newspapers/Magazines
    receivedBy?: string;
    receiveDate?: string;
    subjectTopic?: string;

    isActive: boolean;
  }
  type BookItem = Data.WithId<Book, 'bookId'>;

  interface BookForm {
    title: string;
    subTitle?: string;
    author: string;
    authors?: string[];
    edition?: string;
    publication: string;
    year: number | null;
    numberOfCopies: number | null;
    categoryType: BookCategoryType;
    centerId?: number | null;
    advisor?: string;
    department?: string;
    isbn?: string;
    shelfLocation?: string;
    subCategory?: string;

    // General Reports
    generalCategory?: string;
    generalSubCategory?: string;

    // Periodicals transaction
    receivedBy?: string;
    receiveDate?: string;
    subjectTopic?: string;
  }

  // ─── AIGGPA REPORTS ───
  interface AiggpaReport {
    centerId: number;
    centerName: string;
    advisor: string;
    projectName: string;
    projectId?: number | null;
    year: number;
    numberOfCopies: number;
    availableCopies: number;
    documentUrl?: string;
    isActive: boolean;
  }
  type AiggpaReportItem = Data.WithId<AiggpaReport, 'reportId'>;

  interface AiggpaReportForm {
    centerId: number | null;
    advisor: string;
    projectId: number | null;
    projectName: string;
    year: number | null;
    numberOfCopies: number | null;
    documentUrl?: string;
  }

  // ─── GENERAL REPORTS ───
  type GeneralReportCategory =
    | 'Agriculture'
    | 'Finance'
    | 'Technical'
    | 'Research'
    | 'Medical'
    | 'Other';

  interface GeneralReport {
    title: string;
    year: number;
    numberOfCopies: number;
    availableCopies: number;
    author?: string;
    publisher?: string;
    category?: GeneralReportCategory | string; // Category dropdown
    subCategory?: string;                      // Sub Category text field
    generalCategory?: string;
    generalSubCategory?: string;
    isActive: boolean;
  }
  type GeneralReportItem = Data.WithId<GeneralReport, 'reportId'>;

  interface GeneralReportForm {
    title: string;
    year: number | null;
    numberOfCopies: number | null;
    author?: string;
    publisher?: string;
    category?: GeneralReportCategory | string;
    subCategory?: string;
    generalCategory?: string;
    generalSubCategory?: string;
  }

  // ─── BORROWING / ISSUANCE ───
  type BorrowStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'REISSUED';

  interface BorrowRecord {
    bookId: number;
    bookTitle: string;
    borrowerName: string;
    centerOrSection: string;
    designation: string;
    issueDate: string;        // ISO date string YYYY-MM-DD
    dueDate: string;          // 30 days or designation duration limit
    returnDate?: string | null; // Date of return
    specialPermission?: boolean; // Special permission checkbox
    permissionGivenBy?: string;  // Who gave the permission
    status: BorrowStatus;
    reissueCount: number;
    notes?: string;
  }
  type BorrowItem = Data.WithId<BorrowRecord, 'borrowId'>;

  interface BorrowForm {
    bookId: number | null;
    borrowerName: string;
    centerOrSection: string;
    designation: string;
    issueDate: Date | null;
    returnDate?: Date | null;
    specialPermission?: boolean;
    permissionGivenBy?: string;
    notes?: string;
  }

  // ─── ANNUAL AUDIT / VERIFICATION ───
  type AuditStatus = 'VERIFIED' | 'MISSING' | 'DAMAGED' | 'EXTRA_COPIES' | 'PENDING';

  interface AuditEntry {
    bookId: number;
    bookTitle: string;
    categoryName: string;
    categoryType: BookCategoryType;
    centerName?: string;
    systemCopies: number;
    physicalCopies: number;
    auditStatus: AuditStatus;
    auditYear: number;
    verifiedBy: string;
    verificationDate: string;
    remarks?: string;
  }
  type AuditItem = Data.WithId<AuditEntry, 'auditId'>;

  interface AuditEntryForm {
    bookId: number;
    physicalCopies: number;
    auditStatus: AuditStatus;
    remarks?: string;
  }

  // ─── DASHBOARD ───
  interface DashboardSummary {
    totalBooks: number;
    totalStockCopies: number;
    currentlyIssued: number;
    overdueBooks: number;
    totalAuditVerified: number;
    categoryCounts: {
      categoryType: BookCategoryType;
      categoryName: string;
      titleCount: number;
      copyCount: number;
    }[];
    centerCounts: {
      centerId: number;
      centerName: string;
      bookCount: number;
      reportCount: number;
    }[];
    recentBorrows: BorrowItem[];
    overdueBorrows: BorrowItem[];
  }

  // ─── NEWSPAPER & MAGAZINE MASTER ───
  type PublicationType = 'NEWSPAPER' | 'MAGAZINE';

  type PeriodicalFrequency =
    | 'Daily'
    | 'Weekly'
    | 'Bi-Weekly'
    | 'Monthly'
    | 'Fortnightly'
    | 'Quarterly'
    | 'Half Yearly'
    | 'Annually';

  interface Newspaper {
    name: string;
    publicationType: PublicationType;
    publisher: string;
    vendor?: string;                     // Vendor
    language?: string;
    frequency?: PeriodicalFrequency | string; // Frequency
    subscriptionFrom: string;            // ISO date YYYY-MM-DD
    subscriptionTo: string;              // ISO date YYYY-MM-DD
    subscriptionAmount?: number;         // Subscription amount
    financialYear?: string;              // e.g. 2026-27
    isActive: boolean;
    notes?: string;
  }
  type NewspaperItem = Data.WithId<Newspaper, 'newspaperId'>;

  interface NewspaperForm {
    name: string;
    publicationType: PublicationType;
    publisher: string;
    vendor?: string;
    language?: string;
    frequency?: string;
    subscriptionFrom: Date | null;
    subscriptionTo: Date | null;
    subscriptionAmount?: number | null;
    financialYear?: string;
    notes?: string;
  }

  // ─── PROJECT MASTER (for AIGGPA Reports dropdown) ───
  type ProjectStatus = 'ONGOING' | 'COMPLETED' | 'SUSPENDED' | 'PROPOSED';

  interface Project {
    projectName: string;
    centerId: number;
    centerName: string;
    advisor: string;
    startYear: number;
    endYear?: number | null;
    status: ProjectStatus;
    description?: string;
    isActive: boolean;
  }
  type ProjectItem = Data.WithId<Project, 'projectId'>;

  interface ProjectForm {
    projectName: string;
    centerId: number | null;
    advisor: string;
    startYear: number | null;
    endYear?: number | null;
    status: ProjectStatus;
    description?: string;
  }

  // ─── DESIGNATION WISE BORROWING DURATION MASTER ───
  interface DesignationBorrowRule {
    ruleId: number;
    designation: string;
    maxBooksAllowed?: number;
    maxBooks?: number;
    borrowingDurationDays?: number;
    durationDays?: number;
    gracePeriodDays: number;
    penaltyPerDay?: number;
    finePerDay?: number;
    description?: string;
    isActive: boolean;
  }
  type DesignationBorrowRuleItem = DesignationBorrowRule;

  interface DesignationBorrowRuleForm {
    designation: string;
    maxBooksAllowed: number | null;
    borrowingDurationDays: number | null;
    gracePeriodDays: number | null;
    penaltyPerDay: number | null;
    description?: string;
  }

  // ─── BORROWER CREDIT SCORE & EXTENDED PROFILE ───
  interface BorrowerCreditScore {
    borrowerName: string;
    designation?: string;
    centerOrSection?: string;
    joiningDate?: string;          // Joining Date
    contractEndDate?: string;      // Contract End Date
    totalBorrows: number;          // No of Books issued until now
    currentlyHeld: number;         // No of Books currently borrowed
    overdueCount: number;          // No of Books which have crossed return date
    returnedOnTime: number;
    reissueCount: number;
    creditScore: number;           // 0-100
    creditGrade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    recentBorrows: BorrowItem[];
  }
}
