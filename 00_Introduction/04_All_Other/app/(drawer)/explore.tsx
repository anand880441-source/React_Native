import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>

      <Collapsible title="File-based routing">
        <ThemedText>
          This app has screens inside{' '}
          <ThemedText type="defaultSemiBold">app/(drawer)/</ThemedText> using
          expo-router's built-in Drawer navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version,
          press <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Light and dark mode">
        <ThemedText>
          This template has light and dark mode support via the{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Animations">
        <ThemedText>
          This template uses{' '}
          <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          for animations.
        </ThemedText>
        {Platform.OS === 'ios' && (
          <ThemedText>
            The drawer uses a native slide gesture on iOS.
          </ThemedText>
        )}
      </Collapsible>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
});
