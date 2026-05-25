import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export default function CaepPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.caep} />;
}
