import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export default function ClevPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.clev} />;
}
