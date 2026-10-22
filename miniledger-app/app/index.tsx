import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLoans, getSummary, markRepaid } from "../src/api";
import { useAuth } from "../src/auth";
import { LoanItem } from "../src/components/LoanItem";
import { SummaryCard } from "../src/components/SummaryCard";
import { colors, shadow } from "../src/theme";
import { Loan, Summary } from "../src/types";
import { isOverdue } from "../src/validation";

/** Overdue first, then upcoming (soonest due first), repaid last. */
function sortLoans(loans: Loan[]): Loan[] {
  const rank = (l: Loan) => (l.isRepaid ? 2 : isOverdue(l.dueDate, l.isRepaid) ? 0 : 1);
  return [...loans].sort((a, b) => rank(a) - rank(b) || a.dueDate.localeCompare(b.dueDate));
}

export default function HomeScreen() {
  const router = useRouter();
  const { phone, signOut } = useAuth();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [loansResult, summaryResult] = await Promise.allSettled([
      getLoans(),
      getSummary(),
    ]);

    if (loansResult.status === "fulfilled") {
      setLoans(sortLoans(loansResult.value));
      setError(null);
    } else {
      setError(loansResult.reason instanceof Error
        ? loansResult.reason.message
        : "Couldn't load loans.");
    }

    setSummary(summaryResult.status === "fulfilled" ? summaryResult.value : null);
  }, []);

  // Reload whenever this screen is focused (e.g. after adding an entry).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        await load();
        if (active) setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onRepay = (loan: Loan) => {
    Alert.alert("Mark as repaid?", `${loan.friendName} has paid you back in full.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, repaid",
        onPress: async () => {
          setBusyId(loan.id);
          try {
            await markRepaid(loan.friendName);
            await load();
          } catch (e: any) {
            Alert.alert("Couldn't update", e.message);
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  };

  const onLogout = () => {
    Alert.alert("Log out?", undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>MiniLedger</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <Pressable onPress={onLogout} hitSlop={10}>
          <Text style={styles.logout}>Log out</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(l) => l.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <View>
              <SummaryCard summary={summary} />
              {error ? (
                <Pressable style={styles.errorBox} onPress={onRefresh}>
                  <Text style={styles.errorText}>{error}</Text>
                  <Text style={styles.errorRetry}>Tap to retry</Text>
                </Pressable>
              ) : null}
              {loans.length > 0 && <Text style={styles.section}>Loans</Text>}
            </View>
          }
          ListEmptyComponent={
            error ? undefined : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No loans yet</Text>
                <Text style={styles.emptySub}>Tap “+ Add loan” to record money you've lent.</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <LoanItem loan={item} busy={busyId === item.id} onRepay={onRepay} />
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.fabText}>+ Add loan</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  phone: { color: colors.muted, fontSize: 13, marginTop: 2 },
  logout: { color: colors.danger, fontWeight: "700" },
  list: { paddingHorizontal: 20, paddingBottom: 110 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  section: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 10 },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  errorText: { color: colors.danger, fontWeight: "600" },
  errorRetry: { color: colors.danger, marginTop: 4, fontSize: 12 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  emptySub: { color: colors.muted, marginTop: 6, textAlign: "center" },
  fab: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
