export class ComplaintDTO {
  userId: number;
  reportedUserId: number;
  complaintDate: string; // Date ISO
  description: string;
  descriptionEn: string | undefined;
  complaintType: string;
  evidence: string[];
  status: string;

  constructor(
    userId: number = 77,
    reportedUserId: number = 77,
    description: string = '',
    complaintType: string = '',
    evidence: string[] = [],
    status: string = 'PENDING'
  ) {
    this.userId = userId;
    this.reportedUserId = reportedUserId;
    this.complaintDate = new Date().toISOString(); // généré par défaut
    this.description = description;
    this.complaintType = complaintType;
    this.evidence = evidence;
    this.status = status;
  }
}
