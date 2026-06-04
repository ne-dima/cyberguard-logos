import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { photoConsentDocument } from "@/content/legal/photoConsent";

export const metadata = {
  title: "Согласие на обработку фото | КиберСтраж",
};

export default function PhotoConsentPage() {
  return (
    <LegalPageLayout>
      <LegalDocumentView document={photoConsentDocument} />
    </LegalPageLayout>
  );
}
