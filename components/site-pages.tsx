import { ArrowDownRight, ArrowLeft, ArrowUpRight, Check, Mail, MapPin } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'wouter';
import { EnergyScene } from '@/components/energy-scene';
import { SiteFooter, SiteHeader } from '@/components/site-shell';

type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  location: string;
  detail: string;
  facts: [string, string][];
};

const projects: Project[] = [
  {
    slug: 'american-module',
    number: '01',
    category: 'Manufacturing',
    title: 'American module, built for the long horizon.',
    description: 'A domestic manufacturing platform designed to make the next generation of solar infrastructure more resilient.',
    location: 'Southeastern United States',
    detail: 'Convalt is building an American manufacturing base that treats modules as long-lived infrastructure, not disposable components. The platform brings process discipline, supply-chain clarity, and a local workforce into the same room.',
    facts: [['Business', 'Solar manufacturing'], ['Status', 'In development'], ['Focus', 'Domestic supply'], ['Approach', 'Integrated delivery']],
  },
  {
    slug: 'the-reserve',
    number: '02',
    category: 'Power generation',
    title: 'The Reserve / power where it matters.',
    description: 'Utility-scale generation that turns land, light, and long-term thinking into dependable American power.',
    location: 'New York + the United States',
    detail: 'The Reserve is our point of view on power generation: carefully sited, operationally durable, and connected to the communities and infrastructure it serves. Every project is an exercise in patient scale.',
    facts: [['Business', 'Renewable generation'], ['Status', 'Portfolio active'], ['Focus', 'Grid resilience'], ['Approach', 'Site to service']],
  },
  {
    slug: 'northstar-compute',
    number: '03',
    category: 'AI infrastructure',
    title: 'Northstar / compute with a conscience.',
    description: 'A new class of data-center infrastructure pairing clean power with the intelligence economy.',
    location: 'Northeast United States',
    detail: 'Northstar connects renewable power, high-performance computing, and responsible site design. We are developing the physical conditions for AI to grow without losing sight of energy, water, and place.',
    facts: [['Business', 'AI infrastructure'], ['Status', 'Site planning'], ['Focus', 'High-performance compute'], ['Approach', 'Power first']],
  },
  {
    slug: 'second-life',
    number: '04',
    category: 'Recycling',
    title: 'Second life / nothing left behind.',
    description: 'Recovery systems that keep valuable materials in circulation as the energy transition accelerates.',
    location: 'United States',
    detail: 'Second Life closes the loop on the materials we put to work. From end-of-life modules to industrial byproducts, the business is designed to recover value with less waste and a better view of what comes next.',
    facts: [['Business', 'Recycling'], ['Status', 'Platform buildout'], ['Focus', 'Material recovery'], ['Approach', 'Circular by design']],
  },
];

const mediaItems = [
  ['08.14.24', 'Inside the American manufacturing opportunity', 'Film'],
  ['06.03.24', 'Four businesses. One integrated value chain.', 'Field note'],
  ['03.19.24', 'What responsible compute looks like on the ground', 'Conversation'],
  ['11.02.23', 'Second Life: designing for the material afterlife', 'Dispatch'],
];

const resourceItems = [
  ['Platform overview', 'A concise view of how Convalt connects manufacturing, generation, infrastructure, and recovery.', 'Download brief'],
  ['Project principles', 'The questions we ask before land, capital, and conscience become a project.', 'Read principles'],
  ['Energy transition notes', 'Occasional field notes from the work of building a more durable energy system.', 'Browse notes'],
];

export function HomePage() {
  const [activeSection, setActiveSection] = useState(0);
  const scrollFrame = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        setActiveSection(Math.min(3, window.scrollY / Math.max(window.innerHeight, 1)));
        scrollFrame.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  useEffect(() => {
    const animated = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: .18 },
    );
    animated.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="convalt-site">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <EnergyScene activeSection={activeSection} />
          <div className="hero-content">
            <div className="eyebrow reveal">An integrated energy company</div>
            <h1 id="hero-title" className="reveal reveal-delay">Building the<br />energy of tomorrow.</h1>
            <p className="hero-copy reveal reveal-delay">American manufacturing. Global energy development. Integrated AI infrastructure. One connected value chain for a world in motion.</p>
          </div>
          <div className="hero-foot">
            <a className="scroll-cue" href="#story" data-testid="link-scroll-story"><span className="scroll-line" /> Enter the story <ArrowDownRight size={14} /></a>
            <span className="hero-coords">40°42′46″ N / 74°00′21″ W</span>
          </div>
        </section>

        <section id="story" className="section section-dark">
          <div className="section-grid" data-animate>
            <span className="section-label">The proposition / 00</span>
            <div>
              <h2>Scale is a responsibility, not a finish line.</h2>
              <p className="section-intro">Convalt brings the pieces of the energy transition into one conversation. We make, generate, host, and recover — with capital and conscience in the same frame.</p>
            </div>
          </div>
        </section>

        <section className="section section-tint" aria-labelledby="chain-heading">
           <div className="chain-header" data-animate>
            <div>
              <span className="section-label">The platform / 01</span>
              <h2 id="chain-heading">Four businesses.<br />One integrated<br />value chain.</h2>
            </div>
            <span className="chain-index">Scroll to explore / 01—04</span>
          </div>
           <div className="chain-list" data-animate>
             {projects.map((project, index) => (
               <Link key={project.slug} href={`/projects/${project.slug}`} className="chain-item" data-animate data-testid={`link-chain-${project.slug}`} style={{ transitionDelay: `${index * 80}ms` }}>
                <span className="chain-no">{project.number}</span>
                <h3>{project.category}</h3>
                <p>{project.description}</p>
                <span className="chain-arrow"><ArrowUpRight size={18} strokeWidth={1.4} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="principle section">
          <div className="principle-inner" data-animate>
            <blockquote>Construct with capital and conscience.</blockquote>
            <cite>Our operating principle — because the infrastructure we build will outlast the moment that created it.</cite>
          </div>
        </section>

        <section className="section section-dark">
          <div className="cta-band" data-animate>
            <div>
              <span className="section-label">The next move / 02</span>
              <h2>Bring us the hard part.</h2>
              <p className="section-intro">A site. A system. A question about what energy can become. We are building with people who think in decades.</p>
            </div>
            <Link href="/contact" className="button-primary" data-testid="link-home-contact">Start a conversation <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ProjectsPage() {
  return (
    <div className="convalt-site">
      <SiteHeader light />
      <main className="page-main">
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="eyebrow">Selected work / 04 businesses</div>
            <h1>Projects that make the system visible.</h1>
            <p>Each project is a point of connection: between American industry and global demand, between power and possibility, between what we build and what remains.</p>
          </div>
        </section>
        <section className="section">
          <div className="project-grid">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="project-card" data-testid={`card-project-${project.slug}`}>
                <div className="project-card-top"><span>{project.number} / {project.category}</span><ArrowUpRight size={17} strokeWidth={1.4} /></div>
                <div><h2>{project.title}</h2><p>{project.description}</p></div>
                <div className="project-card-top"><span>{project.location}</span><span>View project</span></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ProjectDetailPage() {
  const params = useParams<{ slug?: string }>();
  const project = useMemo(() => projects.find((item) => item.slug === params.slug) ?? projects[0], [params.slug]);
  return (
    <div className="convalt-site">
      <SiteHeader />
      <main className="page-main">
        <section className="detail-hero">
          <div className="detail-hero-inner">
            <Link href="/projects" className="button-quiet" data-testid="link-back-projects"><ArrowLeft size={13} /> Back to projects</Link>
            <div className="eyebrow" style={{ marginTop: '4rem' }}>{project.number} / {project.category}</div>
            <h1>{project.title}</h1>
            <div className="detail-meta"><span>{project.location}</span><span>{project.facts[1][1]}</span><span>Convalt Energy</span></div>
          </div>
        </section>
        <section className="detail-body">
          <div className="detail-columns">
            <span className="section-label">Field note / {project.number}</span>
            <div><h2>{project.description}</h2><div className="info-list">{project.facts.map(([label, value]) => <div className="info-row" key={label}><span>{label}</span><span>{value}</span></div>)}</div></div>
          </div>
          <div className="detail-visual" role="img" aria-label={`${project.category} abstract project visual`} />
          <div className="detail-columns" style={{ marginTop: 'clamp(4rem, 9vw, 9rem)' }}>
            <span className="section-label">Why it matters</span>
            <div><p>{project.detail}</p><p>We are assembling the capital, capability, and care to move this work from a compelling idea into useful infrastructure. The work is early. The direction is clear.</p><Link href="/contact" className="button-primary" data-testid="link-detail-contact">Talk to the team <ArrowUpRight size={15} /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function EditorialPage({ kind, title, description, children }: { kind: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="convalt-site">
      <SiteHeader light />
      <main className="page-main">
        <section className="page-hero"><div className="page-hero-inner"><div className="eyebrow">{kind}</div><h1>{title}</h1><p>{description}</p></div></section>
        <section className="section"><div className="article-list">{children}</div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function TeamPage() {
  return (
    <EditorialPage kind="The people / 03" title="Good infrastructure starts with a point of view." description="We are a small, senior team working across capital, development, engineering, and operations. Different disciplines. One standard of care.">
      <div className="detail-columns"><span className="section-label">The team</span><div><h2>We prefer useful questions to easy answers.</h2><p className="section-intro">Convalt is built around people who have spent time inside the energy system — and still believe it can be made more durable, more American, and more human.</p></div></div>
      <div className="info-list" style={{ marginTop: '7rem' }}>
        {['Development / turning place into possibility', 'Capital / patient money for permanent work', 'Engineering / details that survive contact', 'Operations / keeping the promise in motion'].map((item, index) => <div className="info-row" key={item}><span>0{index + 1}</span><span>{item}</span></div>)}
      </div>
    </EditorialPage>
  );
}

export function MediaPage() {
  return <EditorialPage kind="Media / moving image" title="The work, in the field." description="Short films, conversations, and dispatches from the places where the energy transition becomes physical.">
    {mediaItems.map(([date, title, type]) => <a className="article-row" href="#media-item" key={title} data-testid={`link-media-${date}`}><time>{date}</time><h2>{title}</h2><span className="article-type">{type} <ArrowUpRight size={13} /></span></a>)}
  </EditorialPage>;
}

export function PressPage() {
  return <EditorialPage kind="Press / in the record" title="What is being said." description="Announcements, milestones, and the occasional useful quote from the people building the energy of tomorrow.">
    {[
      ['09.12.24', 'Convalt Energy announces expansion of American solar manufacturing platform', 'Announcement'],
      ['04.25.24', 'Convalt Energy launches integrated AI infrastructure practice', 'Release'],
      ['12.07.23', 'A new model for the energy value chain', 'Interview'],
    ].map(([date, title, type]) => <a className="article-row" href="#press-item" key={title} data-testid={`link-press-${date}`}><time>{date}</time><h2>{title}</h2><span className="article-type">{type} <ArrowUpRight size={13} /></span></a>)}
  </EditorialPage>;
}

export function ResourcesPage() {
  return <EditorialPage kind="Resources / shared ground" title="A better way to see the whole system." description="Read the briefs and field notes that shape how we think about energy, industry, infrastructure, and the space between them.">
    {resourceItems.map(([title, description, action], index) => <a className="article-row" href="#resource-item" key={title} data-testid={`link-resource-${index}`}><span className="article-type">0{index + 1}</span><div><h2>{title}</h2><p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6, margin: '.8rem 0 0', fontSize: '.85rem' }}>{description}</p></div><span className="article-type">{action} <ArrowUpRight size={13} /></span></a>)}
  </EditorialPage>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return (
    <div className="convalt-site">
      <SiteHeader light />
      <main className="page-main">
        <section className="page-hero"><div className="page-hero-inner"><div className="eyebrow">Contact / the next move</div><h1>Let’s make something durable.</h1><p>Tell us what you are building, where it lives, or what the system is missing. We will get back to you with a useful next step.</p></div></section>
        <section className="section">
          <div className="contact-grid">
            <div className="contact-panel"><h2>Bring us the hard part.</h2><p>For project inquiries, partnerships, media, or simply a good question:</p><a className="button-quiet" href="mailto:hello@convalt.com" data-testid="link-contact-email"><Mail size={14} /> hello@convalt.com</a><div style={{ marginTop: '4rem', color: 'hsl(var(--muted-foreground))', font: '.68rem var(--app-font-mono)', lineHeight: 1.7 }}><MapPin size={15} style={{ marginBottom: '.6rem' }} /><br />New York, NY<br />United States</div></div>
            <div className="contact-panel">
              {sent ? <div className="form-success" data-testid="status-contact-success"><Check size={17} /> <strong>Message received.</strong><br />We’ll be in touch with a considered reply.</div> : <form className="contact-form" onSubmit={submit}><label htmlFor="name">Your name<input id="name" name="name" required data-testid="input-contact-name" /></label><label htmlFor="email">Email address<input id="email" name="email" type="email" required data-testid="input-contact-email" /></label><label htmlFor="message">What are you working on?<textarea id="message" name="message" rows={5} required data-testid="input-contact-message" /></label><button type="submit" className="button-primary" data-testid="button-submit-contact">Send a note <ArrowUpRight size={14} /></button></form>}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}