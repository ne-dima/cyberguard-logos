export type ApplicationStatus = "new" | "accepted" | "rejected";

export interface ApplicationConsents {
  version: string;
  personalData: true;
  photo: true;
  parentRepresentative?: boolean;
  acceptedAt: string;
}

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
  invitationSentAt?: string;
  consents?: ApplicationConsents;
  createdAt: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Новая",
  accepted: "Принят",
  rejected: "Отклонён",
};

export const PARTICIPANT_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "На рассмотрении",
  accepted: "Принят",
  rejected: "Отклонён",
};

export interface PublicApplicationStatus {
  fullName: string;
  email: string;
  status: ApplicationStatus;
  rejectionComment?: string;
  createdAt: string;
}
