import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendOtp, verifyOtp } from "../src/api";
import { useAuth } from "../src/auth";
import { Button, Field } from "../src/components/ui";
import { colors } from "../src/theme";
import { sanitizePhone, validateOtp, validatePhone } from "../src/validation";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requestOtp = async () => {
    const err = validatePhone(phone);
    setError(err);
    if (err) return;

    setBusy(true);
    try {
      await sendOtp(sanitizePhone(phone));
      setOtp("");
      setStep("otp");
    } catch (e: any) {
      Alert.alert("Couldn't send OTP", e.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmOtp = async () => {
    const err = validateOtp(otp);
    setError(err);
    if (err) return;

    setBusy(true);
    try {
      const digits = sanitizePhone(phone);
      await verifyOtp(digits, otp.replace(/\D/g, ""));
      await signIn(digits); // the route guard moves us to the home screen
    } catch (e: any) {
      setError(e.message || "Invalid OTP");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>₹</Text>
          </View>
          <Text style={styles.title}>MiniLedger</Text>
          <Text style={styles.subtitle}>Keep track of money you've lent to friends.</Text>

          <View style={styles.card}>
            {step === "phone" ? (
              <>
                <Field
                  label="Mobile number"
                  placeholder="10-digit mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(sanitizePhone(t));
                    setError(null);
                  }}
                  error={error}
                  autoFocus
                />
                <Button title="Send OTP" onPress={requestOtp} loading={busy} />
              </>
            ) : (
              <>
                <Text style={styles.hint}>
                  Enter the OTP sent to {phone}. (Mock login: the OTP is printed in the server log.)
                </Text>
                <Field
                  label="OTP"
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(t) => {
                    setOtp(t.replace(/\D/g, ""));
                    setError(null);
                  }}
                  error={error}
                  autoFocus
                />
                <Button title="Verify & Login" onPress={confirmOtp} loading={busy} />
                <View style={{ height: 6 }} />
                <Button
                  title="Change number"
                  variant="ghost"
                  disabled={busy}
                  onPress={() => {
                    setStep("phone");
                    setError(null);
                  }}
                />
                <Button title="Resend OTP" variant="ghost" disabled={busy} onPress={requestOtp} />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoText: { color: "#fff", fontSize: 32, fontWeight: "800" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginTop: 14,
  },
  subtitle: { color: colors.muted, textAlign: "center", marginTop: 6, marginBottom: 28 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  hint: { color: colors.muted, marginBottom: 14, lineHeight: 20 },
});
