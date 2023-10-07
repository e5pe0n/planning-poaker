import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <div>
        <Button color="primary">Button</Button>
        <Chip color="primary">Chip</Chip>
      </div>
    </main>
  );
}
