export const OfficeTypeLevelId = {
  stateLevel: 1,
  divisionLevel: 2,
  districtLevel: 3,
  blockLevel: 4,
  ddoOrSankul: 5,
  jsk: 6,
  schoolLevel: 7,
  instituteLevel: 8,
} as const;

export const UserLevelId = {
  dpi: 2,
  deo: 3,
  jointDirector: 4,
  beo: 5,
  cpi: 6,
  school: 7,
  ddoSankul: 8,
  employee: 9,
} as const;

export const UserRole = {
  teacher: 'Teacher',
  examAssessmentCell: 'Exam Assessment Cell',
  classTeacher: 'Class Teacher',
  examIncharge: 'Exam Incharge',
  school: 'School',
  principal: 'Principal',
  beoAdmin: 'BEO Admin',
} as const;

export const ExamTypeCode = {
  Quarterly: '001',
  HalfYearly: '002',
  Annual: '003',
} as const;

export const ClassCode = {
  Class11: '11',
  Class12: '12',
} as const;

export const MarksRemarkCodes = {
  Absent: 'ABS',
  Cancelled: 'CAN',
  Distinction: 'DISTN',
  GraceTheoryPractical: 'GRTP',
  GraceTheory: 'GRTH',
  GracePractical: 'GRPR',
  FailedTheoryPractical: 'FLDTP',
  FailedTheory: 'FLDTH',
  FailedPractical: 'FLDPR',
  Pass: 'Pass',
  Fail: 'Fail',
  FirstDivision: 'First Division',
  SecondDivision: 'Second Division',
  ThirdDivision: 'Third Division',
} as const;

export const SubjectCategoryNames: Record<number, string> = {
  1: 'Core Subjects',
  2: 'Language Subjects',
  3: 'Vocational Subjects',
  4: 'Additional Subjects',
} as const;

export const AmendmentRequestType = {
  UnlockStudentProfile: 'UnlockStudentProfile',
  AmendMarksEntry: 'AmendMarksEntry',
} as const;

export const AccessRequestTypeId = {
  EnrollmentAndProfileManagement: 1,
  MainMarksManagement: 2,
  RetotallingMarksManagement: 3,
  SecondAttemptMarksManagement: 4,
} as const;

export const UnlockExamTypeId = {
  Quarterly: 1,
  HalfYearly: 2,
  Annual: 3,
  Retotalling: 4,
  SecondAttempt: 5,
} as const;

export const Constant = {
  OfficeTypeLevelId,
  UserLevelId,
  UserRole,
  ExamTypeCode,
  ClassCode,
  MarksRemarkCodes,
  SubjectCategoryNames,
  AmendmentRequestType,
  AccessRequestTypeId,
  UnlockExamTypeId,
};
