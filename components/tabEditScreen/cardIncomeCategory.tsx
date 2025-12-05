import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 1. Import thư viện
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryItem } from "./cardCategoryItem";
import AddCategoryModal from "./dialogAddCategory";

// Key để lưu dữ liệu (đặt tên gì cũng được nhưng phải duy nhất)
const STORAGE_KEY = "@income_list_data";

// export type IncomeCategoryItem = {
//   id: string;
//   name: string;
//   icon?: string;
//   library?: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
//   color: string;
//   isEditButton?: boolean;
// };

// Dữ liệu mặc định
const INCOME_CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    name: "Tiền lương",
    icon: "wallet-outline",
    library: "Ionicons",
    color: "#20b2aa",
  },
  {
    id: "2",
    name: "Tiền phụ cấp",
    icon: "piggy-bank-outline",
    library: "MaterialCommunityIcons",
    color: "#ff9800",
  },
  {
    id: "3",
    name: "Tiền thưởng",
    icon: "gift-outline",
    library: "Ionicons",
    color: "#f44336",
  },
  {
    id: "4",
    name: "Thu nhập phụ",
    icon: "sack-outline",
    library: "MaterialCommunityIcons",
    color: "#03a9f4",
  },
  {
    id: "5",
    name: "Đầu tư",
    icon: "coins",
    library: "FontAwesome5",
    color: "#009688",
  },
  {
    id: "6",
    name: "Thu nhập tạm",
    icon: "hand-holding-usd",
    library: "FontAwesome5",
    color: "#e91e63",
  },
  // Nút edit luôn ở cuối
  {
    id: "edit",
    name: "Chỉnh sửa",
    icon: "pencil-outline",
    library: "MaterialCommunityIcons",
    color: "#9e9e9e",
    isEditButton: true,
  },
];

interface IncomeCategoryGridProps {
  initialSelectedId?: string;
  onSelectCategory: (categoryName: string) => void;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 5;

function CardCategoryIncomeItem({
  initialSelectedId = "",
  onSelectCategory,
}: IncomeCategoryGridProps) {
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  const [incomeList, setIncomeList] =
    useState<CategoryItem[]>(INCOME_CATEGORIES);
  const [isModalVisible, setModalVisible] = useState(false);

  // 2. LOAD dữ liệu khi component vừa hiện lên (Mount)
  useEffect(() => {
    loadData();
  }, []);

  // Cập nhật selectedId nếu props thay đổi
  useEffect(() => {
    if (initialSelectedId) setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  // Hàm đọc dữ liệu từ máy
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        // Nếu có dữ liệu cũ -> Lấy ra dùng
        setIncomeList(JSON.parse(jsonValue));
      } else {
        // Nếu chưa có (lần đầu tải app) -> Dùng mặc định
        setIncomeList(INCOME_CATEGORIES);
      }
    } catch (e) {
      console.log("Lỗi đọc dữ liệu:", e);
    }
  };

  // Hàm lưu dữ liệu vào máy
  const saveData = async (newList: CategoryItem[]) => {
    try {
      const jsonValue = JSON.stringify(newList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log("Lỗi lưu dữ liệu:", e);
    }
  };

  const handledEdit = () => {
    setModalVisible(true);
  };

  const handleSaveNewCategory = (newItem: CategoryItem) => {
    const listCopy = [...incomeList];
    // Chèn vào vị trí kế cuối
    listCopy.splice(listCopy.length - 1, 0, newItem);

    setIncomeList(listCopy); // Cập nhật giao diện
    saveData(listCopy); // 3. Gọi hàm LƯU vào bộ nhớ máy

    setModalVisible(false);
  };

  const handlePress = (item: CategoryItem) => {
    if (item.isEditButton) {
      handledEdit();
      return;
    }
    setSelectedId(item.id);
    if (onSelectCategory) {
      onSelectCategory(item.name);
    }
  };

  const renderIcon = (item: CategoryItem) => {
    if (item.isEditButton || !item.icon || !item.library) return null;
    const iconColor = item.color;
    const size = 24;

    switch (item.library) {
      case "Ionicons":
        return (
          <Ionicons name={item.icon as any} size={size} color={iconColor} />
        );
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={item.icon as any}
            size={size}
            color={iconColor}
          />
        );
      case "FontAwesome5":
        return (
          <FontAwesome5 name={item.icon as any} size={size} color={iconColor} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNewCategory}
      />
      <Text style={styles.headerTitle}>Danh mục Thu nhập</Text>

      <View style={styles.gridContainer}>
        {incomeList.map((item) => {
          const isSelected = !item.isEditButton && selectedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemContainer,
                isSelected ? styles.itemSelected : styles.itemNormal,
              ]}
              onPress={() => handlePress(item)}
              activeOpacity={0.6}
            >
              <View style={styles.iconWrapper}>{renderIcon(item)}</View>
              <Text
                style={[
                  styles.itemName,
                  {
                    color: item.isEditButton
                      ? "#9e9e9e"
                      : isSelected
                      ? item.color
                      : "#666",
                  },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 15, backgroundColor: "#fff" },
  headerTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
    marginLeft: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  itemNormal: { borderWidth: 1, borderColor: "#e0e0e0" },
  itemSelected: {
    borderWidth: 1.5,
    borderColor: "#20b2aa",
    backgroundColor: "#f0fffe",
  },
  iconWrapper: { marginBottom: 4, height: 28, justifyContent: "center" },
  itemName: { fontSize: 11, textAlign: "center", paddingHorizontal: 2 },
});

export default CardCategoryIncomeItem;
