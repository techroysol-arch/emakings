import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Sparkles,
  Heart,
  CalendarDays,
  MessageSquare,
  Gift,
  ShieldCheck,
  LockKeyhole,
  SlidersHorizontal,
  Check,
  Layers,
  BrainCircuit,
  Network,
  UserRound,
  ChevronRight,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProductPreview } from "@/components/product-preview";
import { Assistant } from "@/components/assistant";
import { Waitlist } from "@/components/waitlist";
const features = [
  {
    icon: CalendarDays,
    title: "Remember the moments.",
    label: "INTELLIGENT REMINDERS",
    description:
      "Birthdays, anniversaries, and the little things in between. Keep what matters close, even when life gets busy.",
    type: "calendar",
  },
  {
    icon: MessageSquare,
    title: "Find your kind of words.",
    label: "PERSONALIZED AI MESSAGES",
    description:
      "Turn what you feel into something they’ll feel. Thoughtful messages shaped by your context and your voice.",
    type: "message",
  },
  {
    icon: Gift,
    title: "Give a little more meaning.",
    label: "GIFTS & THOUGHTFUL GESTURES",
    description:
      "Less endless searching. More “that’s so them.” Discover ideas inspired by their interests and your budget.",
    type: "gift",
  },
  {
    icon: Heart,
    title: "Be closer, more often.",
    label: "RELATIONSHIP INTELLIGENCE",
    description:
      "Small, intentional actions make a difference. Discover gentle suggestions for the connections you care about.",
    type: "insight",
  },
];
function FeatureVisual({ type }: { type: string }) {
  if (type === "calendar")
    return (
      <div className="feature-visual">
        <div className="mini-calendar">
          <span>
            NOVEMBER <ChevronRight size={12} />
          </span>
          <div>
            {[
              "M",
              "T",
              "W",
              "T",
              "F",
              "S",
              "S",
              12,
              13,
              14,
              15,
              16,
              17,
              18,
            ].map((n, i) => (
              <i key={i} className={n === 18 ? "selected" : ""}>
                {n}
              </i>
            ))}
          </div>
        </div>
        <span className="mini-notification">
          <span className="pink-text">♡</span> Your anniversary <b>In 7 days</b>
        </span>
      </div>
    );
  if (type === "message")
    return (
      <div className="feature-visual">
        <div className="mini-message">
          <Sparkles size={15} />
          <p>
            “It’s the little things you do that make my everyday feel special.”
          </p>
          <span>
            Warm & thoughtful <Check size={12} />
          </span>
        </div>
      </div>
    );
  if (type === "gift")
    return (
      <div className="feature-visual">
        <div className="gift-illustration">
          <div className="book book-one" />
          <div className="book book-two" />
          <div className="book book-three" />
          <span>
            <Gift size={17} />
          </span>
        </div>
        <div className="gift-caption">
          <strong>Their next favourite chapter</strong>
          <span>Inspired by their love of books</span>
        </div>
      </div>
    );
  return (
    <div className="feature-visual">
      <div className="insight-visual">
        <div>
          <Heart size={16} />
          <span>A LITTLE CONNECTION CHECK-IN</span>
        </div>
        <p>A good day to reach out.</p>
        <div className="connection-line">
          {[25, 36, 29, 49, 43, 65, 80, 71, 94, 86, 110, 120].map((n, i) => (
            <i key={i} style={{ height: n / 2 }} />
          ))}
        </div>
        <span>Small moments add up.</span>
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="hero container" id="home">
          <div className="hero-copy">
            <div className="eyebrow hero-tag">
              <span className="status-dot" /> A LITTLE INTELLIGENCE. A LOT MORE
              CONNECTION.
            </div>
            <h1>
              Make Every
              <br />
              Connection
              <br />
              <span>More Meaningful.</span>
            </h1>
            <p>
              Remember what matters. Say what feels right.
              <br className="desktop-break" /> Create thoughtful moments. Your
              personal AI companion
              <br className="desktop-break" /> for the people who mean the most.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/signup">
                Get started <ArrowUpRight size={17} />
              </Link>
              <a className="button secondary" href="#how-it-works">
                <span className="play-icon">
                  <Play size={11} fill="currentColor" />
                </span>
                See how it works
              </a>
            </div>
            <div className="hero-note">
              <ShieldCheck size={14} />
              Thoughtful connections, powered by AI.
            </div>
          </div>
          <ProductPreview />
          <div className="hero-bottom">
            <span>LESS “I MEANT TO.” MORE “I THOUGHT OF YOU.”</span>
            <a href="#features">
              Discover a more thoughtful everyday <ArrowRight size={14} />
            </a>
          </div>
        </section>
        <section className="problem section container">
          <div className="section-heading centered">
            <span className="eyebrow">HUMAN CONNECTION. MEET REAL LIFE.</span>
            <h2>
              Being thoughtful shouldn’t
              <br />
              be difficult.
            </h2>
            <p>
              Life gets busy. The people you care about shouldn’t get lost in
              it.
            </p>
          </div>
          <div className="problem-grid">
            {[
              {
                icon: CalendarDays,
                title: "The dates that slip by.",
                copy: "That anniversary you remembered a day too late. The milestone lost in a busy week.",
              },
              {
                icon: MessageSquare,
                title: "The words that won’t come.",
                copy: "You know how much they mean to you. Finding the words is another story.",
              },
              {
                icon: Heart,
                title: "The “I’ll do it tomorrow.”",
                copy: "Good intentions are easy. Making space for small, thoughtful gestures takes a little help.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <Icon size={21} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="problem-close">
            Turn “I should” into <span>“I’m glad I did.”</span>
          </p>
        </section>
        <section className="section container features" id="features">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">
                A LITTLE HELP. A MEANINGFUL DIFFERENCE.
              </span>
              <h2>
                For the moments
                <br />
                that make us closer.
              </h2>
            </div>
            <p>
              Everything you need to turn good intentions
              <br />
              into thoughtful everyday actions.
              <br />
              <Link href="/dashboard?demo=1" className="text-link">
                Explore the demo workspace <ArrowUpRight size={14} />
              </Link>
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, label, description, type }) => (
              <article className="feature-card" key={type}>
                <div className="feature-card-head">
                  <span className="feature-icon">
                    <Icon size={20} />
                  </span>
                  <span className="eyebrow micro">{label}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <FeatureVisual type={type} />
              </article>
            ))}
          </div>
          <p className="tiny muted section-footnote">
            Profiles and reminders work in the demo workspace. Live AI requires
            configuration. Advanced relationship intelligence is planned.
          </p>
        </section>
        <section className="section how-section" id="how-it-works">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">THOUGHTFULNESS, MADE EFFORTLESS</span>
              <h2>
                A little context.
                <br />A more personal connection.
              </h2>
              <p>You know your people. We help you show it.</p>
            </div>
            <div className="steps">
              {[
                {
                  title: "Share what matters.",
                  copy: "Add your people, their favourite things, and the dates you never want to miss.",
                  icon: UserRound,
                },
                {
                  title: "Let the little details connect.",
                  copy: "AI uses the context you choose to share to find relevant words, ideas, and inspiration.",
                  icon: BrainCircuit,
                },
                {
                  title: "Make their day.",
                  copy: "Turn a timely nudge into a thoughtful note, a little surprise, or a moment together.",
                  icon: Heart,
                },
              ].map(({ title, copy, icon: Icon }, i) => (
                <article key={title}>
                  <div className="step-line">
                    <span className="step-icon">
                      <Icon size={26} />
                    </span>
                    {i < 2 && <span className="step-connector" />}
                  </div>
                  <span className="eyebrow">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="demo">
          <div className="section-heading split">
            <div>
              <span className="eyebrow">
                <Sparkles size={13} /> MEET YOUR PERSONAL RELATIONSHIP AI
              </span>
              <h2>
                Thoughtful starts
                <br />
                with a little inspiration.
              </h2>
            </div>
            <p>
              Someone on your mind? Try a little context
              <br />
              and see what a meaningful moment could look like.
              <br />
              <span className="tiny muted">
                Interactive sample · No account needed
              </span>
            </p>
          </div>
          <Assistant />
        </section>
        <section className="section technology-section" id="technology">
          <div className="container">
            <div className="section-heading split">
              <div>
                <span className="eyebrow">
                  BUILT WITH INTELLIGENCE. DESIGNED WITH HEART.
                </span>
                <h2>
                  Human at the core.
                  <br />
                  Intelligent by design.
                </h2>
              </div>
              <p>
                We’re developing a personalization engine that turns
                <br />
                the context you share into timely, relevant suggestions.
                <br />A thoughtful experience, with a clear technical
                foundation.
              </p>
            </div>
            <div className="technology-layout">
              <div className="architecture">
                <span className="eyebrow micro">
                  THE PATH FROM CONTEXT TO CONNECTION
                </span>
                {[
                  {
                    icon: UserRound,
                    title: "The context you choose to share",
                    sub: "People · Occasions · Interests · Preferences",
                    status: "Input",
                  },
                  {
                    icon: Layers,
                    title: "Emakings application",
                    sub: "Profiles, reminders & context assembly",
                    status: "MVP",
                  },
                  {
                    icon: BrainCircuit,
                    title: "Personalization & AI inference",
                    sub: "Validated prompts → configurable model provider",
                    status: "Configurable",
                  },
                  {
                    icon: Network,
                    title: "Scalable model serving",
                    sub: "Compatible endpoints · Flexible deployment",
                    status: "Planned",
                  },
                  {
                    icon: Heart,
                    title: "A meaningful next step",
                    sub: "Personalized suggestion → your thoughtful action",
                    status: "Output",
                  },
                ].map(({ icon: Icon, title, sub, status }, i) => (
                  <div className="arch-step" key={title}>
                    <div className={i === 3 ? "arch-box planned" : "arch-box"}>
                      <Icon size={20} />
                      <div>
                        <strong>{title}</strong>
                        <span>{sub}</span>
                      </div>
                      <span className="arch-status">{status}</span>
                    </div>
                    {i < 4 && <span className="arch-arrow">↓</span>}
                  </div>
                ))}
              </div>
              <div className="tech-details">
                <span className="pill">Personalization roadmap · Planned</span>
                <h3>
                  More personal.
                  <br />
                  Built to grow.
                </h3>
                <p>
                  Today, a server-side, OpenAI-compatible provider adapter
                  generates structured suggestions when configured. Your
                  information stays scoped to your account.
                </p>
                <div className="tech-item">
                  <span>01</span>
                  <div>
                    <strong>Flexible model serving</strong>
                    <p>
                      Planned model-serving endpoints for compatible language
                      models, without changing the application interface.
                    </p>
                  </div>
                </div>
                <div className="tech-item">
                  <span>02</span>
                  <div>
                    <strong>Model evaluation</strong>
                    <p>
                      Explore domain-specific customization and evaluate
                      relevance, tone, and suggestion quality using consented
                      datasets.
                    </p>
                  </div>
                </div>
                <div className="tech-item">
                  <span>03</span>
                  <div>
                    <strong>Efficient inference</strong>
                    <p>
                      Investigate supported model optimization, response
                      latency, throughput, and inference cost as workloads grow.
                      Retrieval-based memory and multimodal context are future
                      work.
                    </p>
                  </div>
                </div>
                <p className="tiny tech-disclaimer">
                  Core generation requires a configured provider. Advanced
                  personalization and infrastructure optimizations are planned.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section container privacy-section">
          <div className="privacy-heading">
            <span className="privacy-emblem">
              <ShieldCheck size={34} />
            </span>
            <span className="eyebrow">PERSONAL MEANS PERSONAL</span>
            <h2>
              Your moments.
              <br />
              Your information. Your choice.
            </h2>
            <p>
              Meaningful connections start with trust. Privacy is part of how
              we’re building Emakings, from the very first interaction.
            </p>
            <Link href="/privacy" className="text-link">
              Our approach to privacy <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="privacy-points">
            {[
              {
                icon: LockKeyhole,
                title: "A space that belongs to you.",
                copy: "Supabase authentication and account-scoped database policies protect private workspace records when configured.",
              },
              {
                icon: SlidersHorizontal,
                title: "You choose what to share.",
                copy: "Add only the context you’re comfortable with. Edit, export, or delete your records and control suggestion history.",
              },
              {
                icon: Sparkles,
                title: "No mysteries behind the magic.",
                copy: "Live AI processes the context you submit. Sample demos stay in your browser. We never claim access to your private conversations.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <Icon size={20} />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section container roadmap" id="roadmap">
          <div className="section-heading centered">
            <span className="eyebrow">SMALL STEPS. A THOUGHTFUL FUTURE.</span>
            <h2>Growing with every connection.</h2>
            <p>
              A clear view of what works today, and what we’re building toward.
            </p>
          </div>
          <div className="roadmap-grid">
            {[
              {
                n: "01",
                status: "MVP · Configuration required",
                title: "The thoughtful essentials.",
                items: [
                  "Profiles & important dates",
                  "Reminder management",
                  "Configurable AI generation",
                  "Browser-local sample workspace",
                ],
              },
              {
                n: "02",
                status: "Planned",
                title: "A little more understanding.",
                items: [
                  "Context-aware relationship insights",
                  "Retrieval-based preference memory",
                  "More personal recommendations",
                  "Multilingual experiences",
                ],
              },
              {
                n: "03",
                status: "Planned",
                title: "Intelligence at scale.",
                items: [
                  "Optimized model inference",
                  "Domain-specific model evaluation",
                  "Scalable AI workloads",
                  "Expanded AI capabilities",
                ],
              },
            ].map((s) => (
              <article key={s.n}>
                <div>
                  <span className="roadmap-number">{s.n}</span>
                  <span className="pill">{s.status}</span>
                </div>
                <h3>{s.title}</h3>
                {s.items.map((t) => (
                  <p key={t}>
                    <Check size={13} />
                    {t}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
        <section className="section container about-section" id="about">
          <div>
            <span className="eyebrow">WHY WE’RE HERE</span>
            <h2>
              Technology should
              <br />
              bring people closer.
            </h2>
            <p>
              Emakings is a founder-operated AI technology initiative with a
              simple belief: the little things are the big things.
            </p>
            <p>
              We combine artificial intelligence, personalization, and
              thoughtful design to help people be more intentional in their
              everyday relationships. Less mental load. More meaningful moments.
            </p>
          </div>
          <div className="founder-card">
            <div className="founder-avatar">
              <UserRound size={37} />
            </div>
            <span className="eyebrow micro">THE PERSON BEHIND THE PURPOSE</span>
            <h3>Meet the founder</h3>
            <span className="muted tiny">Founder & builder · Emakings AI</span>
            <p>
              A founder-led initiative building tools for more thoughtful
              connections.
            </p>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/kolawole-ni-mat-2997a154/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with the founder on LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
        <section className="container cta-section" id="waitlist">
          <span className="cta-spark">
            <Sparkles size={29} />
          </span>
          <span className="eyebrow">
            THE NEXT LITTLE MOMENT STARTS WITH YOU
          </span>
          <h2>
            Make room for
            <br />
            <span>more meaningful moments.</span>
          </h2>
          <p>
            A little less forgetting. A little more feeling connected.
            <br />
            Be among the first to experience Emakings.
          </p>
          <Waitlist />
          <Link href="/dashboard?demo=1" className="text-link tiny">
            Take a look around the demo first <ArrowRight size={13} />
          </Link>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Emakings AI",
            url: "https://emakings.site",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            description:
              "An AI relationship companion for thoughtful messages, reminders, and personalized suggestions.",
          }),
        }}
      />
    </>
  );
}
