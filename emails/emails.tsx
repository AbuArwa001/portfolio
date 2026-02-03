import {
  Preview,
  Body,
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

const emails = () => {
  return (
    <Html>
      <Tailwind>
        <Body>
          <Container>
            <Preview>Preview Text</Preview>
            <div>emails</div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default emails;
