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
// });import { useState, useEffect } from "react";import { useState, useEffect } from "react";
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
  StatusBar
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { createTransaction, getTransactionsRealtime } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  iconSet: "MaterialIcons" | "FontAwesome5" | "Ionicons" | "Feather";
  type: TransactionType;
  gradient: string[];
}

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
      alert("Transaction added successfully!");
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }

  return (
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
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <LinearGradient colors={['#4ade80', '#22c55e']} style={styles.summaryGradient}>
                <MaterialIcons name="trending-up" size={24} color="white" />
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={styles.summaryAmount}>Rs. {incomeTotal.toLocaleString()}</Text>
              </LinearGradient>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard]}>
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
            transactions.slice(0, 6).map((item, index) => {
              const transactionCategory = categories.find(cat => cat.name === item.category);
              return (
                <View key={item.id || index} style={styles.transactionCard}>
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
              );
            })
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
        onPress={() => setModalVisible(true)}
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
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={28} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Transaction</Text>
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
                <Text style={styles.saveButtonText}>Add Transaction</Text>
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
});