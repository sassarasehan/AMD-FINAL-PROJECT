// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   TextInput,
//   FlatList,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import { MaterialIcons, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
// import { addTransaction, getTransactionsRealtime } from "@/services/transactionService";
// import { Transaction, TransactionType } from "@/types/transaction";



// // Category type definition
// interface Category {
//   id: string;
//   name: string;
//   icon: string;
//   iconSet: "MaterialIcons" | "FontAwesome5" | "Ionicons" | "Feather";
//   type: TransactionType;
// }

// export default function Daily() {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [note, setNote] = useState("");
//   const [type, setType] = useState<TransactionType>("income");
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showCategoryModal, setShowCategoryModal] = useState(false);

//   // Categories data
//   const categories: Category[] = [
//     { id: "1", name: "Allowance", icon: "account-balance-wallet", iconSet: "MaterialIcons", type: "income" },
//     { id: "2", name: "Salary", icon: "attach-money", iconSet: "MaterialIcons", type: "income" },
//     { id: "3", name: "Freelance", icon: "laptop", iconSet: "FontAwesome5", type: "income" },
//     { id: "4", name: "Investment", icon: "trending-up", iconSet: "MaterialIcons", type: "income" },
//     { id: "5", name: "Gift", icon: "card-giftcard", iconSet: "MaterialIcons", type: "income" },
//     { id: "6", name: "Food", icon: "restaurant", iconSet: "MaterialIcons", type: "expense" },
//     { id: "7", name: "Shopping", icon: "shopping-cart", iconSet: "FontAwesome5", type: "expense" },
//     { id: "8", name: "Transport", icon: "directions-car", iconSet: "MaterialIcons", type: "expense" },
//     { id: "9", name: "Entertainment", icon: "theaters", iconSet: "MaterialIcons", type: "expense" },
//     { id: "10", name: "Health", icon: "local-hospital", iconSet: "MaterialIcons", type: "expense" },
//     { id: "11", name: "Education", icon: "school", iconSet: "MaterialIcons", type: "expense" },
//     { id: "12", name: "Bills", icon: "receipt", iconSet: "MaterialIcons", type: "expense" },
//     { id: "13", name: "Culture", icon: "palette", iconSet: "MaterialIcons", type: "expense" },
//   ];

//   // Filter categories by type
//   const incomeCategories = categories.filter(cat => cat.type === "income");
//   const expenseCategories = categories.filter(cat => cat.type === "expense");

//   // Calculate totals
//   const incomeTotal = transactions
//     .filter(t => t.type === "income")
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const expenseTotal = transactions
//     .filter(t => t.type === "expense")
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const netTotal = incomeTotal - expenseTotal;

//   // Real-time transactions
//   useEffect(() => {
//     const unsubscribe = getTransactionsRealtime((data) => {
//       setTransactions(data);
//     });

//     return () => unsubscribe(); // cleanup
//   }, []);

//   // Save transaction
//   const handleSave = async () => {
//     if (!amount || !selectedCategory) {
//       alert("Please fill amount and select a category");
//       return;
//     }

//     try {
//       await addTransaction({
//         amount: parseFloat(amount),
//         category: selectedCategory.name,
//         note,
//         type,
//         createdAt: new Date(),
//         userId: "yourUserIdHere", // Replace with actual userId from auth context or state
//       });

//       setAmount("");
//       setSelectedCategory(null);
//       setNote("");
//       setModalVisible(false);
//       alert("Saved ✅");
//     } catch (error) {
//       console.error("Error saving:", error);
//       alert("Failed ❌");
//     }
//   };

//   // Format date
//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'short', 
//       day: 'numeric', 
//       month: 'short', 
//       year: 'numeric' 
//     });
//   };

//   // Render icon based on category
//   const renderIcon = (category: Category, size = 24, color = "#4e54c8") => {
//     switch (category.iconSet) {
//       case "MaterialIcons":
//         return <MaterialIcons name={category.icon} size={size} color={color} />;
//       case "FontAwesome5":
//         return <FontAwesome5 name={category.icon} size={size} color={color} />;
//       case "Ionicons":
//         return <Ionicons name={category.icon} size={size} color={color} />;
//       case "Feather":
//         return <Feather name={category.icon} size={size} color={color} />;
//       default:
//         return <MaterialIcons names="category" size={size} color={color} />;
//     }
//   };

//   // Reset form when type changes
//   useEffect(() => {
//     setSelectedCategory(null);
//   }, [type]);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.monthText}>Sept 2025</Text>
//         <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
//       </View>

//       {/* Summary Cards */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Income</Text>
//           <Text style={[styles.summaryAmount, styles.incomeColor]}>Rs. {incomeTotal.toFixed(2)}</Text>
//         </View>
        
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryLabel}>Expenses</Text>
//           <Text style={[styles.summaryAmount, styles.expenseColor]}>Rs. {expenseTotal.toFixed(2)}</Text>
//         </View>
        
//         <View style={[styles.summaryCard, styles.totalCard]}>
//           <Text style={styles.summaryLabel}>Total</Text>
//           <Text style={[styles.summaryAmount, netTotal >= 0 ? styles.incomeColor : styles.expenseColor]}>
//             Rs. {Math.abs(netTotal).toFixed(2)}
//           </Text>
//         </View>
//       </View>

//       {/* Transactions List */}
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id!}
//         renderItem={({ item }) => {
//           const transactionCategory = categories.find(cat => cat.name === item.category);
//           return (
//             <View style={[
//               styles.transactionCard, 
//               item.type === "income" ? styles.incomeCard : styles.expenseCard
//             ]}>
//               <View style={styles.transactionInfo}>
//                 <View style={styles.transactionCategoryRow}>
//                   {transactionCategory && renderIcon(transactionCategory, 20, "#4e54c8")}
//                   <Text style={styles.transactionCategory}>{item.category}</Text>
//                 </View>
//                 {item.note ? <Text style={styles.transactionNote}>{item.note}</Text> : null}
//                 <Text style={styles.transactionDate}>
//                   {item.createdAt.toLocaleString()}
//                 </Text>
//               </View>
//               <Text style={[
//                 styles.transactionAmount,
//                 item.type === "income" ? styles.incomeColor : styles.expenseColor
//               ]}>
//                 {item.type === "income" ? "+" : "-"} Rs. {item.amount.toFixed(2)}
//               </Text>
//             </View>
//           );
//         }}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <MaterialIcons name="receipt" size={48} color="#ccc" />
//             <Text style={styles.emptyStateText}>No transactions yet</Text>
//             <Text style={styles.emptyStateSubtext}>Add your first transaction using the + button</Text>
//           </View>
//         }
//       />

//       {/* Floating + Button */}
//       <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
//         <MaterialIcons name="add" size={28} color="white" />
//       </TouchableOpacity>

//       {/* Add Transaction Modal */}
//       <Modal transparent animationType="fade" visible={modalVisible}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <KeyboardAvoidingView 
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.modalOverlay}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Add Transaction</Text>
//                 <TouchableOpacity 
//                   style={styles.closeButton}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <MaterialIcons name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Transaction Type Selector */}
//               <View style={styles.typeSelector}>
//                 <TouchableOpacity
//                   style={[styles.typeOption, type === "income" && styles.typeOptionActive]}
//                   onPress={() => setType("income")}
//                 >
//                   <MaterialIcons 
//                     name="arrow-downward" 
//                     size={20} 
//                     color={type === "income" ? "white" : "#2ecc71"} 
//                   />
//                   <Text style={[styles.typeOptionText, type === "income" && styles.typeOptionTextActive]}>
//                     Income
//                   </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity
//                   style={[styles.typeOption, type === "expense" && styles.typeOptionActive]}
//                   onPress={() => setType("expense")}
//                 >
//                   <MaterialIcons 
//                     name="arrow-upward" 
//                     size={20} 
//                     color={type === "expense" ? "white" : "#e74c3c"} 
//                   />
//                   <Text style={[styles.typeOptionText, type === "expense" && styles.typeOptionTextActive]}>
//                     Expense
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Amount Input */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Amount (Rs.)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="0.00"
//                   keyboardType="numeric"
//                   value={amount}
//                   onChangeText={setAmount}
//                   placeholderTextColor="#aaa"
//                 />
//               </View>
              
//               {/* Category Selector */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Category</Text>
//                 <TouchableOpacity 
//                   style={styles.categorySelector}
//                   onPress={() => setShowCategoryModal(true)}
//                 >
//                   {selectedCategory ? (
//                     <View style={styles.selectedCategory}>
//                       {renderIcon(selectedCategory, 22, type === "income" ? "#2ecc71" : "#e74c3c")}
//                       <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
//                     </View>
//                   ) : (
//                     <Text style={styles.placeholderText}>Select a category</Text>
//                   )}
//                   <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>
              
//               {/* Note Input */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Note (optional)</Text>
//                 <TextInput
//                   style={[styles.input, styles.noteInput]}
//                   placeholder="Add a note..."
//                   value={note}
//                   onChangeText={setNote}
//                   multiline
//                   numberOfLines={2}
//                   placeholderTextColor="#aaa"
//                 />
//               </View>

//               {/* Action Buttons */}
//               <View style={styles.actionButtons}>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => setModalVisible(false)}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.button, styles.saveButton, (!amount || !selectedCategory) && styles.saveButtonDisabled]}
//                   onPress={handleSave}
//                   disabled={!amount || !selectedCategory}
//                 >
//                   <Text style={styles.saveButtonText}>Add Transaction</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* Category Selection Modal */}
//       <Modal transparent animationType="slide" visible={showCategoryModal}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.categoryModalContainer, { height: '75%' }]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Category</Text>
//               <TouchableOpacity 
//                 style={styles.closeButton}
//                 onPress={() => setShowCategoryModal(false)}
//               >
//                 <MaterialIcons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.categoryTypeLabel}>
//               {type === "income" ? "Income Categories" : "Expense Categories"}
//             </Text>
            
//             <FlatList
//               data={type === "income" ? incomeCategories : expenseCategories}
//               keyExtractor={(item) => item.id}
//               numColumns={4}
//               contentContainerStyle={styles.categoryGrid}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                   style={styles.categoryOption}
//                   onPress={() => {
//                     setSelectedCategory(item);
//                     setShowCategoryModal(false);
//                   }}
//                 >
//                   <View style={[
//                     styles.categoryIconContainer,
//                     { backgroundColor: type === "income" ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)" }
//                   ]}>
//                     {renderIcon(item, 24, type === "income" ? "#2ecc71" : "#e74c3c")}
//                   </View>
//                   <Text style={styles.categoryOptionText} numberOfLines={2}>{item.name}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     backgroundColor: "#4e54c8",
//     padding: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     elevation: 5,
//   },
//   monthText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//     textAlign: "center",
//   },
//   dateText: {
//     fontSize: 16,
//     color: "white",
//     textAlign: "center",
//     marginTop: 5,
//     opacity: 0.9,
//   },
//   summaryContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 15,
//     marginTop: -25,
//   },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 15,
//     marginHorizontal: 5,
//     alignItems: "center",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   totalCard: {
//     backgroundColor: "#FFC7A7",
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 5,
//   },
//   summaryAmount: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   incomeColor: {
//     color: "#2ecc71",
//   },
//   expenseColor: {
//     color: "#e74c3c",
//   },
//   categoriesContainer: {
//     padding: 15,
//   },
//   categorySection: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   categoryHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   categoryTitleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   categoryTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginLeft: 8,
//   },
//   categoryAccount: {
//     fontSize: 12,
//     color: "#888",
//   },
//   categoryAmount: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#4e54c8",
//   },
//   transactionCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 15,
//     marginHorizontal: 15,
//     marginVertical: 8,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   incomeCard: {
//     borderLeftWidth: 4,
//     borderLeftColor: "#2ecc71",
//   },
//   expenseCard: {
//     borderLeftWidth: 4,
//     borderLeftColor: "#e74c3c",
//   },
//   transactionInfo: {
//     flex: 1,
//   },
//   transactionCategoryRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   transactionCategory: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginLeft: 8,
//   },
//   transactionNote: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   transactionDate: {
//     fontSize: 12,
//     color: "#888",
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#888",
//     marginTop: 10,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: "#aaa",
//     textAlign: "center",
//     marginTop: 5,
//   },
//   fab: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "#4e54c8",
//     borderRadius: 30,
//     width: 60,
//     height: 60,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     elevation: 10,
//     maxHeight: "85%",
//   },
//   categoryModalContainer: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#4e54c8",
//   },
//   closeButton: {
//     padding: 5,
//   },
//   typeSelector: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     backgroundColor: "#f8f9fa",
//     borderRadius: 12,
//     padding: 4,
//   },
//   typeOption: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 12,
//     borderRadius: 10,
//     marginHorizontal: 4,
//   },
//   typeOptionActive: {
//     backgroundColor: "#4e54c8",
//   },
//   typeOptionText: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 6,
//     color: "#666",
//   },
//   typeOptionTextActive: {
//     color: "white",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#444",
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//     backgroundColor: "#fafafa",
//   },
//   noteInput: {
//     height: 80,
//     textAlignVertical: "top",
//   },
//   categorySelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     padding: 16,
//     backgroundColor: "#fafafa",
//   },
//   selectedCategory: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   selectedCategoryText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
//   placeholderText: {
//     color: "#999",
//     fontSize: 16,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   button: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   cancelButton: {
//     backgroundColor: "transparent",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   cancelButtonText: {
//     color: "#666",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: "#4e54c8",
//   },
//   saveButtonDisabled: {
//     backgroundColor: "#ccc",
//   },
//   saveButtonText: {
//     color: "white",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   categoryTypeLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#444",
//     marginBottom: 15,
//   },
//   categoryGrid: {
//     paddingBottom: 20,
//   },
//   categoryOption: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     margin: 5,
//     minWidth: 80,
//   },
//   categoryIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//   },
//   categoryOptionText: {
//     fontSize: 12,
//     textAlign: "center",
//     color: "#333",
//     fontWeight: "500",
//   },
// });
// app/home/daily.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { createTransaction, getTransactionsRealtime } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";

// Category type definition
interface Category {
  id: string;
  name: string;
  icon: string;
  iconSet: "MaterialIcons" | "FontAwesome5" | "Ionicons" | "Feather";
  type: TransactionType;
}

export default function Daily() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [note, setNote] = useState("");
  const [type, setType] = useState<TransactionType>("income");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  // Categories data
  const categories: Category[] = [
    { id: "1", name: "Allowance", icon: "account-balance-wallet", iconSet: "MaterialIcons", type: "income" },
    { id: "2", name: "Salary", icon: "attach-money", iconSet: "MaterialIcons", type: "income" },
    { id: "3", name: "Freelance", icon: "laptop", iconSet: "FontAwesome5", type: "income" },
    { id: "4", name: "Investment", icon: "trending-up", iconSet: "MaterialIcons", type: "income" },
    { id: "5", name: "Gift", icon: "card-giftcard", iconSet: "MaterialIcons", type: "income" },
    { id: "6", name: "Food", icon: "restaurant", iconSet: "MaterialIcons", type: "expense" },
    { id: "7", name: "Shopping", icon: "shopping-cart", iconSet: "FontAwesome5", type: "expense" },
    { id: "8", name: "Transport", icon: "directions-car", iconSet: "MaterialIcons", type: "expense" },
    { id: "9", name: "Entertainment", icon: "theaters", iconSet: "MaterialIcons", type: "expense" },
    { id: "10", name: "Health", icon: "local-hospital", iconSet: "MaterialIcons", type: "expense" },
    { id: "11", name: "Education", icon: "school", iconSet: "MaterialIcons", type: "expense" },
    { id: "12", name: "Bills", icon: "receipt", iconSet: "MaterialIcons", type: "expense" },
    { id: "13", name: "Culture", icon: "palette", iconSet: "MaterialIcons", type: "expense" },
  ];

  // Real-time transactions
  useEffect(() => {
    setLoading(true);
    const unsubscribe = getTransactionsRealtime((data) => {
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      alert("Please fill amount and select a category");
      return;
    }

    try {
      showLoader();
      await createTransaction({
        amount: parseFloat(amount),
        category: selectedCategory.name,
        note,
        type,
        createdAt: new Date(),
        userId: user?.uid || ""
      });

      setAmount("");
      setSelectedCategory(null);
      setNote("");
      setModalVisible(false);
      alert("Saved ✅");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed ❌");
    } finally {
      hideLoader();
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Render icon based on category
  const renderIcon = (category: Category, size = 24, color = "#4e54c8") => {
    switch (category.iconSet) {
      case "MaterialIcons":
        return <MaterialIcons name={category.icon} size={size} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={category.icon} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={category.icon} size={size} color={color} />;
      case "Feather":
        return <Feather name={category.icon} size={size} color={color} />;
      default:
        return <MaterialIcons name="category" size={size} color={color} />;
    }
  };

  // Reset form when type changes
  useEffect(() => {
    setSelectedCategory(null);
  }, [type]);

  // Filter categories by type
  const incomeCategories = categories.filter(cat => cat.type === "income");
  const expenseCategories = categories.filter(cat => cat.type === "expense");

  // Calculate totals
  const incomeTotal = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseTotal = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netTotal = incomeTotal - expenseTotal;

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e54c8" />
        <Text style={styles.loadingText}>Loading your transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.monthText}>Sept 2025</Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryAmount, styles.incomeColor]}>Rs. {incomeTotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expenseColor]}>Rs. {expenseTotal.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.summaryCard, styles.totalCard]}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={[styles.summaryAmount, netTotal >= 0 ? styles.incomeColor : styles.expenseColor]}>
            Rs. {Math.abs(netTotal).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => {
          const transactionCategory = categories.find(cat => cat.name === item.category);
          return (
            <View style={[
              styles.transactionCard, 
              item.type === "income" ? styles.incomeCard : styles.expenseCard
            ]}>
              <View style={styles.transactionInfo}>
                <View style={styles.transactionCategoryRow}>
                  {transactionCategory && renderIcon(transactionCategory, 20, "#4e54c8")}
                  <Text style={styles.transactionCategory}>{item.category}</Text>
                </View>
                {item.note ? <Text style={styles.transactionNote}>{item.note}</Text> : null}
                <Text style={styles.transactionDate}>
                  {item.createdAt.toLocaleString()}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                item.type === "income" ? styles.incomeColor : styles.expenseColor
              ]}>
                {item.type === "income" ? "+" : "-"} Rs. {item.amount.toFixed(2)}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first transaction using the + button</Text>
          </View>
        }
      />

      {/* Floating + Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Transaction Type Selector */}
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeOption, type === "income" && styles.typeOptionActive]}
                  onPress={() => setType("income")}
                >
                  <MaterialIcons 
                    name="arrow-downward" 
                    size={20} 
                    color={type === "income" ? "white" : "#2ecc71"} 
                  />
                  <Text style={[styles.typeOptionText, type === "income" && styles.typeOptionTextActive]}>
                    Income
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.typeOption, type === "expense" && styles.typeOptionActive]}
                  onPress={() => setType("expense")}
                >
                  <MaterialIcons 
                    name="arrow-upward" 
                    size={20} 
                    color={type === "expense" ? "white" : "#e74c3c"} 
                  />
                  <Text style={[styles.typeOptionText, type === "expense" && styles.typeOptionTextActive]}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Amount (Rs.)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Category Selector */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <TouchableOpacity 
                  style={styles.categorySelector}
                  onPress={() => setShowCategoryModal(true)}
                >
                  {selectedCategory ? (
                    <View style={styles.selectedCategory}>
                      {renderIcon(selectedCategory, 22, type === "income" ? "#2ecc71" : "#e74c3c")}
                      <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>Select a category</Text>
                  )}
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Note Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Note (optional)</Text>
                <TextInput
                  style={[styles.input, styles.noteInput]}
                  placeholder="Add a note..."
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={2}
                  placeholderTextColor="#aaa"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton, (!amount || !selectedCategory) && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={!amount || !selectedCategory}
                >
                  <Text style={styles.saveButtonText}>Add Transaction</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Category Selection Modal */}
      <Modal transparent animationType="slide" visible={showCategoryModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.categoryModalContainer, { height: '75%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.categoryTypeLabel}>
              {type === "income" ? "Income Categories" : "Expense Categories"}
            </Text>
            
            <FlatList
              data={type === "income" ? incomeCategories : expenseCategories}
              keyExtractor={(item) => item.id}
              numColumns={4}
              contentContainerStyle={styles.categoryGrid}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryOption}
                  onPress={() => {
                    setSelectedCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={[
                    styles.categoryIconContainer,
                    { backgroundColor: type === "income" ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)" }
                  ]}>
                    {renderIcon(item, 24, type === "income" ? "#2ecc71" : "#e74c3c")}
                  </View>
                  <Text style={styles.categoryOptionText} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#4e54c8",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  monthText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  dateText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginTop: -25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalCard: {
    backgroundColor: "#FFC7A7",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  incomeColor: {
    color: "#2ecc71",
  },
  expenseColor: {
    color: "#e74c3c",
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  transactionInfo: {
    flex: 1,
  },  transactionCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  transactionNote: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#aaa",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4e54c8",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    backgroundColor: "white",
  },
  typeOptionActive: {
    backgroundColor: "#4e54c8",
    borderColor: "#4e54c8",
  },
  typeOptionText: {
    marginLeft: 8,
    color: "#333",
    fontWeight: "500",
  },
  typeOptionTextActive: {
    color: "white",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  noteInput: {
    height: 60,
    textAlignVertical: "top",
  },
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCategoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4e54c8",
  },
  saveButtonDisabled: {
    backgroundColor: "#999",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  categoryModalContainer: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
  },
  categoryTypeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginVertical: 10,
  },
  categoryGrid: {
    justifyContent: "center",
  },
  categoryOption: {
    flex: 1,
    margin: 8,
    alignItems: "center",
  },
  categoryIconContainer: {
    padding: 12,
    borderRadius: 50,
    marginBottom: 5,
  },
  categoryOptionText: {
    fontSize: 12,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});