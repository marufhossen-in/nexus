import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import { PORTFOLIO } from '../../data/portfolio';
import { WORK, PRINCIPLES, CAPABILITIES } from '../../data/work';

gsap.registerPlugin(ScrollTrigger);

function SecHead({ num, title, sub }: { num: string; title: string; sub: string }): ReactElement {
  return (
    <>
      <div className="nx-sec-head nx-reveal">
        <span className="nx-sec-num">{num}</span>
        <h2 className="nx-sec-title">{title}</h2>
      </div>
      <p className="nx-sec-sub nx-reveal">{sub}</p>
      <div className="nx-rule nx-reveal" />
    </>
  );
}

export function Sections(): ReactElement {
  const root = useRef<HTMLElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.nx-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="nx-main">
      {/* APPROACH */}
      <section id="about" className="nx-section">
        <SecHead num="01" title="APPROACH" sub="THE METHOD BEHIND OUR WORK" />
        <div className="nx-intro-grid">
          <div>
            <h3 className="nx-intro-title nx-reveal">
              We do not just build screens. We build <em>the system behind them.</em>
            </h3>
            <p className="nx-prose nx-reveal">
              A strong digital product needs more than attractive screens. It needs a clear structure, reusable
              components, consistent interaction, and performance that holds up as the product grows.
              We bring those decisions together early so the final interface is easier to build, easier
              to maintain, and easier for users to understand.
            </p>
            <p className="nx-prose nx-reveal">
              Across our portfolio, we apply the same discipline to different product contexts: a defined
              design system, a reusable component foundation, purposeful interaction, responsive
              behavior, and performance-conscious implementation.
            </p>
            <div className="nx-facts nx-reveal">
              <div className="nx-fact">
                <b>4</b>
                <span>PRODUCT DOMAINS EXPLORED</span>
              </div>
              <div className="nx-fact">
                <b>1</b>
                <span>SYSTEM-THINKING METHOD</span>
              </div>
              <div className="nx-fact">
                <b>BUILT-IN</b>
                <span>PERFORMANCE CONSIDERED</span>
              </div>
            </div>
          </div>
          <div className="nx-principles nx-reveal">
            {PRINCIPLES.map((p) => (
              <div key={p.id} className="nx-principle">
                <span className="nx-p-idx">{p.id}</span>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR STRIP */}
      <section className="nx-tour-sec nx-reveal" aria-label="Built for different product contexts">
        <div className="nx-tour-head">
          <h3>Built for different product contexts</h3>
          <span>SCROLL →</span>
        </div>
        <div className="nx-tour-track">
          {WORK.map((w) => (
            <a key={w.id} className="nx-tour-card" href={`#${w.id}`}>
              <div className="nx-tour-shot">
                <img src={w.main} alt={`${w.title} thumbnail`} loading="lazy" />
              </div>
              <div className="nx-tour-foot">
                <span>{w.title.split(' — ')[0]}</span>
                <em>{w.industry}</em>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="projects" className="nx-section">
        <SecHead num="02" title="SELECTED WORK" sub="FOUR PRODUCT BUILDS // ONE ENGINEERING STANDARD" />
        <p className="nx-prose nx-reveal" style={{ marginBottom: 20 }}>
          Different product contexts demand different design decisions. Our selected builds show how the same
          system-led frontend discipline can adapt to data-heavy SaaS, healthcare, logistics, and real-estate
          experiences.
        </p>
        <p className="nx-prose nx-reveal" style={{ marginBottom: 34, opacity: 0.72 }}>
          These are selected portfolio builds created to demonstrate our approach and capabilities. Client
          engagements and commercial results are presented separately when applicable.
        </p>

        {WORK.map((w) => (
          <article
            key={w.id}
            id={w.id}
            className={`nx-work${w.flip ? ' flip' : ''}`}
            data-accent={w.accent}
          >
            <div className="nx-work-visual nx-reveal">
              <a
                className="nx-work-stack"
                href={w.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${w.title.split(' — ')[0]} live in a new tab`}
              >
                <span className="nx-browser">
                  <span className="nx-browser-bar">
                    <span className="nx-dots">
                      <i /> <i /> <i />
                    </span>
                    <span className="nx-url">{w.urlLabel}</span>
                  </span>
                  <span className="nx-imgbox">
                    <img src={w.main} alt={`${w.title} main screenshot`} loading="lazy" />
                  </span>
                </span>
                <span className="nx-shot-b nx-browser" aria-hidden="true">
                  <span className="nx-imgbox">
                    <video autoPlay muted loop playsInline preload="metadata" poster={w.alt}>
                      <source src={w.video} type="video/mp4" />
                    </video>
                  </span>
                </span>
              </a>
            </div>
            <div className="nx-work-info nx-reveal">
              <p className="nx-p-idx">{w.id} / 04</p>
              <span className="nx-industry-tag">{w.industry}</span>
              <h3>{w.title}</h3>
              <p className="nx-prose" style={{ maxWidth: '46ch' }}>
                {w.description}
              </p>
              <div className="nx-chips">
                {w.chips.map((c) => (
                  <span key={c} className="nx-chip">
                    {c}
                  </span>
                ))}
              </div>
              <div className="nx-work-actions">
                <a className="nx-live" href={w.url} target="_blank" rel="noreferrer">
                  VIEW LIVE BUILD ↗
                </a>
                <span className="nx-role-note">{w.role}</span>
              </div>
            </div>
          </article>
        ))}

        {/* ARCHITECTURE PANEL */}
        <div className="nx-arch-panel nx-reveal">
          <div className="nx-arch-head">
            <span className="nx-sec-num">THE COMMON ARCHITECTURE</span>
            <h3>Four products. The same foundation.</h3>
          </div>
          <div className="nx-arch-grid">
            {WORK.map((w) => (
              <div key={w.id} className="nx-arch-col">
                <p className="nx-a-ind">{w.industry}</p>
                <h4>{w.title.split(' — ')[0]}</h4>
                <div className="nx-arch-rows">
                  {w.arch.map((row) => (
                    <p key={row.label} className={`nx-arch-row${row.domain ? ' domain' : ''}`}>
                      {row.domain ? '＋' : '✓'} {row.label}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="nx-arch-note">
            Different domain. Same system-led foundation.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="nx-section">
        <SecHead num="03" title="CAPABILITIES" sub="CAPABILITY, ENGINEERED FOR REAL PRODUCTS" />
        <div className="nx-caps-grid">
          {CAPABILITIES.map((c) => (
            <article key={c.id} className="nx-cap-card nx-reveal">
              <p className="nx-p-idx">{c.id}</p>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              <div className="nx-cap-tags">
                {c.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="nx-manifesto nx-reveal">
          <p>Every build follows the same baseline —</p>
          <div className="nx-manifesto-items">
            <span>Semantic structure</span>
            <span>Responsive to 360px</span>
            <span>Accessible by default</span>
            <span>Animated with intent</span>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="nx-section">
        <SecHead num="04" title="CONTACT" sub="HAVE A PRODUCT TO BUILD, IMPROVE, OR SCALE?" />
        <div className="nx-contact-panel nx-reveal">
          <div className="nx-contact-main">
            <p className="nx-prose">
              Tell us about the product, the goals, the constraints, and the timeline. We will review the brief,
              identify the key frontend requirements, and respond with a practical view of scope, risks,
              and the right next step.
            </p>
            <div className="nx-contact-actions">
              <a className="nx-btn-primary" href={`mailto:${PORTFOLIO.contact.email}`}>
                {PORTFOLIO.contact.email.toUpperCase()}
              </a>
              <a className="nx-btn-ghost" href="#projects">
                REVISIT THE WORK
              </a>
            </div>
            <p className="nx-contact-note">
              Prefer a call or a written brief? Either works. We start with the information you already have.
            </p>
          </div>
          <div className="nx-contact-side">
            <div className="nx-meta-row">
              <span className="k">LOCATION</span>
              <span className="v">Dhaka, Bangladesh · UTC+6</span>
            </div>
            <div className="nx-meta-row">
              <span className="k">AVAILABILITY</span>
              <span className="v">
                <i className="nx-pulse" /> Open for selected projects
              </span>
            </div>
            <div className="nx-meta-row">
              <span className="k">RESPONSE TIME</span>
              <span className="v">Within 48 hours</span>
            </div>
            <div className="nx-meta-row">
              <span className="k">WORKING RANGE</span>
              <span className="v">Remote — overlap with EU &amp; US East</span>
            </div>
          </div>
        </div>
      </section>

      {/* APPRECIATION */}
      <section className="nx-appreciation nx-reveal">
        <span className="nx-app-mark">◈</span>
        <h2>Thank you for your time.</h2>
        <p className="nx-prose" style={{ maxWidth: '52ch', margin: '0 auto' }}>
          Good frontend work is not only about how a product looks on launch day. It is about how clearly it
          works, how consistently it behaves, and how well the system supports what comes next. That is
          the standard we bring to every project.
        </p>
        <p className="nx-app-sig">NEXUS</p>
      </section>

      <footer className="nx-footer">
        <span>NEXUS // DIGITAL PRODUCT &amp; FRONTEND ENGINEERING © 2026</span>
        <span>DESIGNED, ENGINEERED, AND BUILT AS ONE SYSTEM</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ RETURN TO CORE</button>
      </footer>
    </main>
  );
}
