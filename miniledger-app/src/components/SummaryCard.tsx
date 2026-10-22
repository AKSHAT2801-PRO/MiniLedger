import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../theme";
import { Summary } from "../types";
import { formatMoney } from "../validation";

export function SummaryCard({ summary }: { summary: Summary | null }) {
  const pending = summary ? Math.max(summary.totalLent - summary.totalRepaid, 0) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.caption}>Still to get back</Text>
      <Text style={styles.big}>{summary ? formatMoney(pending) : "—"}</Text>

      <View style={styles.row}>
        <Stat label="Total lent" value={summary?.totalLent} />
        <Stat label="Repaid" value={summary?.totalRepaid} color="#86EFAC" />
        <Stat label="Overdue" value={summary?.overdueAmount} color="#FCA5A5" />
      </View>
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value?: number; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, color ? { color } : null]}>
        {value === undefined ? "—" : formatMoney(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    ...shadow,
  },
  caption: { color: "#C7D2FE", fontSize: 13, fontWeight: "600" },
  big: { color: "#fff", fontSize: 34, fontWeight: "800", marginTop: 4, marginBottom: 18 },
  row: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statLabel: { color: "#C7D2FE", fontSize: 11, fontWeight: "600" },
  statValue: { color: "#fff", fontSize: 14, fontWeight: "700", marginTop: 3 },
});
