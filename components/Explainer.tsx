import { Text, Modal, Group, Button, Anchor } from "@mantine/core";
import { useState } from "react";

export const Explainer = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Anchor c="dimmed" mt="xs" onClick={() => setOpened(true)}>
        what is this?
      </Anchor>

      <Modal
        size="lg"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Welcome to binder!"
        centered
        withCloseButton={false}
      >
        <Group dir="vertical">
          <Text>
            Binder is a web app that uses GTP-3 to recommend books you will
            love. All you have to do is provide a list of your favorite books,
            and binder will scour the internet and provide you with personalized
            book recommendations tailored to your tastes.
          </Text>
          <Text>
            Binder's recommendations are based on an in-depth analysis of your
            favorite book titles, taking into account genre, author, subject
            matter, and other factors. You can add books to your list with ease
            – binder's autocomplete feature automatically searches for books as
            you type, making the process quick and hassle-free. All of your
            added books are saved locally, so you can access them whenever you
            need them.
          </Text>
          <Button
            mx="auto"
            color="red"
            onClick={() => setOpened(false)}
            variant="light"
          >
            wow, let me start 👉👈
          </Button>
        </Group>
      </Modal>
    </>
  );
};
