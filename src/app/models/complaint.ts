
// export class Complaint {
//     complaintId: number;
//     userId: number;
//     reportedUserId: number;
//     complaintDate: Date;
//     description: string;
//     complaintType: string;
//     evidence: string;
//     status: string;
  
//     constructor(
//       complaintId: number,
//       userId: number,
//       reportedUserId: number,
//       complaintDate: Date,
//       description: string,
//       complaintType: string,
//       evidence: string,
//       status: string
//     ) {
//       this.complaintId = complaintId;
//       this.userId = userId;
//       this.reportedUserId = reportedUserId;
//       this.complaintDate = complaintDate;
//       this.description = description;
//       this.complaintType = complaintType;
//       this.evidence = evidence;
//       this.status = status;
//     }
//   }
  

// src/app/models/complaint.ts
export class Complaint {
  complaintId?: number; // facultatif à la création
  userId!: number;
  reportedUserId!: number;
  complaintDate?: Date; // gérée côté backend
  description!: string;
  complaintType!: string;
  evidence?: string;
  status?: string; // ex: "EN_ATTENTE", "TRAITÉ"
}
