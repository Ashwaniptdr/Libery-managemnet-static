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
    | 'GENERAL_REPORT';

  interface BookCategory {
    name: string;
    code: BookCategoryType;
    description?: string;
    isActive: boolean;
  }
  type BookCategoryItem = Data.WithId<BookCategory, 'categoryId'>;

  // ─── BOOKS ───
  interface Book {
    title: string;
    author: string;
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
    isActive: boolean;
  }
  type BookItem = Data.WithId<Book, 'bookId'>;

  interface BookForm {
    title: string;
    author: string;
    publication: string;
    year: number | null;
    numberOfCopies: number | null;
    categoryType: BookCategoryType;
    centerId?: number | null;
    advisor?: string;
    department?: string;
    isbn?: string;
    shelfLocation?: string;
  }

  // ─── AIGGPA REPORTS ───
  interface AiggpaReport {
    centerId: number;
    centerName: string;
    advisor: string;
    projectName: string;
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
    projectName: string;
    year: number | null;
    numberOfCopies: number | null;
    documentUrl?: string;
  }

  // ─── GENERAL REPORTS ───
  interface GeneralReport {
    title: string;
    year: number;
    numberOfCopies: number;
    availableCopies: number;
    author?: string;
    publisher?: string;
    isActive: boolean;
  }
  type GeneralReportItem = Data.WithId<GeneralReport, 'reportId'>;

  interface GeneralReportForm {
    title: string;
    year: number | null;
    numberOfCopies: number | null;
    author?: string;
    publisher?: string;
  }

  // ─── BORROWING / ISSUANCE ───
  type BorrowStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'REISSUED';

  interface BorrowRecord {
    bookId: number;
    bookTitle: string;
    borrowerName: string;
    centerOrSection: string;
    designation: string;
    issueDate: string; // ISO date string YYYY-MM-DD
    dueDate: string;   // 30 days limit from issueDate
    returnDate?: string | null;
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
}
