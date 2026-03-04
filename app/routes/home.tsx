import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PoE Campaign" },
    { name: "description", content: "PoE campaign leveling guide" },
  ];
}

export default function Home() {
  return <Welcome />;
}
