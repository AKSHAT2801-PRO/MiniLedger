import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { addLoan } from "../src/api";
import { Button, Field } from "../src/components/ui";
import { colors } from "../src/theme";
import {
  formatDisplayDate,
  toISODate,
  validateAmount,
  validateFriendName,
} from "../src/validation";

function defaultDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export default function AddLoanScreen() {
  const router = useRouter();

  const [friendName, setFriendName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date>(defaultDueDate());
  const [showPicker, setShowPicker] = useState(false);
  const [receipt, setReceipt] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [errors, setErrors] = useState<{ name?: string | null; amount?: string | null }>({});
  const [busy, setBusy] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "set" && selected) setDueDate(selected);
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach a receipt.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (!res.canceled) setReceipt(res.assets[0]);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow camera access to photograph a receipt.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled) setReceipt(res.assets[0]);
  };

  const onSave = async () => {
    const nextErrors = {
      name: validateFriendName(friendName),
      amount: validateAmount(amount),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.amount) return;

    setBusy(true);
    try {
      await addLoan({
        friendName: friendName.trim(),
        amount: Number(amount),
        dueDate: toISODate(dueDate),
        receipt: receipt
          ? {
              uri: receipt.uri,
              name: receipt.fileName ?? `receipt-${Date.now()}.jpg`,
              type: receipt.mimeType ?? "image/jpeg",
            }
          : null,
      });
      router.back(); // the home screen reloads on focus
    } catch (e: any) {
      Alert.alert("Couldn't save loan", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Field
          label="Friend's name"
          placeholder="e.g. Rahul"
          value={friendName}
          onChangeText={(t) => {
            setFriendName(t);
            setErrors((e) => ({ ...e, name: null }));
          }}
          error={errors.name}
          autoCapitalize="words"
          maxLength={60}
        />

        <Field
          label="Amount (₹)"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(t) => {
            setAmount(t.replace(",", "."));
            setErrors((e) => ({ ...e, amount: null }));
          }}
          error={errors.amount}
        />

        <Text style={styles.label}>Due date</Text>
        <Pressable style={styles.dateBtn} onPress={() => setShowPicker((s) => !s)}>
          <Text style={styles.dateText}>{formatDisplayDate(toISODate(dueDate))}</Text>
          <Text style={styles.dateHint}>Change</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onDateChange}
          />
        )}

        <Text style={[styles.label, { marginTop: 18 }]}>Receipt photo (optional)</Text>
        {receipt ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: receipt.uri }} style={styles.preview} />
            <Pressable onPress={() => setReceipt(null)} style={styles.removeBtn}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Button title="Camera" variant="outline" onPress={takePhoto} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Gallery" variant="outline" onPress={pickFromGallery} />
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
        <Button title="Save loan" onPress={onSave} loading={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted, marginBottom: 6 },
  dateBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: { fontSize: 16, color: colors.text },
  dateHint: { color: colors.primary, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12 },
  previewWrap: { alignItems: "flex-start" },
  preview: { width: "100%", height: 200, borderRadius: 12, backgroundColor: colors.border },
  removeBtn: { marginTop: 8, paddingVertical: 4 },
  removeText: { color: colors.danger, fontWeight: "700" },
});
