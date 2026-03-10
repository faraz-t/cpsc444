import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { avatarIds, avatarSources } from "../data/mockData";

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1");

  const handleContinue = () => {
    const trimmedName = name.trim();
    const fallbackName = trimmedName.length > 0 ? trimmedName : "User";

    router.push({
      pathname: "./menu",
      params: { name: fallbackName, avatar: selectedAvatar },
    } as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.kicker}>APP NAME</Text>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please enter your name to continue</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#8f8f94"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />

        <Text style={[styles.subtitle, styles.avatarPrompt]}>
          Please select an avatar
        </Text>
        <View style={styles.avatarGrid}>
          {avatarIds.map((avatarId) => {
            const isSelected = selectedAvatar === avatarId;

            return (
              <Pressable
                key={avatarId}
                style={[
                  styles.avatarChoice,
                  isSelected && styles.avatarChoiceSelected,
                ]}
                onPress={() => setSelectedAvatar(avatarId)}
              >
                <Image
                  source={avatarSources[avatarId]}
                  contentFit="cover"
                  style={styles.avatarChoiceImage}
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#eef6f5",
  },
  card: {
    borderRadius: 26,
    padding: 26,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#deece9",
    shadowColor: "#0c3d37",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 2,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    color: "#168a80",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 10,
    color: "#173530",
  },
  subtitle: {
    fontSize: 16,
    color: "#5f7672",
    marginBottom: 16,
  },
  avatarPrompt: {
    marginTop: 4,
    marginBottom: 12,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 24,
  },
  avatarChoice: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 999,
    padding: 2,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#dcecea",
    overflow: "hidden",
  },
  avatarChoiceSelected: {
    borderColor: "#11897e",
  },
  avatarChoiceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6e8e4",
    backgroundColor: "#f7fcfb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: "#173530",
    marginBottom: 22,
  },
  primaryButton: {
    backgroundColor: "#11897e",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
