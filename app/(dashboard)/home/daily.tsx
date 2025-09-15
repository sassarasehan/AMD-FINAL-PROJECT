import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  StatusBar,
  Alert
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { createTransaction, getTransactionsRealtime, deleteTransaction, updateTransaction } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import { use, useEffect, useState } from "react";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';



const { width, height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  iconSet: "MaterialIcons" | "FontAwesome5" | "Ionicons" | "Feather";
  type: TransactionType;
  gradient: string[];
}

// TransactionItem Component
interface TransactionItemProps {
  item: Transaction;
  onDelete: (item: Transaction) => void;
  onUpdate: (item: Transaction) => void;
  categories: Category[];
  renderIcon: (category: Category, size?: number, color?: string) => React.ReactElement;
}

// TransactionItem Component
const TransactionItem: React.FC<TransactionItemProps> = ({ item, onDelete, onUpdate, categories, renderIcon }) => {
  const transactionCategory = categories.find(cat => cat.name === item.category);
  let swipeableRef: Swipeable | null = null;
  
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    
    return (
      <View style={styles.actionsContainer}>
        {/* Update button */}
        <RectButton 
          style={styles.updateAction} 
          onPress={() => {
            if (swipeableRef) swipeableRef.close();
            onUpdate(item);
          }}
        >
          <MaterialIcons name="edit" size={20} color="blue" />
          <Text style={styles.actionText}>Edit</Text>
        </RectButton>
        
        {/* Delete button */}
        <RectButton 
          style={styles.deleteAction} 
          onPress={() => {
            if (swipeableRef) swipeableRef.close();
            onDelete(item);
          }}
        >
          <MaterialIcons name="delete" size={20} color="red" />
          <Text style={styles.actionText2}>Delete</Text>
        </RectButton>
      </View>
    );
  };

  return (
    <Swipeable
      ref={ref => swipeableRef = ref}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={90}
      rightOpenValue={-180} // Total width of both buttons
    >
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <LinearGradient 
            colors={transactionCategory?.gradient || ['#e5e7eb', '#d1d5db']} 
            style={styles.transactionIcon}
          >
            {transactionCategory && renderIcon(transactionCategory, 20, "white")}
          </LinearGradient>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionDate}>
              {item.createdAt.toLocaleDateString()}
            </Text>
            {item.note && <Text style={styles.transactionNote}>{item.note}</Text>}
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: item.type === "income" ? "#22c55e" : "#ef4444" }
          ]}>
            {item.type === "income" ? "+" : "-"}Rs. {item.amount.toLocaleString()}
          </Text>
          <MaterialIcons 
            name={item.type === "income" ? "arrow-upward" : "arrow-downward"} 
            size={16} 
            color={item.type === "income" ? "#22c55e" : "#ef4444"} 
          />
        </View>
      </View>
    </Swipeable>
  );
};


export default function Daily() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [note, setNote] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const { showLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  // Modern categories with gradients
  const categories: Category[] = [
    { id: "1", name: "Salary", icon: "attach-money", iconSet: "MaterialIcons", type: "income", gradient: ["#667eea", "#764ba2"] },
    { id: "2", name: "Freelance", icon: "laptop", iconSet: "FontAwesome5", type: "income", gradient: ["#f093fb", "#f5576c"] },
    { id: "3", name: "Investment", icon: "trending-up", iconSet: "MaterialIcons", type: "income", gradient: ["#4facfe", "#00f2fe"] },
    { id: "4", name: "Gift", icon: "card-giftcard", iconSet: "MaterialIcons", type: "income", gradient: ["#43e97b", "#38f9d7"] },
    { id: "5", name: "Allowance", icon: "account-balance-wallet", iconSet: "MaterialIcons", type: "income", gradient: ["#fa709a", "#fee140"] },
    
    { id: "6", name: "Food", icon: "restaurant", iconSet: "MaterialIcons", type: "expense", gradient: ["#ff9a9e", "#fecfef"] },
    { id: "7", name: "Shopping", icon: "shopping-cart", iconSet: "FontAwesome5", type: "expense", gradient: ["#a8edea", "#fed6e3"] },
    { id: "8", name: "Transport", icon: "directions-car", iconSet: "MaterialIcons", type: "expense", gradient: ["#ffecd2", "#fcb69f"] },
    { id: "9", name: "Entertainment", icon: "theaters", iconSet: "MaterialIcons", type: "expense", gradient: ["#667eea", "#764ba2"] },
    { id: "10", name: "Health", icon: "local-hospital", iconSet: "MaterialIcons", type: "expense", gradient: ["#ff6b6b", "#feca57"] },
    { id: "11", name: "Education", icon: "school", iconSet: "MaterialIcons", type: "expense", gradient: ["#4ecdc4", "#44a08d"] },
    { id: "12", name: "Bills", icon: "receipt", iconSet: "MaterialIcons", type: "expense", gradient: ["#ff8a80", "#ff5722"] },
    { id: "13", name: "Culture", icon: "palette", iconSet: "MaterialIcons", type: "expense", gradient: ["#d299c2", "#fef9d7"] },
  ];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getTransactionsRealtime((data) => {
      setTransactions(data);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
    return () => unsubscribe();
  }, []);

  // Function to handle delete
  const handleDeleteTransaction = async (transaction: Transaction) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              showLoader();
              if (transaction.id) {
                await deleteTransaction(transaction.id);
                alert("Transaction deleted successfully!");
              } else {
                throw new Error("Transaction ID is missing");
              }
              alert("Transaction deleted successfully!");
            } catch (error) {
              console.error("Error deleting transaction:", error);
              alert("Failed to delete transaction");
            } finally {
              hideLoader();
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Function to handle update
  const handleUpdateTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setAmount(transaction.amount.toString());
    setNote(transaction.note || "");
    setType(transaction.type);
    
    // Find and set the category
    const category = categories.find(cat => cat.name === transaction.category);
    if (category) {
      setSelectedCategory(category);
    }
    
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      alert("Please fill amount and select a category");
      return;
    }

    try {
      showLoader();
      
      if (transactionToEdit) {
        // Update existing transaction
        await updateTransaction(transactionToEdit.id ?? "", {
          amount: parseFloat(amount),
          category: selectedCategory.name,
          note,
          type,
          createdAt: transactionToEdit.createdAt,
          userId: user?.uid || ""
        });
        alert("Transaction updated successfully!");
      } else {
        // Create new transaction
        await createTransaction({
          amount: parseFloat(amount),
          category: selectedCategory.name,
          note,
          type,
          createdAt: new Date(),
          userId: user?.uid || ""
        });
        alert("Transaction added successfully!");
      }

      // Reset form
      setAmount("");
      setSelectedCategory(null);
      setNote("");
      setTransactionToEdit(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save transaction");
    } finally {
      hideLoader();
    }
  };

  const renderIcon = (category: Category, size = 24, color = "white") => {
    const IconComponent = {
      MaterialIcons,
      FontAwesome5,
      Ionicons,
      Feather
    }[category.iconSet];
    
    return <IconComponent name={category.icon} size={size} color={color} />;
  };

  const incomeCategories = categories.filter(cat => cat.type === "income");
  const expenseCategories = categories.filter(cat => cat.type === "expense");

  const incomeTotal = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netTotal = incomeTotal - expenseTotal;

  // Update the modal title based on whether we're editing or creating
  const modalTitle = transactionToEdit ? "Edit Transaction" : "New Transaction";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        {/* Header with Gradient */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.headerGradient}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
          </View>
        </LinearGradient>

        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Balance Cards */}
          <View style={styles.balanceContainer}>
            <View style={styles.mainBalanceCard}>
              <LinearGradient 
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} 
                style={styles.balanceGradient}
              >
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>Rs. {Math.abs(netTotal).toLocaleString()}</Text>
                <Text style={[styles.balanceStatus, { color: netTotal >= 0 ? '#4ade80' : '#f87171' }]}>
                  {netTotal >= 0 ? '+' : '-'} {((netTotal / (incomeTotal || 1)) * 100).toFixed(1)}% this month
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard]}>
                <LinearGradient colors={['#4ade80', '#22c55e']} style={styles.summaryGradient}>
                  <MaterialIcons name="trending-up" size={24} color="white" />
                  <Text style={styles.summaryLabel}>Income</Text>
                  <Text style={styles.summaryAmount}>Rs. {incomeTotal.toLocaleString()}</Text>
                </LinearGradient>
              </View>

              <View style={[styles.summaryCard]}>
                <LinearGradient colors={['#f87171', '#ef4444']} style={styles.summaryGradient}>
                  <MaterialIcons name="trending-down" size={24} color="white" />
                  <Text style={styles.summaryLabel}>Expenses</Text>
                  <Text style={styles.summaryAmount}>Rs. {expenseTotal.toLocaleString()}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>View All</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#667eea" />
              </TouchableOpacity>
            </View>

            {transactions.length > 0 ? (
              transactions.slice(0, 6).map((item, index) => (
                <TransactionItem 
                  key={item.id || index} 
                  item={item} 
                  onDelete={handleDeleteTransaction}
                  onUpdate={handleUpdateTransaction}
                  categories={categories}
                  renderIcon={renderIcon}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient 
                  colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']} 
                  style={styles.emptyStateContainer}
                >
                  <MaterialIcons name="receipt-long" size={64} color="#9ca3af" />
                  <Text style={styles.emptyStateTitle}>No transactions yet</Text>
                  <Text style={styles.emptyStateText}>Start tracking your finances by adding your first transaction</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </Animated.ScrollView>

        {/* Modern Floating Action Button */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => {
            setTransactionToEdit(null);
            setAmount("");
            setSelectedCategory(null);
            setNote("");
            setType("expense");
            setModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.fabGradient}>
            <MaterialIcons name="add" size={32} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Transaction Modal */}
        <Modal 
          animationType="slide" 
          visible={modalVisible}
          presentationStyle="fullScreen"
        >
          <LinearGradient colors={['#f8fafc', '#f1f5f9']} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setTransactionToEdit(null);
                setAmount("");
                setSelectedCategory(null);
                setNote("");
              }}>
                <MaterialIcons name="close" size={28} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Type Selector */}
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[styles.typeButton, type === "income" && styles.typeButtonActive]}
                  onPress={() => setType("income")}
                >
                  <LinearGradient 
                    colors={type === "income" ? ['#22c55e', '#16a34a'] : ['transparent', 'transparent']}
                    style={styles.typeButtonGradient}
                  >
                    <MaterialIcons 
                      name="trending-up" 
                      size={20} 
                      color={type === "income" ? "white" : "#6b7280"} 
                    />
                    <Text style={[
                      styles.typeButtonText, 
                      { color: type === "income" ? "white" : "#6b7280" }
                    ]}>
                      Income
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, type === "expense" && styles.typeButtonActive]}
                  onPress={() => setType("expense")}
                >
                  <LinearGradient 
                    colors={type === "expense" ? ['#ef4444', '#dc2626'] : ['transparent', 'transparent']}
                    style={styles.typeButtonGradient}
                  >
                    <MaterialIcons 
                      name="trending-down" 
                      size={20} 
                      color={type === "expense" ? "white" : "#6b7280"} 
                    />
                    <Text style={[
                      styles.typeButtonText, 
                      { color: type === "expense" ? "white" : "#6b7280" }
                    ]}>
                      Expense
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>Rs.</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
              </View>

              {/* Category Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TouchableOpacity 
                  style={styles.categoryButton}
                  onPress={() => setShowCategoryModal(true)}
                >
                  {selectedCategory ? (
                    <View style={styles.selectedCategoryContainer}>
                      <LinearGradient 
                        colors={selectedCategory.gradient} 
                        style={styles.selectedCategoryIcon}
                      >
                        {renderIcon(selectedCategory, 16, "white")}
                      </LinearGradient>
                      <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>Choose category</Text>
                  )}
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Note Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Note (Optional)</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add a note..."
                  placeholderTextColor="#9ca3af"
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.saveButton, (!amount || !selectedCategory) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!amount || !selectedCategory}
              >
                <LinearGradient 
                  colors={(!amount || !selectedCategory) ? ['#9ca3af', '#6b7280'] : ['#667eea', '#764ba2']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {transactionToEdit ? "Update Transaction" : "Add Transaction"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Modal>

        {/* Category Selection Modal */}
        <Modal transparent visible={showCategoryModal} animationType="fade">
          <View style={styles.categoryModalOverlay}>
            <View style={styles.categoryModal}>
              <View style={styles.categoryModalHeader}>
                <Text style={styles.categoryModalTitle}>
                  Select {type === "income" ? "Income" : "Expense"} Category
                </Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <MaterialIcons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={type === "income" ? incomeCategories : expenseCategories}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.categoryGrid}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.categoryOption}
                    onPress={() => {
                      setSelectedCategory(item);
                      setShowCategoryModal(false);
                    }}
                  >
                    <LinearGradient colors={item.gradient} style={styles.categoryOptionIcon}>
                      {renderIcon(item, 24, "white")}
                    </LinearGradient>
                    <Text style={styles.categoryOptionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: 50,
  },
  header: {
    padding: 24,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  balanceContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  mainBalanceCard: {
    borderRadius: 24,
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  balanceGradient: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: "white",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  balanceStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: (width - 64) / 2,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryGradient: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
    marginRight: 4,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    minHeight: 90, // Ensure consistent height
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: "#6b7280",
  },
  transactionNote: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptyState: {
    marginTop: 40,
  },
  emptyStateContainer: {
    padding: 48,
    borderRadius: 20,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 32,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  typeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  typeButtonActive: {},
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  categoryButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedCategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  noteInput: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 100,
  },
  actionContainer: {
    padding: 24,
  },
  saveButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryModal: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
  },
  categoryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  categoryGrid: {
    justifyContent: "center",
  },
  categoryOption: {
    width: (width * 0.9 - 80) / 3,
    alignItems: "center",
    margin: 8,
  },
  categoryOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryOptionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#374151",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  
  actionsContainer: {
    flexDirection: "row",
    height: 90,
    width: 180,
    borderRadius: 16, 
    overflow: 'hidden',
  },
  updateAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 90, 
    backgroundColor: "transparent",
    height: 100, 
  },
  deleteAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    backgroundColor: "transparent",
    height: 100, 
  },
  actionText: {
    color: "blue",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  actionText2: {
    color: "red",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
