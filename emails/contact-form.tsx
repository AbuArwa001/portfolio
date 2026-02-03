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
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments?: Array<{ filename: string; size: number }>;
}

export default function ContactFormEmail({
  name,
  email,
  subject,
  message,
  attachments,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            .hover-primaryLight:hover { color: #818cf8 !important; }
            .hover-bg-primaryLight:hover { background-color: #818cf8 !important; }
            .hover-bg-gray-700:hover { background-color: #374151 !important; }
          `}
        </style>
      </Head>
      <Preview>
        New message from {name} - {subject}
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#6366f1",
                primaryLight: "#818cf8",
                secondary: "#8b5cf6",
                accent: "#f43f5e",
                dark: "#1f2937",
                light: "#f9fafb",
                muted: "#6b7280",
              },
            },
          },
        }}
      >
        <Body className="bg-gradient-to-br from-gray-50 to-gray-100 font-sans py-12 px-4">
          <Container className="mx-auto max-w-2xl rounded-xl shadow-md bg-white overflow-hidden border border-gray-100">
            {/* Header with gradient */}
            <Section className="bg-gradient-to-r from-primary to-primaryLight p-8 text-white">
              <Row>
                <Column>
                  <Heading as="h1" className="text-2xl font-bold m-0 mb-1">
                    New Portfolio Message
                  </Heading>
                  <Text className="text-white/90 m-0 text-sm">
                    You&apos;ve received a new contact form submission
                  </Text>
                </Column>
                <Column width={80} className="text-right align-top">
                  <Text className="text-white/80 text-xs m-0 bg-white/20 py-1.5 px-3 rounded-full inline-block">
                    📧 Contact Form
                  </Text>
                </Column>
              </Row>
            </Section>

            <Container className="px-8 py-6">
              {/* Contact Details Card */}
              <Section className="bg-light rounded-lg p-5 mb-6 border border-gray-100 shadow-sm">
                <Heading
                  as="h2"
                  className="text-base font-semibold text-dark mb-4 flex items-center"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                  Contact Information
                </Heading>

                <Row className="mb-3">
                  <Column width={25}>
                    <Text className="text-dark font-medium m-0 text-sm">
                      Name:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-700 m-0 text-sm">{name}</Text>
                  </Column>
                </Row>

                <Row className="mb-3">
                  <Column width={25}>
                    <Text className="text-dark font-medium m-0 text-sm">
                      Email:
                    </Text>
                  </Column>
                  <Column>
                    <Link
                      href={`mailto:${email}`}
                      className="text-primary m-0 no-underline text-sm hover-primaryLight transition-colors"
                    >
                      {email}
                    </Link>
                  </Column>
                </Row>

                <Row>
                  <Column width={25}>
                    <Text className="text-dark font-medium m-0 text-sm">
                      Subject:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-gray-700 m-0 font-medium text-sm">
                      {subject}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Message Card */}
              <Section className="bg-light rounded-lg p-5 mb-6 border border-gray-100 shadow-sm">
                <Heading
                  as="h2"
                  className="text-base font-semibold text-dark mb-4 flex items-center"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-2"></span>
                  Message Content
                </Heading>
                <Text className="text-gray-700 whitespace-pre-line bg-white p-4 rounded border border-gray-200 text-sm leading-relaxed">
                  {message}
                </Text>
              </Section>

              {/* Attachments Section (if any) */}
              {attachments && attachments.length > 0 && (
                <Section className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100">
                  <Heading
                    as="h2"
                    className="text-base font-semibold text-dark mb-3 flex items-center"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Attachments ({attachments.length})
                  </Heading>
                  <Text className="text-muted text-sm mb-3">
                    This message includes the following files:
                  </Text>
                  <div>
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm bg-white p-2 rounded border border-gray-200 mb-2 last:mb-0"
                      >
                        <span className="text-muted mr-2">📎</span>
                        <span className="text-dark truncate flex-grow">
                          {attachment.filename}
                        </span>
                        <span className="text-muted text-xs">
                          ({(attachment.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Quick Actions - Improved spacing without space utilities */}
              <Section className="bg-green-50 rounded-lg p-5 mb-6 border border-green-100">
                <Heading
                  as="h2"
                  className="text-base font-semibold text-dark mb-4 flex items-center"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Quick Actions
                </Heading>

                {/* Stacked buttons with manual spacing */}
                <div>
                  <div className="mb-3">
                    <Link
                      href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=Hi ${encodeURIComponent(name)}%2C%0A%0AThank you for reaching out!`}
                      className="inline-block bg-primary text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center no-underline w-full hover-bg-primaryLight transition-colors"
                    >
                      📧 Reply to {name}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`https://mail.google.com/mail/u/0/#search/from:${email}`}
                      className="inline-block bg-gray-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center no-underline w-full hover-bg-gray-700 transition-colors"
                    >
                      🔍 Find Previous Emails
                    </Link>
                  </div>
                </div>
              </Section>

              <Hr className="border-gray-200 my-6" />

              <Section className="text-center">
                <Text className="text-gray-500 text-xs m-0">
                  This message was sent via the contact form on your portfolio
                  website
                </Text>
                <Text className="text-gray-400 text-xs m-0 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text className="text-gray-400 text-xs m-0 mt-2">
                  Portfolio of Khalfan Athman • Nairobi, Kenya
                </Text>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
