import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Tailwind,
  Link,
  Row,
  Column,
  Img,
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments?: Array<{ filename: string; size: number }>;
}

/* ── helpers ─────────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2 && parts[0] && parts[parts.length - 1])
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

const timestamp = new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Nairobi",
  timeZoneName: "short",
});

/* ═══════════════════════════════════════════════════════════
   EMAIL COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ContactFormEmail({
  name,
  email,
  subject,
  message,
  attachments,
}: ContactFormEmailProps) {
  const replyUrl = `mailto:${email}?subject=Re%3A%20${encodeURIComponent(subject)}&body=Hi%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20reaching%20out!%0A%0A`;
  const gmailSearchUrl = `https://mail.google.com/mail/u/0/#search/from%3A${encodeURIComponent(email)}`;
  const initials = getInitials(name);

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>New Portfolio Message — {subject}</title>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          /* reset */
          body, table, td, th { border-collapse: collapse; }
          img { border: 0; display: block; }

          /* dark-mode overrides for supported clients */
          @media (prefers-color-scheme: dark) {
            .email-body   { background-color: #080b10 !important; }
            .email-outer  { background-color: #080b10 !important; }
          }
        `}</style>
      </Head>

      <Preview>
        ✉️ {name} sent you a message: "{subject}"
      </Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand:   "#10b981",   /* emerald-500  */
                brand2:  "#14b8a6",   /* teal-500     */
                dark:    "#0d1117",
                card:    "#161b22",
                border:  "#21262d",
                muted:   "#8b949e",
                fg:      "#e6edf3",
                fgDim:   "#7d8590",
              },
              fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
              },
            },
          },
        }}
      >
        {/* ── outer body ── */}
        <Body
          className="email-body bg-dark font-sans m-0 p-0"
          style={{ backgroundColor: "#0d1117" }}
        >
          {/* ── page wrapper ── */}
          <Container
            className="email-outer mx-auto max-w-xl py-10 px-4"
            style={{ maxWidth: 580 }}
          >

            {/* ══════════ HEADER CARD ══════════ */}
            <Section
              style={{
                background: "linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)",
                borderRadius: "16px 16px 0 0",
                padding: "0",
                overflow: "hidden",
                border: "1px solid #21262d",
                borderBottom: "none",
              }}
            >
              {/* Emerald glow strip */}
              <div
                style={{
                  height: 3,
                  background: "linear-gradient(90deg, #10b981, #14b8a6, #06b6d4)",
                  borderRadius: "16px 16px 0 0",
                }}
              />

              <div style={{ padding: "32px 36px 28px" }}>
                <Row>
                  <Column>
                    {/* Brand mark */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #10b981, #14b8a6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 13,
                          color: "#fff",
                          letterSpacing: "-0.5px",
                          marginRight: 10,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        KA
                      </div>
                      <Text
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e6edf3",
                          fontFamily: "Inter, sans-serif",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        Khalfan<span style={{ color: "#10b981" }}>.dev</span>
                      </Text>
                    </div>

                    {/* Tag */}
                    <div
                      style={{
                        display: "inline-block",
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.30)",
                        borderRadius: 99,
                        padding: "3px 12px",
                        marginBottom: 14,
                      }}
                    >
                      <Text
                        style={{
                          margin: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#10b981",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        New Contact Message
                      </Text>
                    </div>

                    <Heading
                      as="h1"
                      style={{
                        margin: "0 0 6px",
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#e6edf3",
                        letterSpacing: "-0.6px",
                        lineHeight: 1.25,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Someone reached out
                    </Heading>

                    <Text
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: "#8b949e",
                        lineHeight: 1.5,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      A new message arrived via your portfolio contact form.
                    </Text>
                  </Column>
                </Row>
              </div>
            </Section>

            {/* ══════════ BODY CARD ══════════ */}
            <Section
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderTop: "none",
                borderRadius: "0 0 16px 16px",
                padding: "28px 36px 32px",
              }}
            >

              {/* ── Sender identity block ── */}
              <div
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: 12,
                  padding: "18px 20px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#fff",
                    flexShrink: 0,
                    marginRight: 16,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <Text
                    style={{
                      margin: "0 0 2px",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#e6edf3",
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {name}
                  </Text>
                  <Link
                    href={`mailto:${email}`}
                    style={{
                      color: "#10b981",
                      fontSize: 13,
                      textDecoration: "none",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {email}
                  </Link>
                </div>
              </div>

              {/* ── Subject pill ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 36,
                    background: "linear-gradient(180deg, #10b981, #14b8a6)",
                    borderRadius: 99,
                    marginRight: 14,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <Text
                    style={{
                      margin: "0 0 2px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#8b949e",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Subject
                  </Text>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#e6edf3",
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {subject}
                  </Text>
                </div>
              </div>

              {/* ── Section label ── */}
              <Text
                style={{
                  margin: "0 0 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#8b949e",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Message
              </Text>

              {/* ── Message box ── */}
              <div
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: 12,
                  padding: "20px 22px",
                  marginBottom: 24,
                }}
              >
                {/* Open quote */}
                <div
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: "rgba(16,185,129,0.2)",
                    fontFamily: "Georgia, serif",
                    marginBottom: 8,
                    marginTop: -8,
                    userSelect: "none",
                  }}
                >
                  &#8220;
                </div>
                <Text
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#c9d1d9",
                    whiteSpace: "pre-line",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {message}
                </Text>
              </div>

              {/* ── Attachments ── */}
              {attachments && attachments.length > 0 && (
                <>
                  <Text
                    style={{
                      margin: "0 0 10px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#8b949e",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Attachments ({attachments.length})
                  </Text>
                  <div style={{ marginBottom: 24 }}>
                    {attachments.map((att, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#0d1117",
                          border: "1px solid #21262d",
                          borderRadius: 10,
                          padding: "10px 14px",
                          marginBottom: i < attachments.length - 1 ? 8 : 0,
                        }}
                      >
                        {/* File icon */}
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(99,102,241,0.15)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            marginRight: 12,
                            flexShrink: 0,
                          }}
                        >
                          📎
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#e6edf3",
                              fontFamily: "Inter, sans-serif",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {att.filename}
                          </Text>
                        </div>
                        <Text
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: "#8b949e",
                            fontFamily: "Inter, sans-serif",
                            flexShrink: 0,
                            marginLeft: 10,
                          }}
                        >
                          {formatBytes(att.size)}
                        </Text>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── CTA buttons ── */}
              <Text
                style={{
                  margin: "0 0 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#8b949e",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Quick Actions
              </Text>

              {/* Primary CTA */}
              <div style={{ marginBottom: 10 }}>
                <Link
                  href={replyUrl}
                  style={{
                    display: "block",
                    background: "linear-gradient(135deg, #10b981, #14b8a6)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "center",
                    textDecoration: "none",
                    padding: "13px 24px",
                    borderRadius: 10,
                    letterSpacing: "-0.2px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  ↩ Reply to {name}
                </Link>
              </div>

              {/* Secondary CTA */}
              <div>
                <Link
                  href={gmailSearchUrl}
                  style={{
                    display: "block",
                    background: "#0d1117",
                    color: "#8b949e",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                    textDecoration: "none",
                    padding: "11px 24px",
                    borderRadius: 10,
                    border: "1px solid #21262d",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  🔍 Search previous emails from {email}
                </Link>
              </div>

              {/* ── Divider ── */}
              <div
                style={{
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #21262d 30%, #21262d 70%, transparent)",
                  margin: "28px 0 20px",
                }}
              />

              {/* ── Footer meta ── */}
              <div style={{ textAlign: "center" }}>
                {/* Timestamp badge */}
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.18)",
                    borderRadius: 99,
                    padding: "4px 14px",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "#10b981",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    🕐 {timestamp}
                  </Text>
                </div>

                <Text
                  style={{
                    margin: "0 0 4px",
                    fontSize: 12,
                    color: "#8b949e",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Sent via the contact form on{" "}
                  <Link
                    href="https://khalfanathman.dev"
                    style={{ color: "#10b981", textDecoration: "none" }}
                  >
                    khalfanathman.dev
                  </Link>
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "#7d8590",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Portfolio of Khalfan Athman · Nairobi, Kenya
                </Text>
              </div>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
