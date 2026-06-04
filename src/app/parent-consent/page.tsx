import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { parentConsentDocument } from "@/content/legal/parentConsent";

export const metadata = {
  title: "Согласие представителя | КиберСтраж",
};

export default function ParentConsentPage() {
  return (
    <LegalPageLayout>
      <LegalDocumentView document={parentConsentDocument} />
    </LegalPageLayout>
  );
}
