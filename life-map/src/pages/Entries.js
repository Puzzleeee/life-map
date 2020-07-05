import React from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import createEntryBackground from "../static/create-entry-background.png";
import EntryCard from "../components/EntryCard";

/**
 * This is a list container for all entry cards
 * It receives a list of Entry Objects as props
 *
 * Entries.propTypes = {
 * entries: PropTypes.arrayOf(Entry).isRequired
 * }
 */
const Entries = ({ entries, setEntries }) => {
  const removeDeletedEntry = (entry) => {
    return () => {
      setEntries(entries.filter((x) => x !== entry));
    };
  };

  return (
    <Container>
      <EntriesContainer>
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            removeEntry={removeDeletedEntry(entry)}
          />
        ))}
      </EntriesContainer>
    </Container>
  );
};

export default Entries;

const Container = styled(Paper)`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${createEntryBackground});
  background-repeat: repeat-y;
  background-size: cover;
`;

const EntriesContainer = styled.section`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 48px 12px;
  display: flex;
  flex-direction: column;
`;
