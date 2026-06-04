import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { personalDataConsentDocument } from "@/content/legal/personalDataConsent";

export const metadata = {
  title: "Согласие на обработку ПДн | КиберСтраж",
};

export default function PersonalDataConsentPage() {
  return (
    <LegalPageLayout>
      <LegalDocumentView document={personalDataConsentDocument} />
    </LegalPageLayout>
  );
}
