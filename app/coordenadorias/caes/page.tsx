import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export default function CaesPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.caes} />;
}
