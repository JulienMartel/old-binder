import {
  Text,
  Modal,
  TextInput,
  Group,
  Button,
  ActionIcon,
  Tooltip,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useState } from "react";
import { IconWand } from "@tabler/icons";

export const AddBook = ({
  opened,
  setOpened,
  add,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  add: ({ title, author }: { title: string; author: string }) => void;
}) => {
  const form = useForm({
    initialValues: {
      title: "",
      author: "",
    },
    validate: {
      title: (v: string) => (v.length === 0 ? "Title required" : null),
      author: (v: string) => (v.length === 0 ? "Author required" : null),
    },
  });

  const onSubmit = ({ title, author }: { title: string; author: string }) => {
    add({ title, author });
    form.reset();
    setOpened(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const getAuthor = async () => {
    setIsLoading(true);

    const response = await fetch("/api/author", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: form.values.title }),
    });

    const data = await response.json();
    const { author } = data;

    form.setFieldValue("author", author);
    setIsLoading(false);
  };

  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={() => {
        setOpened(false);
        form.reset();
      }}
      title={
        <>
          <Text size="lg">Add a book that you love</Text>
          <Text size="sm" c="dimmed">
            Ensure the information provided is accurate, and properly
            capitalized.
          </Text>
        </>
      }
      withCloseButton={false}
      centered
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          size="lg"
          label="Full title"
          {...form.getInputProps("title")}
        />

        <TextInput
          size="lg"
          mt="xs"
          label="Author"
          rightSection={
            isLoading ? (
              <Loader size="sm" mr="md" />
            ) : (
              form.values.author.trim().length === 0 &&
              form.values.title.length > 0 && (
                <Tooltip label="Auto-complete">
                  <ActionIcon onClick={getAuthor} mr="md">
                    <IconWand size={18} />
                  </ActionIcon>
                </Tooltip>
              )
            )
          }
          {...form.getInputProps("author")}
        />

        <Group position="right" my="md">
          <Button size="lg" type="submit" color="red" variant="light">
            Add ❤
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
