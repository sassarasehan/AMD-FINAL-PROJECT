import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getTransactionsRealtime } from '@/services/transactionService';
import { Transaction } from '@/types/transaction';

const screenWidth = Dimensions.get('window').width;

interface CategoryStat {
  name: string;
  amount: number;
  color: string;
}

const categoryColors: { [key: string]: string } = {
  Salary: '#667eea',
  Freelance: '#f093fb',
  Investment: '#4facfe',
  Food: '#ff9a9e',
  Shopping: '#a8edea',
  Transport: '#ffecd2',
  Entertainment: '#667eea',
  Health: '#ff6b6b',
  Education: '#4ecdc4',
  Bills: '#ff8a80',
  Gift: '#43e97b',
  Allowance: '#fa709a',
  Culture: '#d299c2'
};

export default function Stats() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  useEffect(() => {
    const unsubscribe = getTransactionsRealtime((data) => {
      setTransactions(data);
      calculateTotals(data);
      calculateCategoryStats(data);
    });
    return () => unsubscribe();
  }, []);

  const calculateTotals = (transactions: Transaction[]) => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setIncomeTotal(income);
    setExpenseTotal(expense);
  };

  const calculateCategoryStats = (transactions: Transaction[]) => {
    const categoryMap: { [key: string]: number } = {};

    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += t.amount;
      }
    });

    const stats: CategoryStat[] = Object.keys(categoryMap).map((key) => ({
      name: key,
      amount: categoryMap[key],
      color: categoryColors[key] || '#888'
    }));

    setCategoryStats(stats);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Financial Stats</Text>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryBox, { backgroundColor: '#4ade80' }]}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryAmount}>Rs. {incomeTotal.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: '#f87171' }]}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.summaryAmount}>Rs. {expenseTotal.toLocaleString()}</Text>
        </View>
      </View>

      {/* Pie Chart for Expenses by Category */}
      {categoryStats.length > 0 ? (
        <>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={categoryStats.map(c => ({
              name: c.name,
              amount: c.amount,
              color: c.color,
              legendFontColor: '#333',
              legendFontSize: 14
            }))}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#f8fafc',
              backgroundGradientFrom: '#f8fafc',
              backgroundGradientTo: '#f8fafc',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </>
      ) : (
        <Text style={styles.noDataText}>No expenses to display.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
});
