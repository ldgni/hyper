import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { APP_CONFIG } from "@/lib/constants";

interface EmailTemplateProps {
  previewText: string;
  heading: string;
  content: React.ReactNode;
  ctaButton?: {
    text: string;
    url: string;
  };
}

export default function EmailTemplate({
  previewText,
  heading,
  content,
  ctaButton,
}: EmailTemplateProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZs.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-16 max-w-xl">
            {/* Header */}
            <Section className="mb-8">
              <Heading className="m-0 text-2xl font-medium text-black">
                {heading}
              </Heading>
            </Section>

            {/* Content */}
            <Section>
              {content}

              {ctaButton && (
                <Section className="mt-8">
                  <Button
                    href={ctaButton.url}
                    className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white no-underline">
                    {ctaButton.text}
                  </Button>
                </Section>
              )}
            </Section>

            {/* Footer */}
            <Hr className="my-8 border-gray-200" />
            <Section>
              <Text className="m-0 text-xs text-gray-500">
                {APP_CONFIG.name}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// Helper function to render the email template to HTML
export async function renderEmailTemplate(
  props: EmailTemplateProps,
): Promise<string> {
  const { render } = await import("@react-email/render");
  return render(<EmailTemplate {...props} />);
}
