"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  event_title: string;
  event_date: string;
  audience: string;
  volunteers?: number;
  constituents_served?: number;
  highlights: string;
};

type GenerateResponse = {
  donor_update?: string;
  social_caption?: string;
  follow_up_checklist?: string[];
  raw_output?: string;
  error?: string;
};

type ActionCard = {
  label: string;
  description: string;
  accessor: keyof GenerateResponse;
};

const OUTPUT_SECTIONS: ActionCard[] = [
  {
    label: "Donor Newsletter",
    description: "Narrative for newsletters or supporter emails.",
    accessor: "donor_update",
  },
  {
    label: "Social Caption",
    description: "Short and shareable update for social channels.",
    accessor: "social_caption",
  },
  {
    label: "Follow-up Checklist",
    description: "Action items to keep momentum with your team.",
    accessor: "follow_up_checklist",
  },
];

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      event_title: "",
      event_date: "",
      audience: "",
      highlights: "",
    },
  });

  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const formattedResult = useMemo(() => {
    if (!result) return OUTPUT_SECTIONS;
    return OUTPUT_SECTIONS.map((section) => {
      const value = result[section.accessor];
      if (Array.isArray(value)) {
        return { ...section, content: value.join("\n") };
      }
      return { ...section, content: value };
    });
  }, [result]);

  const submitHandler = async (values: FormValues) => {
    setError(null);
    setResult(null);
    setToast(null);

    try {
      const response = await fetch(`${apiBaseUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      const data: GenerateResponse = await response.json();
      setResult(data);
      if (data.raw_output) {
        setToast("Assistant returned freeform text. Review the raw response below.");
      } else {
        setToast("Communications generated successfully.");
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error generating communications.");
    }
  };

  const handleCopy = async (content?: string | null) => {
    if (!content) {
      setToast("Nothing to copy yet—generate communications first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setToast("Content copied to clipboard.");
    } catch {
      setToast("Clipboard not available. Copy manually.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-600/30 via-slate-950 to-black" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-20 lg:px-12">
        <Header />

        <section className="grid flex-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <FormPanel
            register={register}
            handleSubmit={handleSubmit}
            submitHandler={submitHandler}
            isSubmitting={isSubmitting}
            error={error}
            toast={toast}
          />
          <ResultsPanel
            formattedResult={formattedResult}
            rawOutput={result?.raw_output}
            onCopy={handleCopy}
          />
        </section>

        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-14 flex flex-col gap-6 text-center text-white md:text-left">
      <div>
        <span className="inline-flex items-center rounded-full bg-indigo-500/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200">
          Rapid Impact Partner Assistant
        </span>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Deliver polished impact recaps for donors, partners, and program leads
          </h1>
          <p className="max-w-2xl text-sm text-slate-200 md:text-base">
            Turn on-the-ground highlights into ready-to-share updates. The assistant assembles supporter messaging, social snippets, and internal actions so your team can move fast.
          </p>
        </div>
      </div>
    </header>
  );
}

type FormPanelProps = {
  register: ReturnType<typeof useForm<FormValues>>["register"];
  handleSubmit: ReturnType<typeof useForm<FormValues>>["handleSubmit"];
  submitHandler: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  toast: string | null;
};

function FormPanel({
  register,
  handleSubmit,
  submitHandler,
  isSubmitting,
  error,
  toast,
}: FormPanelProps) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-8 shadow-[0_40px_120px_-45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <header className="space-y-2 text-slate-100">
        <h2 className="text-lg font-semibold md:text-xl">Event Details</h2>
        <p className="text-sm text-slate-300 md:text-[15px]">
          Provide the essentials from the field—audience, impact, and stories. The assistant shapes them into supporter communications and follow-up tasks.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mt-8 space-y-7"
        aria-label="Rapid impact assistant form"
      >
        <Field
          label="Event Title"
          description="Headline summary for the program or outreach."
        >
          <input
            className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            placeholder="Mobile Pantry Outreach – Northside"
            {...register("event_title", { required: true })}
          />
        </Field>

        <div className="grid gap-7 md:grid-cols-2">
          <Field
            label="Event Date"
            description="Date or date range of the activity."
          >
            <input
              className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              placeholder="November 8, 2025"
              {...register("event_date", { required: true })}
            />
          </Field>
          <Field
            label="Audience"
            description="Who should receive the supporter update."
          >
            <input
              className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              placeholder="Individual donors and local partners"
              {...register("audience", { required: true })}
            />
          </Field>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <Field
            label="Volunteers (optional)"
            description="How many volunteers supported the work?"
          >
            <input
              className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              type="number"
              min={0}
              placeholder="26"
              {...register("volunteers", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="People Served (optional)"
            description="Meals, families, or neighbors reached."
          >
            <input
              className="w-full rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
              type="number"
              min={0}
              placeholder="410"
              {...register("constituents_served", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field
          label="Highlights & Stories"
          description="Include outcomes, partner shoutouts, and human stories."
        >
          <textarea
            rows={8}
            className="w-full min-h-[200px] rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            placeholder="Share impact metrics, memorable moments, quotes, and partner shoutouts..."
            {...register("highlights", { required: true })}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 disabled:cursor-not-allowed disabled:bg-indigo-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Communications"}
          </button>
          {error && (
            <p className="rounded-lg border border-red-200/70 bg-red-100/70 px-3 py-2 text-xs text-red-900">
              {error}
            </p>
          )}
          {!error && toast && (
            <p className="rounded-lg border border-emerald-200/70 bg-emerald-100/70 px-3 py-2 text-xs text-emerald-900">
              {toast}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

type ResultsPanelProps = {
  formattedResult: Array<ActionCard & { content?: string }>;
  rawOutput?: string;
  onCopy: (content?: string | null) => void;
};

function ResultsPanel({ formattedResult, rawOutput, onCopy }: ResultsPanelProps) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <header className="space-y-2 text-slate-100">
        <h2 className="text-lg font-semibold md:text-xl">Generated Communications</h2>
        <p className="text-sm text-slate-300 md:text-[15px]">
          Review the ready-to-share content created from your submission. Copy and adapt it for emails, social posts, or team follow-up.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {formattedResult.map((section) => (
          <ActionCard
            key={section.accessor}
            label={section.label}
            description={section.description}
            content={section.content}
            onCopy={onCopy}
          />
        ))}
        {rawOutput && (
          <ActionCard
            label="Raw Output"
            description="Full structured response from the assistant."
            content={rawOutput}
            onCopy={onCopy}
          />
        )}
      </div>
    </div>
  );
}

type ActionCardProps = {
  label: string;
  description: string;
  content?: string;
  onCopy: (content?: string | null) => void;
};

function ActionCard({ label, description, content, onCopy }: ActionCardProps) {
  return (
    <article className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{label}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
      <div className="whitespace-pre-line rounded-lg border border-dashed border-slate-300 bg-slate-50/90 p-4 text-sm text-slate-700">
        {content ? content : "Generate to preview output..."}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onCopy(content)}
          className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/20 hover:text-white"
        >
          Copy
        </button>
      </div>
    </article>
  );
}

type FieldProps = {
  label: string;
  description: string;
  children: React.ReactNode;
};

function Field({ label, description, children }: FieldProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-200">{label}</label>
      <p className="text-xs text-slate-400">{description}</p>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 text-center text-slate-400">
      <p className="text-xs md:text-sm">
        Rapid Impact Partner Assistant · Built to spotlight nonprofit impact stories.
      </p>
    </footer>
  );
}

