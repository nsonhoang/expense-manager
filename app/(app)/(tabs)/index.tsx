import CardCategoryItem from "@/components/tabEditScreen/cardCategoryItem";
import CardCategoryIncomeItem from "@/components/tabEditScreen/cardIncomeCategory";
import CardNote from "@/components/tabEditScreen/cardNote";
import CalendarButton from "@/components/tabEditScreen/cardTimeItem";
import CardValueMoney from "@/components/tabEditScreen/cardValueMoney";
import { Color, TextSize } from "@/constants/GlobalValue";
import { addTransaction } from "@/features/transaction/transactionSlice";
import { RootState } from "@/store/store";
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
import { useDispatch, useSelector } from "react-redux";

export interface FormInput {
  date: Date;
  note?: string;
  money: number;
  category: string;
  isExpense: boolean;
}

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user.user);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [money, setMoney] = useState(0);
  const [category, setCateGory] = useState("");
  const [activeTab, setActiveTab] = useState("expense"); // 'expense' (Chi tiêu) hoặc 'income' (Thu nhập)
  // const [isExpense, setIsExpense] = useState(false);

  const dispatch = useDispatch();
  // console.log(user);
  const handleChooseTabExpense = async () => {
    setActiveTab("expense");
    setMoney(0);
    setNote("");
  };
  const handleChooseTabIncome = () => {
    setActiveTab("income");
  };

  const handleAddTransaction = async () => {
    // 1. Validation
    if (money === 0) {
      Alert.alert("Lỗi", "Bạn chưa nhập số tiền.");
      return;
    }
    if (category === "") {
      Alert.alert("Lỗi", "Bạn chưa chọn danh mục.");
      return;
    }
    if (!user) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập.");
      return;
    }

    // 2. Chuẩn bị dữ liệu
    const isExpense = activeTab === "expense";
    const newTransaction = {
      // Tạo một ID tạm thời ở client để cập nhật UI ngay lập tức
      id: new Date().getTime().toString(),
      date,
      note,
      money,
      category,
      isExpense,
    };

    try {
      // 3. Cập nhật UI ngay lập tức (Optimistic Update)
      dispatch(addTransaction(newTransaction));

      // 4. Reset form
      setMoney(0);
      setNote("");
      setCateGory(""); // Reset cả category
      Keyboard.dismiss();
      Alert.alert("Thành công", "Đã thêm giao dịch mới.");

      // 5. Gửi dữ liệu lên Firestore ở chế độ nền
      const db = getFirestore();
      const transCollectionRef = collection(
        db,
        "User",
        user.uid,
        "Transactions",
      );
      // Gửi object không có id tạm thời
      await addDoc(transCollectionRef, {
        date: newTransaction.date,
        note: newTransaction.note,
        money: newTransaction.money,
        category: newTransaction.category,
        isExpense: newTransaction.isExpense,
      });
      console.log("Đồng bộ lên Firestore thành công");
    } catch (error) {
      console.log("Lỗi khi thêm giao dịch: " + error);
      Alert.alert("Lỗi", "Không thể thêm giao dịch. Vui lòng thử lại.");
      // Cần có logic để rollback lại state Redux nếu cần
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
                    onPress={() => handleAddTransaction()}
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
                    onPress={() => handleAddTransaction()}
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
    marginTop: 10,
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
