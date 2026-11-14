import Back from "@/components/back";
import Image from "next/image";

export default async function RecipePage(props: PageProps<"/recipe/[name]">) {
  const { name } = await props.params;

  const stats = [
    { label: "Time", value: "30 min" },
    { label: "Level", value: "Easy" },
    { label: "Serves", value: 2 },
  ];

  return (
    <main>
      <header className="relative h-72 w-full">
        <Image src="/recipe.svg" alt={`Photo of ${name}`} fill className="object-cover" />
        <Back href="/" className="absolute top-5 left-5" />
      </header>

      <section className="flex flex-col gap-4 p-5">
        <div>
          <span className="text-sm font-semibold text-muted">Tunisia</span>
          <h2 className="font-display text-4xl font-bold tracking-tighter">{name}</h2>
          <p className="mt-2 text-muted">
            Shakshouka is a Maghrebi dish of eggs poached in a sauce of tomatoes, olive oil,
            peppers, onion, and garlic, commonly spiced with cumin, paprika, and cayenne pepper.
            Shakshouka is a popular dish throughout North Africa and the Middle East.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col rounded-xl bg-surface px-3 py-2.5">
              <span className="text-xs text-muted">{label}</span>
              <span className="font-display text-base font-bold">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
