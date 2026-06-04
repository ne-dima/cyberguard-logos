import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { privacyPolicyDocument } from "@/content/legal/privacyPolicy";

export const metadata = {
  title: "Политика конфиденциальности | КиберСтраж",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout>
      <LegalDocumentView document={privacyPolicyDocument} />
    </LegalPageLayout>
  );
}
