import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import { evaluate } from "mathjs";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CalculatorScreen: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [activeTool, setActiveTool] = useState("standard");

  const handleButtonPress = (value: string) => {
    Haptics.selectionAsync();
    if (value === "=") {
      try {
        const evalResult = evaluate(input);
        setResult(evalResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "←") {
      setInput(input.slice(0, -1));
    } else if (value === "±") {
      if (input.startsWith("-")) {
        setInput(input.substring(1));
      } else {
        setInput("-" + input);
      }
    } else {
      setInput(input + value);
    }
  };

  const renderStandardCalculator = () => (
    <View style={styles.calculatorContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.calcButton, styles.functionButton]} onPress={() => handleButtonPress("C")}>
          <Text style={[styles.buttonText, styles.functionText]}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.functionButton]} onPress={() => handleButtonPress("±")}>
          <Text style={[styles.buttonText, styles.functionText]}>±</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.functionButton]} onPress={() => handleButtonPress("%")}>
          <Text style={[styles.buttonText, styles.functionText]}>%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.operatorButton]} onPress={() => handleButtonPress("/")}>
          <Text style={[styles.buttonText, styles.operatorText]}>÷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("7")}>
          <Text style={styles.buttonText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("8")}>
          <Text style={styles.buttonText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("9")}>
          <Text style={styles.buttonText}>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.operatorButton]} onPress={() => handleButtonPress("*")}>
          <Text style={[styles.buttonText, styles.operatorText]}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("4")}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("5")}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("6")}>
          <Text style={styles.buttonText}>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.operatorButton]} onPress={() => handleButtonPress("-")}>
          <Text style={[styles.buttonText, styles.operatorText]}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("1")}>
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("2")}>
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress("3")}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.operatorButton]} onPress={() => handleButtonPress("+")}>
          <Text style={[styles.buttonText, styles.operatorText]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.calcButton, styles.zeroButton]} onPress={() => handleButtonPress("0")}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calcButton} onPress={() => handleButtonPress(".")}>
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.calcButton, styles.equalsButton]} onPress={() => handleButtonPress("=")}>
          <Text style={[styles.buttonText, styles.equalsText]}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFinancialTools = () => (
    <View style={styles.toolsContainer}>
      <TouchableOpacity style={styles.toolCard}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.toolIcon}>
          <MaterialIcons name="restaurant" size={24} color="white" />
        </LinearGradient>
        <View style={styles.toolInfo}>
          <Text style={styles.toolTitle}>Tip Calculator</Text>
          <Text style={styles.toolDescription}>Calculate tips and split bills</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolCard}>
        <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.toolIcon}>
          <MaterialIcons name="credit-card" size={24} color="white" />
        </LinearGradient>
        <View style={styles.toolInfo}>
          <Text style={styles.toolTitle}>Loan Payment</Text>
          <Text style={styles.toolDescription}>Calculate loan payments and interest</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolCard}>
        <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.toolIcon}>
          <MaterialIcons name="trending-up" size={24} color="white" />
        </LinearGradient>
        <View style={styles.toolInfo}>
          <Text style={styles.toolTitle}>Savings Growth</Text>
          <Text style={styles.toolDescription}>Project investment growth over time</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Display Area */}
      <View style={styles.displayContainer}>
        <ScrollView 
          horizontal 
          contentContainerStyle={styles.displayContent}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.inputText} numberOfLines={1}>{input || "0"}</Text>
        </ScrollView>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText} numberOfLines={1}>{result}</Text>
        </View>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity 
          style={[styles.modeButton, activeTool === "standard" && styles.activeModeButton]}
          onPress={() => setActiveTool("standard")}
        >
          <Text style={[styles.modeText, activeTool === "standard" && styles.activeModeText]}>
            Calculator
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, activeTool === "financial" && styles.activeModeButton]}
          onPress={() => setActiveTool("financial")}
        >
          <Text style={[styles.modeText, activeTool === "financial" && styles.activeModeText]}>
            Financial Tools
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calculator or Financial Tools */}
      <View style={styles.contentArea}>
        {activeTool === "standard" ? renderStandardCalculator() : renderFinancialTools()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  displayContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  displayContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputText: {
    fontSize: 28,
    color: "#374151",
    textAlign: "right",
  },
  resultContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 10,
    paddingTop: 10,
  },
  resultText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4f46e5",
    textAlign: "right",
  },
  modeSelector: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeModeButton: {
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeModeText: {
    color: "#4f46e5",
  },
  contentArea: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calcButton: {
    width: (width - 80) / 4 - 8,
    height: (width - 80) / 4 - 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  zeroButton: {
    width: ((width - 80) / 4 - 8) * 2 + 12,
  },
  functionButton: {
    backgroundColor: "#f1f5f9",
  },
  operatorButton: {
    backgroundColor: "#4f46e5",
  },
  equalsButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  functionText: {
    color: "#4f46e5",
  },
  operatorText: {
    color: "white",
  },
  equalsText: {
    color: "white",
  },
  toolsContainer: {
    flex: 1,
  },
  toolCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default CalculatorScreen;