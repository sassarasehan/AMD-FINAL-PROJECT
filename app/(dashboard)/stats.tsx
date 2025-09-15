import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { getTransactionsRealtime } from '@/services/transactionService';
import { Transaction } from '@/types/transaction';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

const StatsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = getTransactionsRealtime((data) => {
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ===== Filter transactions by period =====
  const filterTransactionsByPeriod = (period: TimePeriod) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return transactions.filter((t) => t.createdAt >= startDate);
  };

  const filteredTransactions = filterTransactionsByPeriod(selectedPeriod);

  // ===== Calculate Stats =====
  const incomeTransactions = filteredTransactions.filter((t) => t.type === 'income');
  const expenseTransactions = filteredTransactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  // ===== Expense Categories Pie Chart =====
  const expenseCategories = expenseTransactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = 0;
    acc[t.category] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(expenseCategories).map(([name, amount], index) => ({
    name,
    amount,
    color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // ===== Monthly Bar Chart =====
  const monthlyData = filteredTransactions.reduce((acc, t) => {
    const month = t.createdAt.getMonth();
    if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expenses += t.amount;
    return acc;
  }, {} as Record<number, { income: number; expenses: number }>);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const barChartData = {
    labels: Object.keys(monthlyData).map((m) => monthNames[parseInt(m)]),
    datasets: [
      { data: Object.values(monthlyData).map((d) => d.income), color: (o=1)=>`rgba(34,197,94,${o})` },
      { data: Object.values(monthlyData).map((d) => d.expenses), color: (o=1)=>`rgba(239,68,68,${o})` },
    ],
  };

  // ===== Daily Spending Line Chart (7 days) =====
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();

  const dailySpending = dailyData.map((date) =>
    expenseTransactions
      .filter((t) => {
        const d = new Date(t.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === date.getTime();
      })
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const lineChartData = {
    labels: dailyData.map((d) => d.getDate().toString()),
    datasets: [
      {
        data: dailySpending,
        color: (o=1)=>`rgba(59,130,246,${o})`,
        strokeWidth: 2,
      },
    ],
  };

  // ===== Loading =====
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your financial stats...</Text>
      </View>
    );
  }

  // ===== Render =====
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>Financial Insights</Text>
        <Text style={styles.headerSubtitle}>Track your money, grow your wealth</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week','month','quarter','year'] as TimePeriod[]).map((p)=>(
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, selectedPeriod===p && styles.periodButtonActive]}
              onPress={()=>setSelectedPeriod(p)}
            >
              <Text style={[styles.periodButtonText, selectedPeriod===p && styles.periodButtonTextActive]}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <LinearGradient colors={['#4ade80','#22c55e']} style={styles.summaryGradient}>
              <MaterialIcons name="trending-up" size={24} color="white" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryAmount}>Rs. {totalIncome.toLocaleString()}</Text>
            </LinearGradient>
          </View>
          <View style={styles.summaryCard}>
            <LinearGradient colors={['#f87171','#ef4444']} style={styles.summaryGradient}>
              <MaterialIcons name="trending-down" size={24} color="white" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryAmount}>Rs. {totalExpenses.toLocaleString()}</Text>
            </LinearGradient>
          </View>
          <View style={styles.summaryCard}>
            <LinearGradient colors={['#60a5fa','#3b82f6']} style={styles.summaryGradient}>
              <MaterialIcons name="savings" size={24} color="white" />
              <Text style={styles.summaryLabel}>Net Savings</Text>
              <Text style={styles.summaryAmount}>Rs. {netSavings.toLocaleString()}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Pie Chart */}
        {pieChartData.length>0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Expense Categories</Text>
            <PieChart
              data={pieChartData}
              width={width-40}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              chartConfig={{color:(o=1)=>`rgba(0,0,0,${o})`}}
              absolute
            />
          </View>
        )}

        {Object.keys(monthlyData).length > 0 && (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Income vs Expenses</Text>
            <BarChart
                data={barChartData}
                width={width - 40}
                height={220}
                yAxisLabel="Rs. "
                yAxisSuffix="" 
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.5,
                    propsForBackgroundLines: {
                    strokeWidth: 1,
                    stroke: '#e5e7eb',
                    },
                }}
            style={{ marginVertical: 8, borderRadius: 16 }}
                fromZero
                showBarTops={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                />
            </View>
        )}

        {/* Line Chart */}
        {dailySpending.some(a=>a>0) && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Daily Spending (Last 7 Days)</Text>
            <LineChart
              data={lineChartData}
              width={width-40}
              height={220}
              yAxisLabel="Rs. "
              chartConfig={{
                backgroundColor:'#fff',
                backgroundGradientFrom:'#fff',
                backgroundGradientTo:'#fff',
                decimalPlaces:0,
                color:(o=1)=>`rgba(59,130,246,${o})`,
                labelColor:(o=1)=>`rgba(0,0,0,${o})`,
              }}
              bezier
              style={{marginVertical:8,borderRadius:16}}
            />
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Financial Insights</Text>
          {netSavings>0 ? (
            <View style={styles.positiveInsight}>
              <MaterialIcons name="emoji-events" size={20} color="#16a34a" />
              <Text style={styles.insightText}>
                Great job! You're saving Rs. {netSavings.toLocaleString()} this {selectedPeriod}.
                That's {(netSavings/totalIncome*100).toFixed(1)}% of your income.
              </Text>
            </View>
          ) : (
            <View style={styles.negativeInsight}>
              <MaterialIcons name="warning" size={20} color="#dc2626" />
              <Text style={styles.insightText}>
                You're spending Rs. {Math.abs(netSavings).toLocaleString()} more than you earn this {selectedPeriod}.
                Consider reviewing your expenses.
              </Text>
            </View>
          )}

          {expenseTransactions.length>0 && (
            <View style={styles.insight}>
              <MaterialIcons name="lightbulb" size={20} color="#f59e0b" />
              <Text style={styles.insightText}>
                Your largest expense category is {
                  Object.entries(expenseCategories).sort((a,b)=>b[1]-a[1])[0][0]
                }, accounting for {
                  ((Object.entries(expenseCategories).sort((a,b)=>b[1]-a[1])[0][1]/totalExpenses)*100).toFixed(1)
                }% of your spending.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f8fafc'},
  loadingContainer:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f8fafc'},
  loadingText:{marginTop:16,fontSize:16,color:'#6b7280'},
  header:{padding:24,paddingTop:60,paddingBottom:30},
  headerTitle:{fontSize:28,fontWeight:'bold',color:'white',marginBottom:4},
  headerSubtitle:{fontSize:16,color:'rgba(255,255,255,0.8)'},
  scrollView:{flex:1,marginTop:-20,borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'#f8fafc'},
  periodSelector:{flexDirection:'row',justifyContent:'space-around',padding:16,backgroundColor:'white',margin:16,borderRadius:16,elevation:2},
  periodButton:{paddingVertical:8,paddingHorizontal:12,borderRadius:12},
  periodButtonActive:{backgroundColor:'#667eea'},
  periodButtonText:{color:'#6b7280',fontWeight:'500'},
  periodButtonTextActive:{color:'white',fontWeight:'600'},
  summaryContainer:{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:16,marginBottom:24},
  summaryCard:{width:(width-48)/3,borderRadius:16,elevation:3},
  summaryGradient:{padding:12,borderRadius:16,alignItems:'center',minHeight:120,justifyContent:'center'},
  summaryLabel:{fontSize:12,color:'rgba(255,255,255,0.9)',marginTop:8,marginBottom:4,textAlign:'center'},
  summaryAmount:{fontSize:14,fontWeight:'bold',color:'white',textAlign:'center'},
  chartContainer:{backgroundColor:'white',marginHorizontal:16,marginBottom:24,padding:16,borderRadius:16,elevation:2},
  chartTitle:{fontSize:18,fontWeight:'bold',color:'#111827',marginBottom:16},
  insightsContainer:{backgroundColor:'white',margin:16,padding:20,borderRadius:16,elevation:2,marginBottom:40},
  insightsTitle:{fontSize:20,fontWeight:'bold',color:'#111827',marginBottom:16},
  insight:{flexDirection:'row',alignItems:'flex-start',marginBottom:16},
  positiveInsight:{flexDirection:'row',alignItems:'flex-start',marginBottom:16,backgroundColor:'#f0fdf4',padding:12,borderRadius:12},
  negativeInsight:{flexDirection:'row',alignItems:'flex-start',marginBottom:16,backgroundColor:'#fef2f2',padding:12,borderRadius:12},
  insightText:{marginLeft:8,fontSize:14,color:'#374151',flex:1},
});

export default StatsScreen;
