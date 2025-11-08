import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  ThemedButton,
  ThemedCard,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  ThemedText,
  ThemedTextInput,
  SearchBar,
  HelperText,
  ErrorMessage,
} from './index';

// Example usage of the enhanced UI component library
export const UIComponentExamples: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Button Examples */}
      <ThemedCard margin="md">
        <CardHeader>
          <CardTitle>Enhanced Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ gap: 12 }}>
            <ThemedButton title="Primary Button" variant="primary" />
            <ThemedButton title="Secondary Button" variant="secondary" />
            <ThemedButton title="Outline Button" variant="outline" />
            <ThemedButton title="Ghost Button" variant="ghost" />
            <ThemedButton title="Loading Button" loading />
            <ThemedButton title="Disabled Button" disabled />

            {/* Size variants */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <ThemedButton title="Small" size="sm" />
              <ThemedButton title="Medium" size="md" />
              <ThemedButton title="Large" size="lg" />
            </View>
          </View>
        </CardContent>
      </ThemedCard>

      {/* Card Examples */}
      <ThemedCard variant="elevated" margin="md">
        <CardHeader borderBottom>
          <CardTitle>Enhanced Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemedText>
            This is an elevated card with header and footer.
          </ThemedText>
        </CardContent>
        <CardFooter borderTop>
          <ThemedButton title="Action" size="sm" />
        </CardFooter>
      </ThemedCard>

      <ThemedCard variant="outlined" margin="md">
        <CardContent>
          <ThemedText variant="h4">Outlined Card</ThemedText>
          <ThemedText>This card has an outline border.</ThemedText>
        </CardContent>
      </ThemedCard>

      {/* Text Examples */}
      <ThemedCard margin="md">
        <CardHeader>
          <CardTitle>Enhanced Typography</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemedText variant="h1">Heading 1</ThemedText>
          <ThemedText variant="h2">Heading 2</ThemedText>
          <ThemedText variant="h3">Heading 3</ThemedText>
          <ThemedText variant="body">Body text with normal weight</ThemedText>
          <ThemedText variant="body" weight="bold">
            Bold body text
          </ThemedText>
          <ThemedText variant="caption" colorVariant="gray">
            Caption text
          </ThemedText>
          <ThemedText variant="body" colorVariant="primary">
            Primary colored text
          </ThemedText>
          <ThemedText variant="body" colorVariant="error">
            Error colored text
          </ThemedText>
        </CardContent>
      </ThemedCard>

      {/* Input Examples */}
      <ThemedCard margin="md">
        <CardHeader>
          <CardTitle>Enhanced Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemedTextInput
            label="Outlined Input"
            placeholder="Enter text..."
            variant="outlined"
            value={inputValue}
            onChangeText={setInputValue}
            helperText="This is helper text"
          />

          <ThemedTextInput
            label="Filled Input"
            placeholder="Enter text..."
            variant="filled"
            required
          />

          <ThemedTextInput
            label="Standard Input"
            placeholder="Enter text..."
            variant="standard"
            errorText="This field is required"
          />

          <ThemedTextInput
            label="Floating Label"
            placeholder="Enter text..."
            variant="outlined"
            floatingLabel
          />
        </CardContent>
      </ThemedCard>

      {/* Search Bar Example */}
      <ThemedCard margin="md">
        <CardHeader>
          <CardTitle>Enhanced Search</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar
            placeholder="Search for services..."
            value={searchText}
            onChangeText={setSearchText}
            onSearch={(text) => console.log('Searching for:', text)}
          />
        </CardContent>
      </ThemedCard>

      {/* Helper Text Examples */}
      <ThemedCard margin="md">
        <CardHeader>
          <CardTitle>Helper Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <HelperText text="This is default helper text" />
          <ErrorMessage message="This is an error message" />
          <HelperText text="This is a success message" type="success" />
          <HelperText text="This is a warning message" type="warning" />
        </CardContent>
      </ThemedCard>
    </ScrollView>
  );
};
