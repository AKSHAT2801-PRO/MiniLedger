import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { resolveFileUrl } from "../api";
import { colors, shadow } from "../theme";
import { Loan } from "../types";
import { formatDisplayDate, formatMoney, isOverdue } from "../validation";

type Props = {
  loan: Loan;
  busy?: boolean;
  onRepay: (loan: Loan) => void;
};

export function LoanItem({ loan, busy, onRepay }: Props) {
  const overdue = isOverdue(loan.dueDate, loan.isRepaid);
  const receipt = resolveFileUrl(loan.receiptUrl);

  return (
    <View style={[styles.card, overdue && styles.cardOverdue, loan.isRepaid && styles.cardRepaid]}>
      <View style={styles.top}>
        <View style={[styles.avatar, overdue && { backgroundColor: colors.danger }]}>
          <Text style={styles.avatarText}>{(loan.friendName[0] ?? "?").toUpperCase()}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {loan.friendName}
          </Text>
          <Text style={[styles.due, overdue && { color: colors.danger, fontWeight: "700" }]}>
            {overdue ? "Overdue · " : "Due "}
            {formatDisplayDate(loan.dueDate)}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.amount, loan.isRepaid && styles.strike]}>
            {formatMoney(loan.amount)}
          </Text>
          {loan.isRepaid ? (
            <View style={styles.badgeOk}>
              <Text style={styles.badgeOkText}>Repaid</Text>
            </View>
          ) : overdue ? (
            <View style={styles.badgeBad}>
              <Text style={styles.badgeBadText}>Overdue</Text>
            </View>
          ) : null}
        </View>
      </View>

      {(receipt || !loan.isRepaid) && (
        <View style={styles.bottom}>
          {receipt ? <Image source={{ uri: receipt }} style={styles.thumb} /> : <View />}
          {!loan.isRepaid && (
            <Pressable
              onPress={() => onRepay(loan)}
              disabled={busy}
              style={({ pressed }) => [styles.repayBtn, (pressed || busy) && { opacity: 0.6 }]}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.success} />
              ) : (
                <Text style={styles.repayText}>Mark repaid</Text>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
    ...shadow,
  },
  cardOverdue: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderLeftWidth: 5,
    borderLeftColor: colors.danger,
  },
  cardRepaid: { opacity: 0.7 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 17 },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  due: { fontSize: 13, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 17, fontWeight: "800", color: colors.text },
  strike: { textDecorationLine: "line-through", color: colors.muted },
  badgeOk: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeOkText: { color: colors.success, fontSize: 11, fontWeight: "700" },
  badgeBad: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeBadText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.border },
  repayBtn: {
    borderWidth: 1.5,
    borderColor: colors.success,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 36,
    minWidth: 112,
    alignItems: "center",
    justifyContent: "center",
  },
  repayText: { color: colors.success, fontWeight: "700", fontSize: 13 },
});
