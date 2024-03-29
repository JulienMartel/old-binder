import {
  Container,
  Flex,
  Space,
  Text,
  Title,
  Paper,
  Indicator,
  Group,
  Button,
  Box,
  Notification,
  ActionIcon,
} from "@mantine/core";
import { useMediaQuery, useLocalStorage, useHover } from "@mantine/hooks";
import { useState } from "react";
import {
  IconWand,
  IconBookUpload,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons";
import { Explainer } from "../components/Explainer";
import { AddBook } from "../components/AddBook";
import { useRouter } from "next/router";

export default function Home() {
  const [favBooks, setFavBooks] = useLocalStorage<string[]>({
    key: "fav-books",
    defaultValue: [],
  });
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showMissingBooksError, setShowMissingBooksError] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const add = ({ title, author }: { title: string; author: string }) => {
    const book = `${title} by ${author}`;

    if (favBooks.includes(book)) return; // show an error here

    setFavBooks((prev) => [...prev, book]);
  };

  const remove = (book: string) => {
    setFavBooks((prev) => prev.filter((b) => b !== book));
  };

  const recommend = async () => {
    if (favBooks.length < 1) {
      setShowMissingBooksError(true);
      return;
    } else {
      setShowMissingBooksError(false);
    }

    setIsLoading(true);

    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favoriteBooks: favBooks }),
    });

    const data = await response.json();
    const { recommendations } = data;

    setRecommendations(recommendations);
    setIsLoading(false);
  };

  return (
    <>
      <Box
        w="100vw"
        pos="fixed"
        bottom={0}
        left={0}
        py="xs"
        opacity={1}
        sx={{
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          zIndex: 101,
        }}
      >
        <Container size="xs" w="100%">
          <Flex>
            <Button
              variant="filled"
              color="red"
              onClick={() => setOpened(true)}
              size={isMobile ? "md" : "lg"}
              rightIcon={<IconBookUpload />}
            >
              add
            </Button>
            <Space w="xs" />
            <Button
              variant="light"
              color="red"
              fullWidth
              size={isMobile ? "md" : "lg"}
              onClick={recommend}
              loading={isLoading}
              loaderProps={{ color: "red" }}
              leftIcon={<IconWand />}
            >
              get recommendations
            </Button>
          </Flex>
        </Container>
      </Box>
      <div
        style={{
          position: "fixed",
          zIndex: -1,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          opacity: 0.7,
          backgroundImage:
            "radial-gradient(#fa5252 1.2px, transparent 1.2px), radial-gradient(#fa5252 1.2px, #ffffff 1.2px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "0 0,24px 24px",
          backgroundAttachment: "fixed",
        }}
      />

      <Notification
        color="red"
        onClose={() => setShowMissingBooksError(false)}
        hidden={!showMissingBooksError}
      >
        Add at least 1 of your favorite books before getting recommendations.
      </Notification>

      <Container size="xs">
        <Flex align="center" my="xl" direction="column">
          <Title size={64}>binder 📚</Title>
          <Text size="xl">find your next favorite book</Text>
          <Explainer />
        </Flex>

        <Space h="xl" />

        <Indicator
          label={
            <Text px="xs" color="black" fw={500} size="sm">
              my fav books
            </Text>
          }
          color="red.0"
          position="top-center"
          size={22}
        >
          <Paper radius="md" shadow="sm" p="lg" mb="xl">
            <Group spacing="xs" dir="vertical">
              {favBooks.map((book) => (
                <Book key={book} remove={remove} book={book} />
              ))}
            </Group>

            <Text
              align="center"
              my="lg"
              c="dimmed"
              hidden={favBooks.length !== 0}
            >
              no books :(
            </Text>
          </Paper>
        </Indicator>

        <Space h="xl" />

        <Indicator
          label={
            <Text px="xs" color="black" fw={500} size="sm">
              recommendations
            </Text>
          }
          color="yellow.0"
          position="top-center"
          size={22}
          hidden={recommendations.length === 0}
        >
          <Paper radius="md" shadow="sm" p="lg">
            <Group spacing="xs" dir="vertical">
              {recommendations.map((book) => (
                <Book key={book} book={book} />
              ))}
            </Group>
          </Paper>
        </Indicator>

        <Space h="xl" my="xl" />

        <AddBook opened={opened} setOpened={setOpened} add={add} />
      </Container>
    </>
  );
}

const Book = ({
  book,
  remove,
}: {
  book: string;
  remove?: (book: string) => void;
}) => {
  const { hovered, ref } = useHover();

  const googleSearch = (book: string) => {
    window.open(`https://google.com/search?q=${book}`, "_blank");
  };

  return (
    <Paper
      ref={ref}
      p="xs"
      px="md"
      w="100%"
      bg={remove ? "red.0" : "yellow.0"}
      display="flex"
      sx={{
        borderRadius: "12px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>{book}</Text>
      <Flex justify="end" w="10%">
        <ActionIcon
          size="sm"
          onClick={remove ? () => remove(book) : () => googleSearch(book)}
          hidden={!hovered}
          variant="light"
          color={remove ? "red" : "yellow"}
        >
          {remove ? <IconTrash size={18} /> : <IconExternalLink size={18} />}
        </ActionIcon>
      </Flex>
    </Paper>
  );
};
