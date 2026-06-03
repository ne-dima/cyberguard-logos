export type ApplicationStatus = "new" | "accepted" | "rejected";

export interface Application {
  id: string;
  fullName: string;
  birthDate: string;
  organization: string;
  phone: string;
  email: string;
  parentContacts: string;
  location: string;
  motivationLetter: string;
  photoPath: string;
  about?: string;
  status: ApplicationStatus;
  rejectionComment?: string;
  createdAt: string;
}
