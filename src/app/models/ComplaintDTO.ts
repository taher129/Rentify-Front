export class ComplaintDTO {
    
    userId: number;
    reportedUserId: number;
    complaintDate: string;  // Utiliser une chaîne ISO pour la date
    description: string;
    complaintType: string;
    evidence: string[];
    status: string;  // Vous pouvez aussi utiliser un enum si vous avez des statuts prédéfinis comme 'PENDING', 'RESOLVED', etc.
  
    constructor(
      
      userId: number = 77,
      reportedUserId: number = 77,
      complaintDate: string = new Date().toISOString(),
      description: string = '',
      complaintType: string = '',
      evidence: string[] = [],
      status: string = 'PENDING'
    ) {
      
      this.userId = userId;
      this.reportedUserId = reportedUserId;
      this.complaintDate = complaintDate;
      this.description = description;
      this.complaintType = complaintType;
      this.evidence = evidence;
      this.status = status;
    }
  }
  