import { Color, TextSize } from "@/constants/GlobalValue";
import { deleteTransaction } from "@/features/transaction/transactionSlice";
import { Transaction } from "@/features/transaction/transactionTypes";
import { RootState } from "@/store/store";
import { formatMoney } from "@/utils/formatMoney";
import { deleteDoc, doc, getFirestore } from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useDispatch, useSelector } from "react-redux";
import { CategoryIcon } from "../categoryIcons";
import RightAction from "./ReanimatedSwipeable";
import EditTransactionModal from "./dialogEdit";

interface ItemDetailMoneyProps {
  item: Transaction;
}

function ItemDetailMoney({ item }: ItemDetailMoneyProps) {
  const [visibleDialogEdit, setVisibleDialogEdit] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const handlerDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa :)))", [
      {
        text: "Hủy",
        style: "cancel", // nút xám + đóng alert
      },
      {
        text: "Xác nhận",
        onPress: confirmDelete,
      },
    ]);
  };
  const confirmDelete = async () => {
    try {
      if (!user) return;
      const db = getFirestore();
      const TransitionRef = doc(db, "User", user.uid, "Transactions", item.id);
      await deleteDoc(TransitionRef);
      dispatch(deleteTransaction(item.id)); // Cập nhật state sau khi xóa
      console.log("Xóa thành công");
    } catch (error) {
      console.log("không xóa được: " + error);
      Alert.alert("Lỗi");
    }
  };
  const handlerEdit = () => {
    setVisibleDialogEdit(true);
    console.log("Sua");
  };

  const onClose = () => {
    setVisibleDialogEdit(false);
  };
  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeContainer}
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, drag) => (
        <RightAction
          drag={drag}
          handlerDelete={handlerDelete}
          handlerEdit={handlerEdit}
        />
      )}
    >
      <EditTransactionModal
        onClose={onClose}
        visible={visibleDialogEdit}
        item={item}
      />
      <View style={styles.containerDetail}>
        <CategoryIcon category={item.category} size={28} />
        <View style={styles.detail}>
          <Text style={styles.detailCategory}>{item.category}</Text>
          <Text style={styles.detailNote}>{item.note}</Text>
        </View>

        <Text
          style={[
            styles.moneyItem,
            item.isExpense ? styles.expense : styles.income,
          ]}
        >
          {formatMoney(item.money)}
        </Text>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    backgroundColor: "white", // Quan trọng để vuốt mượt
  },
  containerDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff", // Nền trắng cho item chính
  },
  detail: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 15,
  },
  detailCategory: {
    fontSize: TextSize.TEXT_DEFAULT,
  },
  detailNote: {
    color: "#cbcbcb",
  },
  moneyItem: {
    fontSize: TextSize.TEXT_DEFAULT,
    fontWeight: "800", // SỬA LỖI: Phải là string "800", không dùng số
    color: "grey",
  },
  income: {
    color: Color.PRIMARY_COLOR,
  },
  expense: {
    color: "#d9534f",
  },
  // Style cho phần Action
});

export default ItemDetailMoney;
