import { Button } from "./ui/button";

export default function ErrorScreen({ error }) {
  return (
    <section className="w-screen h-screen flex items-center justify-center bg-red-100">
      <h2>{error}</h2>

      <Button onClick={() => window.location.reload()}>Reload</Button>
      <Button
        variant="ghost"
        onClick={() => window.location.assign("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </section>
  );
}
