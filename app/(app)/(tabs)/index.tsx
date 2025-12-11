import CardCategoryItem from "@/components/tabEditScreen/cardCategoryItem";
import CardCategoryIncomeItem from "@/components/tabEditScreen/cardIncomeCategory";
import CardNote from "@/components/tabEditScreen/cardNote";
import CalendarButton from "@/components/tabEditScreen/cardTimeItem";
import CardValueMoney from "@/components/tabEditScreen/cardValueMoney";
import { Color, TextSize } from "@/constants/GlobalValue";
import { useSession } from "@/context/ctx";
import {
  addDoc,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export interface FormInput {
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [money, setMoney] = useState(0);
  const [category, setCateGory] = useState("");
  const [activeTab, setActiveTab] = useState("expense"); // 'expense' (Chi tiêu) hoặc 'income' (Thu nhập)
  // const [isExpense, setIsExpense] = useState(false);

  const { user } = useSession();

  // console.log(user);
  const handleChooseTabExpense = async () => {
    setActiveTab("expense");
    setMoney(0);
    setNote("");
  };
  const handleChooseTabIncome = () => {
    setActiveTab("income");
  };

  const handleAddExpense = async ({
    date,
    note,
    money,
    category,
    isExpense,
  }: FormInput) => {
    if (money === 0) {
      Alert.alert("Bạn chưa nhập số tiền");
      return;
    }
    if (category === "") {
      Alert.alert("Bạn chưa chọn danh mục");
      return;
    }
    try {
      if (!user) {
        console.log("Chưa đăng nhập!");
        return;
      }
      const db = getFirestore();
      const transCollectionRef = collection(
        db,
        "User",
        user?.uid,
        "Transactions"
      );
      await addDoc(transCollectionRef, {
        date: date,
        note: note,
        money: money,
        category: category,
        isExpense: true,
      });
      console.log("thành công");
      Alert.alert("thành công");
    } catch (error) {
      console.log("lỗi: " + error);
    } finally {
      setActiveTab("expense");
      setMoney(0);
      setNote("");
    }
  };
  const handleAddIncome = async ({
    date,
    note,
    money,
    category,
    isExpense,
  }: FormInput) => {
    if (money === 0) {
      Alert.alert("Bạn chưa nhập số tiền");
      return;
    }
    if (category === "") {
      Alert.alert("Bạn chưa chọn danh mục");
      return;
    }
    try {
      if (!user) {
        console.log("Chưa đăng nhập!");
        return;
      }
      const db = getFirestore();
      const transCollectionRef = collection(
        db,
        "User",
        user?.uid,
        "Transactions"
      );
      await addDoc(transCollectionRef, {
        date: date,
        note: note,
        money: money,
        category: category,
        isExpense: false,
      });
      Alert.alert("thành công");
      console.log("thành công");
    } catch (error) {
      console.log("lỗi: " + error);
    } finally {
      setActiveTab("income");
      setMoney(0);
      setNote("");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View style={styles.tabContainer}>
          {/* Tab Chi tiêu */}
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "expense" && styles.activeTab,
            ]}
            onPress={handleChooseTabExpense}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "expense" && styles.activeTabText,
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
          {/* Tab Thu nhập */}
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "income" && styles.activeTab,
            ]}
            onPress={handleChooseTabIncome}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "income" && styles.activeTabText,
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>
        {/* nội dung them từng tab */}
        <View style={styles.content}>
          {activeTab === "expense" ? (
            <View style={styles.tabScreen}>
              <ScrollView>
              <View>
                <CalendarButton date={date} updateDate={setDate} />
                <CardNote note={note} updateNote={setNote} />
                <CardValueMoney money={money} updateMoney={setMoney} />
                <CardCategoryItem onSelectCategory={setCateGory} />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.buttonConfirm}
                  onPress={() =>
                    handleAddExpense({
                      date,
                      note,
                      money,
                      category,
                      isExpense: true,
                    })
                  }
                >
                  <Text style={styles.textButton}>Nhập khoản tiền chi</Text>
                </TouchableOpacity>
              </View>
              {/* Input tiền, ngày tháng... */}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.tabScreen}>
              <ScrollView>
              <View>
                <CalendarButton date={date} updateDate={setDate} />
                <CardNote note={note} updateNote={setNote} />
                <CardValueMoney money={money} updateMoney={setMoney} />
                <CardCategoryIncomeItem onSelectCategory={setCateGory} />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.buttonConfirm}
                  onPress={() =>
                    handleAddIncome({
                      date,
                      note,
                      money,
                      category,
                      isExpense: false,
                    })
                  }
                >
                  <Text style={styles.textButton}>Nhập khoản tiền Thu</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabScreen: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1, // Chia đều 2 bên
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent", // Mặc định không hiện gạch chân
  },
  activeTab: {
    borderBottomColor: Color.PRIMARY_COLOR, // Màu xanh teal giống trong ảnh
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  activeTabText: {
    color: Color.PRIMARY_COLOR, // Chữ cũng đổi màu theo
    fontWeight: "bold",
  },
  buttonConfirm: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 20,
  },
  textButton: {
    fontSize: TextSize.TEXT_TITLE,
    color: "white",
    fontWeight: 700,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
