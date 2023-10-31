import { ModeToggle } from "@/components/modeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  console.log('abcd');
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
